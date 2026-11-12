package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.AuditLogResponse;

import java.util.List;

public interface AuditLogService {

    void log(Long performedByUserId, String actionType, String entityName, Long entityId, String detail);

    List<AuditLogResponse> getAllLogs();
}

