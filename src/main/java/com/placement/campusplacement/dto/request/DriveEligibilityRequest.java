package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class DriveEligibilityRequest {

    @NotNull(message = "Minimum CGPA is required")
    @DecimalMin(value = "0.00", message = "Minimum CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "Minimum CGPA cannot exceed 10.00")
    private BigDecimal minCgpa;

    @NotNull(message = "Maximum active backlogs is required")
    @Min(value = 0, message = "Maximum backlogs cannot be negative")
    private Integer maxActiveBacklogs;

    @NotNull(message = "Eligible graduation year is required")
    @Min(value = 2000, message = "Graduation year must be 2000 or later")
    private Integer eligibleGraduationYear;

    @NotEmpty(message = "At least one eligible department must be selected")
    private List<Long> eligibleDepartmentIds;

    private String additionalCriteria;

    public DriveEligibilityRequest() {}

    public BigDecimal getMinCgpa()                   { return minCgpa; }
    public Integer getMaxActiveBacklogs()             { return maxActiveBacklogs; }
    public Integer getEligibleGraduationYear()         { return eligibleGraduationYear; }
    public List<Long> getEligibleDepartmentIds()      { return eligibleDepartmentIds; }
    public String getAdditionalCriteria()             { return additionalCriteria; }

    public void setMinCgpa(BigDecimal minCgpa)                               { this.minCgpa = minCgpa; }
    public void setMaxActiveBacklogs(Integer maxActiveBacklogs)               { this.maxActiveBacklogs = maxActiveBacklogs; }
    public void setEligibleGraduationYear(Integer eligibleGraduationYear)     { this.eligibleGraduationYear = eligibleGraduationYear; }
    public void setEligibleDepartmentIds(List<Long> eligibleDepartmentIds)   { this.eligibleDepartmentIds = eligibleDepartmentIds; }
    public void setAdditionalCriteria(String additionalCriteria)             { this.additionalCriteria = additionalCriteria; }
}

