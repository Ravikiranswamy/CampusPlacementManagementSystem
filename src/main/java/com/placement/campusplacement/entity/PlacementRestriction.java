package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity mapping 'placement_restrictions'.
 * Records disciplinary actions / restrictions placed on students by placement officers.
 */
@Entity
@Table(name = "placement_restrictions")
public class PlacementRestriction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restriction_id")
    private Long restrictionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imposed_by", nullable = false)
    private User imposedBy;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate = LocalDate.now();

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "unblocked_at")
    private LocalDateTime unblockedAt;

    @Column(name = "unblock_reason")
    private String unblockReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public PlacementRestriction() {}

    public Long getRestrictionId()             { return restrictionId; }
    public Student getStudent()                { return student; }
    public User getImposedBy()                 { return imposedBy; }
    public String getReason()                  { return reason; }
    public LocalDate getStartDate()            { return startDate; }
    public LocalDate getEndDate()              { return endDate; }
    public Boolean getIsActive()               { return isActive; }
    public LocalDateTime getUnblockedAt()      { return unblockedAt; }
    public String getUnblockReason()           { return unblockReason; }
    public LocalDateTime getCreatedAt()        { return createdAt; }

    public void setRestrictionId(Long id)                  { this.restrictionId = id; }
    public void setStudent(Student student)                { this.student = student; }
    public void setImposedBy(User imposedBy)               { this.imposedBy = imposedBy; }
    public void setReason(String reason)                   { this.reason = reason; }
    public void setStartDate(LocalDate startDate)          { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate)              { this.endDate = endDate; }
    public void setIsActive(Boolean isActive)              { this.isActive = isActive; }
    public void setUnblockedAt(LocalDateTime unblockedAt)  { this.unblockedAt = unblockedAt; }
    public void setUnblockReason(String unblockReason)     { this.unblockReason = unblockReason; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }
}

