package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.util.List;

public class DriveEligibilityResponse {

    private Long eligibilityId;
    private BigDecimal minCgpa;
    private Integer maxActiveBacklogs;
    private Integer eligibleGraduationYear;
    private String additionalCriteria;
    private List<DepartmentResponse> eligibleDepartments;

    public DriveEligibilityResponse() {}

    public DriveEligibilityResponse(Long eligibilityId, BigDecimal minCgpa,
                                    Integer maxActiveBacklogs, Integer eligibleGraduationYear,
                                    String additionalCriteria,
                                    List<DepartmentResponse> eligibleDepartments) {
        this.eligibilityId = eligibilityId;
        this.minCgpa = minCgpa;
        this.maxActiveBacklogs = maxActiveBacklogs;
        this.eligibleGraduationYear = eligibleGraduationYear;
        this.additionalCriteria = additionalCriteria;
        this.eligibleDepartments = eligibleDepartments;
    }

    public Long getEligibilityId()                                  { return eligibilityId; }
    public BigDecimal getMinCgpa()                                   { return minCgpa; }
    public Integer getMaxActiveBacklogs()                            { return maxActiveBacklogs; }
    public Integer getEligibleGraduationYear()                        { return eligibleGraduationYear; }
    public String getAdditionalCriteria()                            { return additionalCriteria; }
    public List<DepartmentResponse> getEligibleDepartments()         { return eligibleDepartments; }

    public void setEligibilityId(Long eligibilityId)                                { this.eligibilityId = eligibilityId; }
    public void setMinCgpa(BigDecimal minCgpa)                                      { this.minCgpa = minCgpa; }
    public void setMaxActiveBacklogs(Integer maxActiveBacklogs)                      { this.maxActiveBacklogs = maxActiveBacklogs; }
    public void setEligibleGraduationYear(Integer eligibleGraduationYear)            { this.eligibleGraduationYear = eligibleGraduationYear; }
    public void setAdditionalCriteria(String additionalCriteria)                    { this.additionalCriteria = additionalCriteria; }
    public void setEligibleDepartments(List<DepartmentResponse> eligibleDepartments){ this.eligibleDepartments = eligibleDepartments; }
}

