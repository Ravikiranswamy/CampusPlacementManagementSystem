package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JobRoleResponse {

    private Long jobRoleId;
    private Long companyId;
    private String companyName;
    private String roleTitle;
    private String jobType;
    private BigDecimal packageLpa;
    private String workLocation;
    private String jobDescription;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public JobRoleResponse() {}

    public JobRoleResponse(Long jobRoleId, Long companyId, String companyName,
                           String roleTitle, String jobType, BigDecimal packageLpa,
                           String workLocation, String jobDescription,
                           Boolean isActive, LocalDateTime createdAt) {
        this.jobRoleId = jobRoleId;
        this.companyId = companyId;
        this.companyName = companyName;
        this.roleTitle = roleTitle;
        this.jobType = jobType;
        this.packageLpa = packageLpa;
        this.workLocation = workLocation;
        this.jobDescription = jobDescription;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getJobRoleId()         { return jobRoleId; }
    public Long getCompanyId()          { return companyId; }
    public String getCompanyName()      { return companyName; }
    public String getRoleTitle()        { return roleTitle; }
    public String getJobType()          { return jobType; }
    public BigDecimal getPackageLpa()   { return packageLpa; }
    public String getWorkLocation()     { return workLocation; }
    public String getJobDescription()   { return jobDescription; }
    public Boolean getIsActive()        { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setJobRoleId(Long jobRoleId)         { this.jobRoleId = jobRoleId; }
    public void setCompanyId(Long companyId)         { this.companyId = companyId; }
    public void setCompanyName(String companyName)   { this.companyName = companyName; }
    public void setRoleTitle(String roleTitle)       { this.roleTitle = roleTitle; }
    public void setJobType(String jobType)           { this.jobType = jobType; }
    public void setPackageLpa(BigDecimal packageLpa) { this.packageLpa = packageLpa; }
    public void setWorkLocation(String workLocation) { this.workLocation = workLocation; }
    public void setJobDescription(String description){ this.jobDescription = description; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
