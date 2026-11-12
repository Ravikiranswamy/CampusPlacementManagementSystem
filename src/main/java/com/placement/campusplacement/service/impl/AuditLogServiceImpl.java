package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.AuditLogResponse;
import com.placement.campusplacement.entity.AuditLog;
import com.placement.campusplacement.entity.User;
import com.placement.campusplacement.repository.AuditLogRepository;
import com.placement.campusplacement.repository.UserRepository;
import com.placement.campusplacement.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(Long performedByUserId, String actionType, String entityName, Long entityId, String detail) {
        userRepository.findById(performedByUserId).ifPresent(user -> {
            AuditLog auditLog = new AuditLog(user, actionType, entityName, entityId, detail);
            auditLogRepository.save(auditLog);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        AuditLogResponse res = new AuditLogResponse();
        res.setLogId(log.getLogId());
        res.setPerformedByUserId(log.getPerformedBy().getUserId());
        res.setPerformedByName(log.getPerformedBy().getFullName());
        res.setPerformedByRole(log.getPerformedBy().getRole());
        res.setActionType(log.getActionType());
        res.setEntityName(log.getEntityName());
        res.setEntityId(log.getEntityId());
        res.setActionDetail(log.getActionDetail());
        res.setPerformedAt(log.getPerformedAt());
        return res;
    }
}

