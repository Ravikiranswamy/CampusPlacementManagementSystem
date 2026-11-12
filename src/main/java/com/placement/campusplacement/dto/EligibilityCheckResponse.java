package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Detailed diagnostic response explaining whether a student is eligible
 * for a specific placement drive, with field-by-field breakdown.
 */
public class EligibilityCheckResponse {

    private Long studentId;
    private String studentName;
    private String usn;
    private Long driveId;
    private String driveTitle;
    private String companyName;

    private boolean isEligible;
    private boolean cgpaSatisfied;
    private boolean backlogsSatisfied;
    private boolean departmentSatisfied;
    private boolean graduationYearSatisfied;
    private boolean notRestricted;
    private boolean deadlineValid;
    private boolean driveOpen;

    private BigDecimal studentCgpa;
    private BigDecimal requiredMinCgpa;
    private Integer studentBacklogs;
    private Integer allowedMaxBacklogs;

    private List<String> reasons = new ArrayList<>();

    public EligibilityCheckResponse() {}

    public Long getStudentId()                     { return studentId; }
    public String getStudentName()                 { return studentName; }
    public String getUsn()                         { return usn; }
    public Long getDriveId()                       { return driveId; }
    public String getDriveTitle()                  { return driveTitle; }
    public String getCompanyName()                 { return companyName; }
    public boolean isEligible()                    { return isEligible; }
    public boolean isCgpaSatisfied()               { return cgpaSatisfied; }
    public boolean isBacklogsSatisfied()           { return backlogsSatisfied; }
    public boolean isDepartmentSatisfied()         { return departmentSatisfied; }
    public boolean isGraduationYearSatisfied()     { return graduationYearSatisfied; }
    public boolean isNotRestricted()               { return notRestricted; }
    public boolean isDeadlineValid()               { return deadlineValid; }
    public boolean isDriveOpen()                   { return driveOpen; }
    public BigDecimal getStudentCgpa()             { return studentCgpa; }
    public BigDecimal getRequiredMinCgpa()         { return requiredMinCgpa; }
    public Integer getStudentBacklogs()            { return studentBacklogs; }
    public Integer getAllowedMaxBacklogs()         { return allowedMaxBacklogs; }
    public List<String> getReasons()               { return reasons; }

    public void setStudentId(Long studentId)                               { this.studentId = studentId; }
    public void setStudentName(String studentName)                         { this.studentName = studentName; }
    public void setUsn(String usn)                                         { this.usn = usn; }
    public void setDriveId(Long driveId)                                   { this.driveId = driveId; }
    public void setDriveTitle(String driveTitle)                           { this.driveTitle = driveTitle; }
    public void setCompanyName(String companyName)                         { this.companyName = companyName; }
    public void setEligible(boolean eligible)                              { isEligible = eligible; }
    public void setCgpaSatisfied(boolean cgpaSatisfied)                   { this.cgpaSatisfied = cgpaSatisfied; }
    public void setBacklogsSatisfied(boolean backlogsSatisfied)           { this.backlogsSatisfied = backlogsSatisfied; }
    public void setDepartmentSatisfied(boolean departmentSatisfied)       { this.departmentSatisfied = departmentSatisfied; }
    public void setGraduationYearSatisfied(boolean yearSatisfied)          { this.graduationYearSatisfied = yearSatisfied; }
    public void setNotRestricted(boolean notRestricted)                   { this.notRestricted = notRestricted; }
    public void setDeadlineValid(boolean deadlineValid)                   { this.deadlineValid = deadlineValid; }
    public void setDriveOpen(boolean driveOpen)                           { this.driveOpen = driveOpen; }
    public void setStudentCgpa(BigDecimal studentCgpa)                     { this.studentCgpa = studentCgpa; }
    public void setRequiredMinCgpa(BigDecimal requiredMinCgpa)             { this.requiredMinCgpa = requiredMinCgpa; }
    public void setStudentBacklogs(Integer studentBacklogs)                { this.studentBacklogs = studentBacklogs; }
    public void setAllowedMaxBacklogs(Integer allowedMaxBacklogs)         { this.allowedMaxBacklogs = allowedMaxBacklogs; }
    public void setReasons(List<String> reasons)                           { this.reasons = reasons; }
}

