package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'job_roles' table.
 * Represents an open role or internship offered by a company.
 */
@Entity
@Table(name = "job_roles")
public class JobRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_role_id")
    private Long jobRoleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(name = "job_type", nullable = false, length = 30)
    private String jobType;

    @Column(name = "package_lpa", nullable = false, precision = 6, scale = 2)
    private BigDecimal packageLpa;

    @Column(name = "work_location", length = 150)
    private String workLocation;

    @Column(name = "job_description")
    private String jobDescription;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public JobRole() {}

    public Long getJobRoleId()         { return jobRoleId; }
    public Company getCompany()        { return company; }
    public String getRoleTitle()       { return roleTitle; }
    public String getJobType()         { return jobType; }
    public BigDecimal getPackageLpa()  { return packageLpa; }
    public String getWorkLocation()    { return workLocation; }
    public String getJobDescription()  { return jobDescription; }
    public Boolean getIsActive()       { return isActive; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setJobRoleId(Long jobRoleId)         { this.jobRoleId = jobRoleId; }
    public void setCompany(Company company)          { this.company = company; }
    public void setRoleTitle(String roleTitle)       { this.roleTitle = roleTitle; }
    public void setJobType(String jobType)           { this.jobType = jobType; }
    public void setPackageLpa(BigDecimal packageLpa) { this.packageLpa = packageLpa; }
    public void setWorkLocation(String workLocation) { this.workLocation = workLocation; }
    public void setJobDescription(String description){ this.jobDescription = description; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
