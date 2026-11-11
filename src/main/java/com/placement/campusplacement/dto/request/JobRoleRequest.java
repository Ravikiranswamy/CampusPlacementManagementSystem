package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class JobRoleRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Role title is required")
    @Size(max = 150, message = "Role title must not exceed 150 characters")
    private String roleTitle;

    @NotBlank(message = "Job type is required")
    @Pattern(regexp = "^(?i)(FULL_TIME|INTERNSHIP|CONTRACT)$", message = "Job type must be FULL_TIME, INTERNSHIP, or CONTRACT")
    private String jobType;

    @NotNull(message = "Package LPA is required")
    @DecimalMin(value = "0.01", message = "Package LPA must be greater than 0")
    private BigDecimal packageLpa;

    @Size(max = 150, message = "Work location must not exceed 150 characters")
    private String workLocation;

    private String jobDescription;

    public JobRoleRequest() {}

    public Long getCompanyId()         { return companyId; }
    public String getRoleTitle()       { return roleTitle; }
    public String getJobType()         { return jobType; }
    public BigDecimal getPackageLpa()  { return packageLpa; }
    public String getWorkLocation()    { return workLocation; }
    public String getJobDescription()  { return jobDescription; }

    public void setCompanyId(Long companyId)         { this.companyId = companyId; }
    public void setRoleTitle(String roleTitle)       { this.roleTitle = roleTitle; }
    public void setJobType(String jobType)           { this.jobType = jobType; }
    public void setPackageLpa(BigDecimal packageLpa) { this.packageLpa = packageLpa; }
    public void setWorkLocation(String workLocation) { this.workLocation = workLocation; }
    public void setJobDescription(String description){ this.jobDescription = description; }
}

