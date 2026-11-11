package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'applications' table.
 * Records a student's formal application for a placement drive.
 * Enforces UNIQUE (student_id, drive_id) so students cannot duplicate applications.
 */
@Entity
@Table(name = "applications",
       uniqueConstraints = @UniqueConstraint(name = "uq_student_drive", columnNames = {"student_id", "drive_id"}))
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    /**
     * Application status: APPLIED, UNDER_REVIEW, SELECTED, REJECTED, WITHDRAWN
     */
    @Column(name = "status", nullable = false, length = 30)
    private String status = "APPLIED";

    @Column(name = "eligibility_verified", nullable = false)
    private Boolean eligibilityVerified = false;

    @Column(name = "remarks")
    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) appliedAt = LocalDateTime.now();
    }

    public Application() {}

    public Long getApplicationId()             { return applicationId; }
    public Student getStudent()                { return student; }
    public PlacementDrive getDrive()           { return drive; }
    public LocalDateTime getAppliedAt()        { return appliedAt; }
    public String getStatus()                  { return status; }
    public Boolean getEligibilityVerified()    { return eligibilityVerified; }
    public String getRemarks()                 { return remarks; }

    public void setApplicationId(Long id)                     { this.applicationId = id; }
    public void setStudent(Student student)                   { this.student = student; }
    public void setDrive(PlacementDrive drive)                { this.drive = drive; }
    public void setAppliedAt(LocalDateTime appliedAt)         { this.appliedAt = appliedAt; }
    public void setStatus(String status)                      { this.status = status; }
    public void setEligibilityVerified(Boolean verified)      { this.eligibilityVerified = verified; }
    public void setRemarks(String remarks)                    { this.remarks = remarks; }
}
