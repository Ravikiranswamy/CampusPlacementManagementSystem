package com.placement.campusplacement.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DriveCreateRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Job role ID is required")
    private Long jobRoleId;

    @NotBlank(message = "Drive title is required")
    @Size(max = 200, message = "Drive title must not exceed 200 characters")
    private String driveTitle;

    @NotNull(message = "Registration deadline is required")
    private LocalDateTime registrationDeadline;

    @NotNull(message = "Drive date is required")
    private LocalDate driveDate;

    private String description;

    private String jd1Url;
    private String jd2Url;
    private String jd3Url;
    private BigDecimal stipendMonthly;

    @NotNull(message = "Creator user ID is required")
    private Long createdByUserId;

    @NotNull(message = "Eligibility criteria are required")
    @Valid
    private DriveEligibilityRequest eligibility;

    public DriveCreateRequest() {}

    public Long getCompanyId()                           { return companyId; }
    public Long getJobRoleId()                           { return jobRoleId; }
    public String getDriveTitle()                        { return driveTitle; }
    public LocalDateTime getRegistrationDeadline()       { return registrationDeadline; }
    public LocalDate getDriveDate()                      { return driveDate; }
    public String getDescription()                       { return description; }
    public String getJd1Url()                            { return jd1Url; }
    public String getJd2Url()                            { return jd2Url; }
    public String getJd3Url()                            { return jd3Url; }
    public BigDecimal getStipendMonthly()                { return stipendMonthly; }
    public Long getCreatedByUserId()                     { return createdByUserId; }
    public DriveEligibilityRequest getEligibility()      { return eligibility; }

    public void setCompanyId(Long companyId)                                   { this.companyId = companyId; }
    public void setJobRoleId(Long jobRoleId)                                   { this.jobRoleId = jobRoleId; }
    public void setDriveTitle(String driveTitle)                               { this.driveTitle = driveTitle; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline)   { this.registrationDeadline = registrationDeadline; }
    public void setDriveDate(LocalDate driveDate)                              { this.driveDate = driveDate; }
    public void setDescription(String description)                             { this.description = description; }
    public void setJd1Url(String jd1Url)                                       { this.jd1Url = jd1Url; }
    public void setJd2Url(String jd2Url)                                       { this.jd2Url = jd2Url; }
    public void setJd3Url(String jd3Url)                                       { this.jd3Url = jd3Url; }
    public void setStipendMonthly(BigDecimal stipendMonthly)                   { this.stipendMonthly = stipendMonthly; }
    public void setCreatedByUserId(Long createdByUserId)                       { this.createdByUserId = createdByUserId; }
    public void setEligibility(DriveEligibilityRequest eligibility)            { this.eligibility = eligibility; }
}

