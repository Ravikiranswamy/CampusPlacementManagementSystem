package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'audit_logs' table.
 * Records administrative and critical system actions for governance and accountability.
 */
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;

    @Column(name = "action_type", nullable = false, length = 60)
    private String actionType;

    @Column(name = "entity_name", nullable = false, length = 60)
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "action_detail")
    private String actionDetail;

    @Column(name = "performed_at", nullable = false, updatable = false)
    private LocalDateTime performedAt;

    @PrePersist
    protected void onCreate() {
        if (performedAt == null) performedAt = LocalDateTime.now();
    }

    public AuditLog() {}

    public AuditLog(User performedBy, String actionType, String entityName, Long entityId, String actionDetail) {
        this.performedBy = performedBy;
        this.actionType = actionType;
        this.entityName = entityName;
        this.entityId = entityId;
        this.actionDetail = actionDetail;
    }

    public Long getLogId()                 { return logId; }
    public User getPerformedBy()           { return performedBy; }
    public String getActionType()          { return actionType; }
    public String getEntityName()          { return entityName; }
    public Long getEntityId()              { return entityId; }
    public String getActionDetail()        { return actionDetail; }
    public LocalDateTime getPerformedAt()  { return performedAt; }

    public void setLogId(Long logId)                       { this.logId = logId; }
    public void setPerformedBy(User performedBy)           { this.performedBy = performedBy; }
    public void setActionType(String actionType)           { this.actionType = actionType; }
    public void setEntityName(String entityName)           { this.entityName = entityName; }
    public void setEntityId(Long entityId)                 { this.entityId = entityId; }
    public void setActionDetail(String actionDetail)       { this.actionDetail = actionDetail; }
    public void setPerformedAt(LocalDateTime performedAt)  { this.performedAt = performedAt; }
}
