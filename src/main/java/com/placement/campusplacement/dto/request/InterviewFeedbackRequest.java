package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class InterviewFeedbackRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long companyId;

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Role title is required")
    @Size(max = 150, message = "Role title must not exceed 150 characters")
    private String roleTitle;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    @NotBlank(message = "Interview mode is required (Online/Offline/Hybrid)")
    private String interviewMode = "Online";

    private BigDecimal packageCtc;
    private BigDecimal basePay;
    private BigDecimal stipendMonthly;

    @Min(1) @Max(5)
    private Integer codingRating;

    @Min(1) @Max(5)
    private Integer interviewRating;

    @Min(1) @Max(5)
    private Integer overallRating;

    private String technicalRoundDesc;
    private String hrRoundDesc;
    private String topicsCovered;
    private String valuableTips;

    public InterviewFeedbackRequest() {}

    public Long getStudentId() { return studentId; }
    public Long getCompanyId() { return companyId; }
    public String getCompanyName() { return companyName; }
    public String getRoleTitle() { return roleTitle; }
    public String getLocation() { return location; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getInterviewMode() { return interviewMode; }
    public BigDecimal getPackageCtc() { return packageCtc; }
    public BigDecimal getBasePay() { return basePay; }
    public BigDecimal getStipendMonthly() { return stipendMonthly; }
    public Integer getCodingRating() { return codingRating; }
    public Integer getInterviewRating() { return interviewRating; }
    public Integer getOverallRating() { return overallRating; }
    public String getTechnicalRoundDesc() { return technicalRoundDesc; }
    public String getHrRoundDesc() { return hrRoundDesc; }
    public String getTopicsCovered() { return topicsCovered; }
    public String getValuableTips() { return valuableTips; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public void setLocation(String location) { this.location = location; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }
    public void setPackageCtc(BigDecimal packageCtc) { this.packageCtc = packageCtc; }
    public void setBasePay(BigDecimal basePay) { this.basePay = basePay; }
    public void setStipendMonthly(BigDecimal stipendMonthly) { this.stipendMonthly = stipendMonthly; }
    public void setCodingRating(Integer codingRating) { this.codingRating = codingRating; }
    public void setInterviewRating(Integer interviewRating) { this.interviewRating = interviewRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    public void setTechnicalRoundDesc(String technicalRoundDesc) { this.technicalRoundDesc = technicalRoundDesc; }
    public void setHrRoundDesc(String hrRoundDesc) { this.hrRoundDesc = hrRoundDesc; }
    public void setTopicsCovered(String topicsCovered) { this.topicsCovered = topicsCovered; }
    public void setValuableTips(String valuableTips) { this.valuableTips = valuableTips; }
}
