package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlacementDriveResponse {

    private Long driveId;
    private Long companyId;
    private String companyName;
    private Long jobRoleId;
    private String roleTitle;
    private String jobType;
    private BigDecimal packageLpa;
    private String workLocation;
    private String driveTitle;
    private LocalDateTime registrationDeadline;
    private LocalDate driveDate;
    private String status;
    private String description;
    private String jd1Url;
    private String jd2Url;
    private String jd3Url;
    private BigDecimal stipendMonthly;
    private Long createdByUserId;
    private String createdByUserName;
    private LocalDateTime createdAt;
    private DriveEligibilityResponse eligibility;

    public PlacementDriveResponse() {}

    public Long getDriveId()                           { return driveId; }
    public Long getCompanyId()                         { return companyId; }
    public String getCompanyName()                     { return companyName; }
    public Long getJobRoleId()                         { return jobRoleId; }
    public String getRoleTitle()                       { return roleTitle; }
    public String getJobType()                         { return jobType; }
    public BigDecimal getPackageLpa()                  { return packageLpa; }
    public String getWorkLocation()                    { return workLocation; }
    public String getDriveTitle()                      { return driveTitle; }
    public LocalDateTime getRegistrationDeadline()     { return registrationDeadline; }
    public LocalDate getDriveDate()                    { return driveDate; }
    public String getStatus()                          { return status; }
    public String getDescription()                     { return description; }
    public String getJd1Url()                          { return jd1Url; }
    public String getJd2Url()                          { return jd2Url; }
    public String getJd3Url()                          { return jd3Url; }
    public BigDecimal getStipendMonthly()              { return stipendMonthly; }
    public Long getCreatedByUserId()                   { return createdByUserId; }
    public String getCreatedByUserName()               { return createdByUserName; }
    public LocalDateTime getCreatedAt()                { return createdAt; }
    public DriveEligibilityResponse getEligibility()   { return eligibility; }

    public void setDriveId(Long driveId)                                           { this.driveId = driveId; }
    public void setCompanyId(Long companyId)                                       { this.companyId = companyId; }
    public void setCompanyName(String companyName)                                 { this.companyName = companyName; }
    public void setJobRoleId(Long jobRoleId)                                       { this.jobRoleId = jobRoleId; }
    public void setRoleTitle(String roleTitle)                                     { this.roleTitle = roleTitle; }
    public void setJobType(String jobType)                                         { this.jobType = jobType; }
    public void setPackageLpa(BigDecimal packageLpa)                               { this.packageLpa = packageLpa; }
    public void setWorkLocation(String workLocation)                               { this.workLocation = workLocation; }
    public void setDriveTitle(String driveTitle)                                   { this.driveTitle = driveTitle; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline)       { this.registrationDeadline = registrationDeadline; }
    public void setDriveDate(LocalDate driveDate)                                  { this.driveDate = driveDate; }
    public void setStatus(String status)                                           { this.status = status; }
    public void setDescription(String description)                                 { this.description = description; }
    public void setJd1Url(String jd1Url)                                           { this.jd1Url = jd1Url; }
    public void setJd2Url(String jd2Url)                                           { this.jd2Url = jd2Url; }
    public void setJd3Url(String jd3Url)                                           { this.jd3Url = jd3Url; }
    public void setStipendMonthly(BigDecimal stipendMonthly)                       { this.stipendMonthly = stipendMonthly; }
    public void setCreatedByUserId(Long createdByUserId)                           { this.createdByUserId = createdByUserId; }
    public void setCreatedByUserName(String createdByUserName)                     { this.createdByUserName = createdByUserName; }
    public void setCreatedAt(LocalDateTime createdAt)                             { this.createdAt = createdAt; }
    public void setEligibility(DriveEligibilityResponse eligibility)               { this.eligibility = eligibility; }
}

