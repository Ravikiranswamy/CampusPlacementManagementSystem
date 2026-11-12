package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.ApplicationResponse;
import com.placement.campusplacement.dto.EligibilityCheckResponse;
import com.placement.campusplacement.dto.request.ApplicationRequest;
import com.placement.campusplacement.dto.request.ApplicationStatusUpdateRequest;
import com.placement.campusplacement.entity.Application;
import com.placement.campusplacement.entity.PlacementDrive;
import com.placement.campusplacement.entity.Student;
import com.placement.campusplacement.exception.BusinessRuleException;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.ApplicationRepository;
import com.placement.campusplacement.repository.PlacementDriveRepository;
import com.placement.campusplacement.repository.StudentRepository;
import com.placement.campusplacement.service.ApplicationService;
import com.placement.campusplacement.service.EligibilityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final PlacementDriveRepository driveRepository;
    private final EligibilityService eligibilityService;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  StudentRepository studentRepository,
                                  PlacementDriveRepository driveRepository,
                                  EligibilityService eligibilityService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.driveRepository = driveRepository;
        this.eligibilityService = eligibilityService;
    }

    @Override
    @Transactional
    public ApplicationResponse applyForDrive(ApplicationRequest request) {
        Long studentId = request.getStudentId();
        Long driveId = request.getDriveId();

        // 1. Guard against duplicate applications
        if (applicationRepository.existsByStudent_StudentIdAndDrive_DriveId(studentId, driveId)) {
            throw new DuplicateResourceException("You have already applied for this placement drive.");
        }

        // 2. Comprehensive real-time eligibility evaluation
        EligibilityCheckResponse check = eligibilityService.checkEligibility(studentId, driveId);
        if (!check.isEligible()) {
            throw new BusinessRuleException("Cannot apply: " + String.join(" ", check.getReasons()));
        }

        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        PlacementDrive drive = driveRepository.findByIdWithDetails(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        Application application = new Application();
        application.setStudent(student);
        application.setDrive(drive);
        application.setStatus("APPLIED");
        application.setEligibilityVerified(true);
        application.setRemarks(request.getRemarks());

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return applicationRepository.findByStudentIdWithDetails(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByDrive(Long driveId) {
        if (!driveRepository.existsById(driveId)) {
            throw new ResourceNotFoundException("PlacementDrive", "id", driveId);
        }
        return applicationRepository.findByDriveIdWithDetails(driveId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId) {
        Application app = applicationRepository.findByIdWithDetails(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToResponse(app);
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        Application app = applicationRepository.findByIdWithDetails(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        app.setStatus(request.getStatus().toUpperCase());
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            app.setRemarks(request.getRemarks());
        }

        Application updated = applicationRepository.save(app);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void withdrawApplication(Long applicationId, Long studentId) {
        Application app = applicationRepository.findByIdWithDetails(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!app.getStudent().getStudentId().equals(studentId)) {
            throw new BusinessRuleException("Unauthorized: Application does not belong to this student.");
        }

        if ("SELECTED".equalsIgnoreCase(app.getStatus())) {
            throw new BusinessRuleException("Cannot withdraw an application after selection.");
        }

        if ("WITHDRAWN".equalsIgnoreCase(app.getStatus())) {
            throw new BusinessRuleException("Application has already been withdrawn.");
        }

        app.setStatus("WITHDRAWN");
        applicationRepository.save(app);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse res = new ApplicationResponse();
        res.setApplicationId(app.getApplicationId());

        res.setStudentId(app.getStudent().getStudentId());
        res.setStudentName(app.getStudent().getUser().getFullName());
        res.setEmail(app.getStudent().getUser().getEmail());
        res.setUsn(app.getStudent().getUsn());
        res.setDepartmentName(app.getStudent().getDepartment().getDepartmentName());
        res.setStudentCgpa(app.getStudent().getCgpa());
        res.setStudentBacklogs(app.getStudent().getActiveBacklogs());

        res.setDriveId(app.getDrive().getDriveId());
        res.setDriveTitle(app.getDrive().getDriveTitle());
        res.setCompanyName(app.getDrive().getCompany().getCompanyName());
        res.setRoleTitle(app.getDrive().getJobRole().getRoleTitle());
        res.setJobType(app.getDrive().getJobRole().getJobType());
        res.setPackageLpa(app.getDrive().getJobRole().getPackageLpa());

        res.setAppliedAt(app.getAppliedAt());
        res.setStatus(app.getStatus());
        res.setEligibilityVerified(app.getEligibilityVerified());
        res.setRemarks(app.getRemarks());

        return res;
    }
}

