package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'placement_drives' table.
 * Coordinates a recruitment drive associating a company, a job role,
 * dates, deadlines, and drive status (DRAFT, PUBLISHED, CLOSED, CANCELLED).
 */
@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drive_id")
    private Long driveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @Column(name = "drive_title", nullable = false, length = 200)
    private String driveTitle;

    @Column(name = "registration_deadline", nullable = false)
    private LocalDateTime registrationDeadline;

    @Column(name = "drive_date", nullable = false)
    private LocalDate driveDate;

    /**
     * Drive status: DRAFT, PUBLISHED, CLOSED, CANCELLED
     */
    @Column(name = "status", nullable = false, length = 20)
    private String status = "DRAFT";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "description")
    private String description;

    @Column(name = "jd1_url", length = 500)
    private String jd1Url;

    @Column(name = "jd2_url", length = 500)
    private String jd2Url;

    @Column(name = "jd3_url", length = 500)
    private String jd3Url;

    @Column(name = "stipend_monthly", precision = 8, scale = 2)
    private BigDecimal stipendMonthly;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "drive", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private DriveEligibility eligibility;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public PlacementDrive() {}

    public Long getDriveId()                           { return driveId; }
    public Company getCompany()                        { return company; }
    public JobRole getJobRole()                        { return jobRole; }
    public String getDriveTitle()                      { return driveTitle; }
    public LocalDateTime getRegistrationDeadline()     { return registrationDeadline; }
    public LocalDate getDriveDate()                    { return driveDate; }
    public String getStatus()                          { return status; }
    public User getCreatedBy()                         { return createdBy; }
    public String getDescription()                     { return description; }
    public String getJd1Url()                          { return jd1Url; }
    public String getJd2Url()                          { return jd2Url; }
    public String getJd3Url()                          { return jd3Url; }
    public BigDecimal getStipendMonthly()              { return stipendMonthly; }
    public LocalDateTime getCreatedAt()                { return createdAt; }
    public DriveEligibility getEligibility()           { return eligibility; }

    public void setDriveId(Long driveId)                                   { this.driveId = driveId; }
    public void setCompany(Company company)                                { this.company = company; }
    public void setJobRole(JobRole jobRole)                                { this.jobRole = jobRole; }
    public void setDriveTitle(String driveTitle)                           { this.driveTitle = driveTitle; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline){ this.registrationDeadline = registrationDeadline; }
    public void setDriveDate(LocalDate driveDate)                          { this.driveDate = driveDate; }
    public void setStatus(String status)                                   { this.status = status; }
    public void setCreatedBy(User createdBy)                               { this.createdBy = createdBy; }
    public void setDescription(String description)                         { this.description = description; }
    public void setJd1Url(String jd1Url)                                   { this.jd1Url = jd1Url; }
    public void setJd2Url(String jd2Url)                                   { this.jd2Url = jd2Url; }
    public void setJd3Url(String jd3Url)                                   { this.jd3Url = jd3Url; }
    public void setStipendMonthly(BigDecimal stipendMonthly)               { this.stipendMonthly = stipendMonthly; }
    public void setCreatedAt(LocalDateTime createdAt)                     { this.createdAt = createdAt; }
    public void setEligibility(DriveEligibility eligibility)               { this.eligibility = eligibility; }
}

