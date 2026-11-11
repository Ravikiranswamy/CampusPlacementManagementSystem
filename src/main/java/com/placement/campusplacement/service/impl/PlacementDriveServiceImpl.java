package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.DepartmentResponse;
import com.placement.campusplacement.dto.DriveEligibilityResponse;
import com.placement.campusplacement.dto.PlacementDriveResponse;
import com.placement.campusplacement.dto.request.DriveCreateRequest;
import com.placement.campusplacement.dto.request.DriveEligibilityRequest;
import com.placement.campusplacement.dto.request.DriveUpdateRequest;
import com.placement.campusplacement.entity.*;
import com.placement.campusplacement.exception.BusinessRuleException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.*;
import com.placement.campusplacement.service.PlacementDriveService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlacementDriveServiceImpl implements PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final JobRoleRepository jobRoleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DriveEligibilityRepository eligibilityRepository;
    private final DriveEligibilityDepartmentRepository eligibilityDeptRepository;

    public PlacementDriveServiceImpl(PlacementDriveRepository driveRepository,
                                     CompanyRepository companyRepository,
                                     JobRoleRepository jobRoleRepository,
                                     UserRepository userRepository,
                                     DepartmentRepository departmentRepository,
                                     DriveEligibilityRepository eligibilityRepository,
                                     DriveEligibilityDepartmentRepository eligibilityDeptRepository) {
        this.driveRepository = driveRepository;
        this.companyRepository = companyRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.eligibilityRepository = eligibilityRepository;
        this.eligibilityDeptRepository = eligibilityDeptRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementDriveResponse> getAllDrives() {
        return driveRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementDriveResponse> getPublishedDrives() {
        return driveRepository.findByStatusWithDetails("PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementDriveResponse getDriveById(Long id) {
        PlacementDrive drive = driveRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", id));
        return mapToResponse(drive);
    }

    @Override
    @Transactional
    public PlacementDriveResponse createDrive(DriveCreateRequest request) {
        if (request.getRegistrationDeadline().toLocalDate().isAfter(request.getDriveDate())) {
            throw new BusinessRuleException("Registration deadline cannot be after the drive date.");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));

        JobRole jobRole = jobRoleRepository.findById(request.getJobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("JobRole", "id", request.getJobRoleId()));

        if (!jobRole.getCompany().getCompanyId().equals(company.getCompanyId())) {
            throw new BusinessRuleException("The selected job role does not belong to the selected company.");
        }

        User creator = userRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getCreatedByUserId()));

        PlacementDrive drive = new PlacementDrive();
        drive.setCompany(company);
        drive.setJobRole(jobRole);
        drive.setDriveTitle(request.getDriveTitle().trim());
        drive.setRegistrationDeadline(request.getRegistrationDeadline());
        drive.setDriveDate(request.getDriveDate());
        drive.setStatus("DRAFT");
        drive.setDescription(request.getDescription());
        drive.setCreatedBy(creator);
        PlacementDrive savedDrive = driveRepository.save(drive);

        DriveEligibilityRequest eligReq = request.getEligibility();
        DriveEligibility eligibility = new DriveEligibility();
        eligibility.setDrive(savedDrive);
        eligibility.setMinCgpa(eligReq.getMinCgpa());
        eligibility.setMaxActiveBacklogs(eligReq.getMaxActiveBacklogs());
        eligibility.setEligibleGraduationYear(eligReq.getEligibleGraduationYear());
        eligibility.setAdditionalCriteria(eligReq.getAdditionalCriteria());
        DriveEligibility savedEligibility = eligibilityRepository.save(eligibility);

        List<DriveEligibilityDepartment> deptMappings = new ArrayList<>();
        for (Long deptId : eligReq.getEligibleDepartmentIds()) {
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", deptId));
            DriveEligibilityDepartment mapping = new DriveEligibilityDepartment(savedEligibility, dept, null, true);
            deptMappings.add(mapping);
        }
        eligibilityDeptRepository.saveAll(deptMappings);
        savedEligibility.setEligibleDepartments(deptMappings);
        savedDrive.setEligibility(savedEligibility);

        return mapToResponse(savedDrive);
    }

    @Override
    @Transactional
    public PlacementDriveResponse updateDrive(Long id, DriveUpdateRequest request) {
        PlacementDrive drive = driveRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", id));

        if (request.getDriveTitle() != null && !request.getDriveTitle().isBlank()) {
            drive.setDriveTitle(request.getDriveTitle().trim());
        }
        if (request.getRegistrationDeadline() != null) {
            drive.setRegistrationDeadline(request.getRegistrationDeadline());
        }
        if (request.getDriveDate() != null) {
            drive.setDriveDate(request.getDriveDate());
        }
        if (drive.getRegistrationDeadline().toLocalDate().isAfter(drive.getDriveDate())) {
            throw new BusinessRuleException("Registration deadline cannot be after the drive date.");
        }
        if (request.getStatus() != null) {
            drive.setStatus(request.getStatus().toUpperCase());
        }
        if (request.getDescription() != null) {
            drive.setDescription(request.getDescription());
        }

        PlacementDrive updated = driveRepository.save(drive);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public PlacementDriveResponse updateDriveStatus(Long id, String status) {
        PlacementDrive drive = driveRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", id));

        String upper = status.trim().toUpperCase();
        if (!List.of("DRAFT", "PUBLISHED", "CLOSED", "CANCELLED").contains(upper)) {
            throw new BusinessRuleException("Invalid drive status: " + status);
        }

        drive.setStatus(upper);
        PlacementDrive updated = driveRepository.save(drive);
        return mapToResponse(updated);
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

