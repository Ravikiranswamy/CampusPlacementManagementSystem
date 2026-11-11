package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String email;
    private String usn;
    private String departmentName;
    private BigDecimal studentCgpa;
    private Integer studentBacklogs;

    private Long driveId;
    private String driveTitle;
    private String companyName;
    private String roleTitle;
    private String jobType;
    private BigDecimal packageLpa;

    private LocalDateTime appliedAt;
    private String status;
    private Boolean eligibilityVerified;
    private String remarks;

    public ApplicationResponse() {}

    public Long getApplicationId()                 { return applicationId; }
    public Long getStudentId()                     { return studentId; }
    public String getStudentName()                 { return studentName; }
    public String getEmail()                       { return email; }
    public String getUsn()                         { return usn; }
    public String getDepartmentName()              { return departmentName; }
    public BigDecimal getStudentCgpa()             { return studentCgpa; }
    public Integer getStudentBacklogs()            { return studentBacklogs; }
    public Long getDriveId()                       { return driveId; }
    public String getDriveTitle()                  { return driveTitle; }
    public String getCompanyName()                 { return companyName; }
    public String getRoleTitle()                   { return roleTitle; }
    public String getJobType()                     { return jobType; }
    public BigDecimal getPackageLpa()              { return packageLpa; }
    public LocalDateTime getAppliedAt()            { return appliedAt; }
    public String getStatus()                      { return status; }
    public Boolean getEligibilityVerified()        { return eligibilityVerified; }
    public String getRemarks()                     { return remarks; }

    public void setApplicationId(Long applicationId)                 { this.applicationId = applicationId; }
    public void setStudentId(Long studentId)                         { this.studentId = studentId; }
    public void setStudentName(String studentName)                   { this.studentName = studentName; }
    public void setEmail(String email)                               { this.email = email; }
    public void setUsn(String usn)                                   { this.usn = usn; }
    public void setDepartmentName(String departmentName)             { this.departmentName = departmentName; }
    public void setStudentCgpa(BigDecimal studentCgpa)               { this.studentCgpa = studentCgpa; }
    public void setStudentBacklogs(Integer studentBacklogs)          { this.studentBacklogs = studentBacklogs; }
    public void setDriveId(Long driveId)                             { this.driveId = driveId; }
    public void setDriveTitle(String driveTitle)                     { this.driveTitle = driveTitle; }
    public void setCompanyName(String companyName)                   { this.companyName = companyName; }
    public void setRoleTitle(String roleTitle)                       { this.roleTitle = roleTitle; }
    public void setJobType(String jobType)                           { this.jobType = jobType; }
    public void setPackageLpa(BigDecimal packageLpa)                { this.packageLpa = packageLpa; }
    public void setAppliedAt(LocalDateTime appliedAt)                { this.appliedAt = appliedAt; }
    public void setStatus(String status)                             { this.status = status; }
    public void setEligibilityVerified(Boolean eligibilityVerified)  { this.eligibilityVerified = eligibilityVerified; }
    public void setRemarks(String remarks)                           { this.remarks = remarks; }
}
