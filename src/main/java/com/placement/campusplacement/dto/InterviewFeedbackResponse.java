package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InterviewFeedbackResponse {

    private Long feedbackId;
    private Long studentId;
    private String studentName;
    private String studentUsn;
    private String departmentCode;
    private Long companyId;
    private String companyName;
    private String roleTitle;
    private String location;
    private Integer graduationYear;
    private String interviewMode;
    private BigDecimal packageCtc;
    private BigDecimal basePay;
    private BigDecimal stipendMonthly;
    private Integer codingRating;
    private Integer interviewRating;
    private Integer overallRating;
    private String technicalRoundDesc;
    private String hrRoundDesc;
    private String topicsCovered;
    private String valuableTips;
    private LocalDateTime createdAt;

    public InterviewFeedbackResponse() {}

    public Long getFeedbackId() { return feedbackId; }
    public Long getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getStudentUsn() { return studentUsn; }
    public String getDepartmentCode() { return departmentCode; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public void setStudentUsn(String studentUsn) { this.studentUsn = studentUsn; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
