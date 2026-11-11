package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.RestrictionResponse;
import com.placement.campusplacement.dto.request.RestrictionRequest;
import com.placement.campusplacement.dto.request.UnblockRequest;
import com.placement.campusplacement.entity.PlacementRestriction;
import com.placement.campusplacement.entity.Student;
import com.placement.campusplacement.entity.User;
import com.placement.campusplacement.exception.BusinessRuleException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.PlacementRestrictionRepository;
import com.placement.campusplacement.repository.StudentRepository;
import com.placement.campusplacement.repository.UserRepository;
import com.placement.campusplacement.service.AuditLogService;
import com.placement.campusplacement.service.RestrictionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RestrictionServiceImpl implements RestrictionService {

    private final PlacementRestrictionRepository restrictionRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public RestrictionServiceImpl(PlacementRestrictionRepository restrictionRepository,
                                  StudentRepository studentRepository,
                                  UserRepository userRepository,
                                  AuditLogService auditLogService) {
        this.restrictionRepository = restrictionRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional
    public RestrictionResponse blockStudent(RestrictionRequest request) {
        Student student = studentRepository.findByIdWithDetails(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        User officer = userRepository.findById(request.getOfficerUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOfficerUserId()));

        if (!"PLACEMENT_OFFICER".equalsIgnoreCase(officer.getRole())) {
            throw new BusinessRuleException("Only users with role PLACEMENT_OFFICER can impose placement restrictions.");
        }

        LocalDate start = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        if (request.getEndDate() != null && request.getEndDate().isBefore(start)) {
            throw new BusinessRuleException("Restriction end date cannot be earlier than the start date.");
        }

        List<PlacementRestriction> active =
                restrictionRepository.findActiveRestrictionsForStudent(student.getStudentId(), LocalDate.now());
        if (!active.isEmpty()) {
            throw new BusinessRuleException("Student " + student.getUsn() + " already has an active placement restriction.");
        }

        PlacementRestriction restriction = new PlacementRestriction();
        restriction.setStudent(student);
        restriction.setImposedBy(officer);
        restriction.setReason(request.getReason().trim());
        restriction.setStartDate(start);
        restriction.setEndDate(request.getEndDate());
        restriction.setIsActive(true);

        PlacementRestriction saved = restrictionRepository.save(restriction);

        auditLogService.log(
                officer.getUserId(),
                "STUDENT_BLOCKED",
                "STUDENT",
                student.getStudentId(),
                "Imposed restriction on " + student.getUsn() + ". Reason: " + request.getReason()
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RestrictionResponse unblockStudent(Long restrictionId, UnblockRequest request) {
        PlacementRestriction restriction = restrictionRepository.findById(restrictionId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementRestriction", "id", restrictionId));

        if (!restriction.getIsActive()) {
            throw new BusinessRuleException("This placement restriction is already inactive / unblocked.");
        }

        User officer = userRepository.findById(request.getOfficerUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOfficerUserId()));

        if (!"PLACEMENT_OFFICER".equalsIgnoreCase(officer.getRole())) {
            throw new BusinessRuleException("Only users with role PLACEMENT_OFFICER can remove placement restrictions.");
        }

        restriction.setIsActive(false);
        restriction.setUnblockedAt(LocalDateTime.now());
        restriction.setUnblockReason(request.getUnblockReason().trim());

        PlacementRestriction updated = restrictionRepository.save(restriction);

        auditLogService.log(
                officer.getUserId(),
                "STUDENT_UNBLOCKED",
                "STUDENT",
                restriction.getStudent().getStudentId(),
                "Unblocked student " + restriction.getStudent().getUsn() + ". Reason: " + request.getUnblockReason()
        );

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestrictionResponse> getAllRestrictions() {
        return restrictionRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestrictionResponse> getStudentRestrictionHistory(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return restrictionRepository.findHistoryByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private RestrictionResponse mapToResponse(PlacementRestriction r) {
        RestrictionResponse res = new RestrictionResponse();
        res.setRestrictionId(r.getRestrictionId());
        res.setStudentId(r.getStudent().getStudentId());
        res.setStudentName(r.getStudent().getUser().getFullName());
        res.setEmail(r.getStudent().getUser().getEmail());
        res.setUsn(r.getStudent().getUsn());
        res.setDepartmentName(r.getStudent().getDepartment().getDepartmentName());

        res.setImposedByUserId(r.getImposedBy().getUserId());
        res.setImposedByName(r.getImposedBy().getFullName());

        res.setReason(r.getReason());
        res.setStartDate(r.getStartDate());
        res.setEndDate(r.getEndDate());
        res.setIsActive(r.getIsActive());
        res.setUnblockedAt(r.getUnblockedAt());
        res.setUnblockReason(r.getUnblockReason());
        res.setCreatedAt(r.getCreatedAt());

        return res;
    }
}
