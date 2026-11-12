package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

public class AuditLogResponse {

    private Long logId;
    private Long performedByUserId;
    private String performedByName;
    private String performedByRole;
    private String actionType;
    private String entityName;
    private Long entityId;
    private String actionDetail;
    private LocalDateTime performedAt;

    public AuditLogResponse() {}

    public Long getLogId()                 { return logId; }
    public Long getPerformedByUserId()     { return performedByUserId; }
    public String getPerformedByName()     { return performedByName; }
    public String getPerformedByRole()     { return performedByRole; }
    public String getActionType()          { return actionType; }
    public String getEntityName()          { return entityName; }
    public Long getEntityId()              { return entityId; }
    public String getActionDetail()        { return actionDetail; }
    public LocalDateTime getPerformedAt()  { return performedAt; }

    public void setLogId(Long logId)                       { this.logId = logId; }
    public void setPerformedByUserId(Long performedByUserId){ this.performedByUserId = performedByUserId; }
    public void setPerformedByName(String performedByName) { this.performedByName = performedByName; }
    public void setPerformedByRole(String performedByRole) { this.performedByRole = performedByRole; }
    public void setActionType(String actionType)           { this.actionType = actionType; }
    public void setEntityName(String entityName)           { this.entityName = entityName; }
    public void setEntityId(Long entityId)                 { this.entityId = entityId; }
    public void setActionDetail(String actionDetail)       { this.actionDetail = actionDetail; }
    public void setPerformedAt(LocalDateTime performedAt)  { this.performedAt = performedAt; }
}

