package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.DepartmentResponse;
import com.placement.campusplacement.dto.DriveEligibilityResponse;
import com.placement.campusplacement.dto.EligibilityCheckResponse;
import com.placement.campusplacement.dto.PlacementDriveResponse;
import com.placement.campusplacement.entity.*;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.*;
import com.placement.campusplacement.service.EligibilityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    private final StudentRepository studentRepository;
    private final PlacementDriveRepository driveRepository;
    private final PlacementRestrictionRepository restrictionRepository;
    private final DriveEligibilityDepartmentRepository eligibilityDeptRepository;

    public EligibilityServiceImpl(StudentRepository studentRepository,
                                  PlacementDriveRepository driveRepository,
                                  PlacementRestrictionRepository restrictionRepository,
                                  DriveEligibilityDepartmentRepository eligibilityDeptRepository) {
        this.studentRepository = studentRepository;
        this.driveRepository = driveRepository;
        this.restrictionRepository = restrictionRepository;
        this.eligibilityDeptRepository = eligibilityDeptRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public EligibilityCheckResponse checkEligibility(Long studentId, Long driveId) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        PlacementDrive drive = driveRepository.findByIdWithDetails(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        EligibilityCheckResponse res = new EligibilityCheckResponse();
        res.setStudentId(student.getStudentId());
        res.setStudentName(student.getUser().getFullName());
        res.setUsn(student.getUsn());
        res.setDriveId(drive.getDriveId());
        res.setDriveTitle(drive.getDriveTitle());
        res.setCompanyName(drive.getCompany().getCompanyName());

        res.setStudentCgpa(student.getCgpa());
        res.setStudentBacklogs(student.getActiveBacklogs());

        List<String> reasons = new ArrayList<>();

        // 1. Check Disciplinary Restrictions
        List<PlacementRestriction> activeRestrictions =
                restrictionRepository.findActiveRestrictionsForStudent(studentId, LocalDate.now());
        boolean notRestricted = activeRestrictions.isEmpty();
        res.setNotRestricted(notRestricted);
        if (!notRestricted) {
            reasons.add("Student has an active placement restriction imposed by the placement cell.");
        }

        // 2. Check Drive Status
        boolean driveOpen = "PUBLISHED".equalsIgnoreCase(drive.getStatus());
        res.setDriveOpen(driveOpen);
        if (!driveOpen) {
            reasons.add("Placement drive is not open for applications (current status: " + drive.getStatus() + ").");
        }

        // 3. Check Deadline
        boolean deadlineValid = LocalDateTime.now().isBefore(drive.getRegistrationDeadline());
        res.setDeadlineValid(deadlineValid);
        if (!deadlineValid) {
            reasons.add("Registration deadline has passed on " + drive.getRegistrationDeadline() + ".");
        }

        // 4. Academic Criteria from DriveEligibility
        DriveEligibility eligibility = drive.getEligibility();
        if (eligibility != null) {
            res.setRequiredMinCgpa(eligibility.getMinCgpa());
            res.setAllowedMaxBacklogs(eligibility.getMaxActiveBacklogs());

            // 4a. CGPA Check
            boolean cgpaOk = student.getCgpa().compareTo(eligibility.getMinCgpa()) >= 0;
            res.setCgpaSatisfied(cgpaOk);
            if (!cgpaOk) {
                reasons.add("Minimum CGPA required is " + eligibility.getMinCgpa() + ", student CGPA is " + student.getCgpa() + ".");
            }

            // 4b. Active Backlogs Check
            boolean backlogsOk = student.getActiveBacklogs() <= eligibility.getMaxActiveBacklogs();
            res.setBacklogsSatisfied(backlogsOk);
            if (!backlogsOk) {
                reasons.add("Maximum allowed active backlogs is " + eligibility.getMaxActiveBacklogs() +
                            ", student currently has " + student.getActiveBacklogs() + " backlog(s).");
            }

            // 4c. Graduation Year Check
            boolean yearOk = student.getGraduationYear().equals(eligibility.getEligibleGraduationYear());
            res.setGraduationYearSatisfied(yearOk);
            if (!yearOk) {
                reasons.add("Drive is specifically open for batch of " + eligibility.getEligibleGraduationYear() +
                            ", student graduation year is " + student.getGraduationYear() + ".");
            }

            // 4d. Department Check
            List<DriveEligibilityDepartment> allowedDepts =
                    eligibilityDeptRepository.findByEligibilityIdWithDept(eligibility.getEligibilityId());
            Long studentDeptId = student.getDepartment().getDepartmentId();
            boolean deptOk = allowedDepts.stream()
                    .anyMatch(d -> d.getDepartment().getDepartmentId().equals(studentDeptId));
            res.setDepartmentSatisfied(deptOk);
            if (!deptOk) {
                reasons.add("Department '" + student.getDepartment().getDepartmentName() + "' is not eligible for this drive.");
            }

            boolean isOverallEligible = notRestricted && driveOpen && deadlineValid && cgpaOk && backlogsOk && yearOk && deptOk;
            res.setEligible(isOverallEligible);
        } else {
            // No strict academic criteria configured
            res.setCgpaSatisfied(true);
            res.setBacklogsSatisfied(true);
            res.setGraduationYearSatisfied(true);
            res.setDepartmentSatisfied(true);
            boolean isOverallEligible = notRestricted && driveOpen && deadlineValid;
            res.setEligible(isOverallEligible);
        }

        if (res.isEligible()) {
            reasons.add("Student satisfies all academic, department, and disciplinary eligibility requirements.");
        }
        res.setReasons(reasons);

        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementDriveResponse> getEligibleDrivesForStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }

        List<PlacementDrive> publishedDrives = driveRepository.findByStatusWithDetails("PUBLISHED");
        List<PlacementDriveResponse> eligibleDrives = new ArrayList<>();

        for (PlacementDrive drive : publishedDrives) {
            EligibilityCheckResponse check = checkEligibility(studentId, drive.getDriveId());
            if (check.isEligible()) {
                eligibleDrives.add(mapToResponse(drive));
            }
        }

        return eligibleDrives;
    }

    private PlacementDriveResponse mapToResponse(PlacementDrive drive) {
        PlacementDriveResponse res = new PlacementDriveResponse();
        res.setDriveId(drive.getDriveId());
        res.setCompanyId(drive.getCompany().getCompanyId());
        res.setCompanyName(drive.getCompany().getCompanyName());
        res.setJobRoleId(drive.getJobRole().getJobRoleId());
        res.setRoleTitle(drive.getJobRole().getRoleTitle());
        res.setJobType(drive.getJobRole().getJobType());
        res.setPackageLpa(drive.getJobRole().getPackageLpa());
        res.setWorkLocation(drive.getJobRole().getWorkLocation());
        res.setDriveTitle(drive.getDriveTitle());
        res.setRegistrationDeadline(drive.getRegistrationDeadline());
        res.setDriveDate(drive.getDriveDate());
        res.setStatus(drive.getStatus());
        res.setDescription(drive.getDescription());
        res.setCreatedByUserId(drive.getCreatedBy().getUserId());
        res.setCreatedByUserName(drive.getCreatedBy().getFullName());
        res.setCreatedAt(drive.getCreatedAt());

        if (drive.getEligibility() != null) {
            DriveEligibility el = drive.getEligibility();
            List<DriveEligibilityDepartment> mappings = eligibilityDeptRepository.findByEligibilityIdWithDept(el.getEligibilityId());
            List<DepartmentResponse> depts = mappings.stream()
                    .map(m -> new DepartmentResponse(
                            m.getDepartment().getDepartmentId(),
                            m.getDepartment().getDepartmentCode(),
                            m.getDepartment().getDepartmentName(),
                            m.getDepartment().getHodName(),
                            m.getDepartment().getOfficeEmail(),
                            m.getDepartment().getCreatedAt()
                    ))
                    .toList();

            DriveEligibilityResponse elRes = new DriveEligibilityResponse(
                    el.getEligibilityId(),
                    el.getMinCgpa(),
                    el.getMaxActiveBacklogs(),
                    el.getEligibleGraduationYear(),
                    el.getAdditionalCriteria(),
                    depts
            );
            res.setEligibility(elRes);
        }

        return res;
    }
}

