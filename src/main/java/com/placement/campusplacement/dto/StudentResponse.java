
package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Safe outbound DTO for student data.
 * Never exposes password_hash or internal user_id.
 */
public class StudentResponse {

    private Long studentId;
    private String fullName;
    private String email;
    private String usn;
    private String departmentCode;
    private String department;
    private String section;
    private BigDecimal cgpa;
    private Integer activeBacklogs;
    private Integer graduationYear;
    private String phone;
    private String resumeUrl;
    private LocalDateTime createdAt;

    public StudentResponse() {}

    public StudentResponse(Long studentId, String fullName, String email,
                           String usn, String departmentCode, String department,
                           String section, BigDecimal cgpa, Integer activeBacklogs,
                           Integer graduationYear, String phone,
                           String resumeUrl, LocalDateTime createdAt) {
        this.studentId       = studentId;
        this.fullName        = fullName;
        this.email           = email;
        this.usn             = usn;
        this.departmentCode  = departmentCode;
        this.department      = department;
        this.section         = section;
        this.cgpa            = cgpa;
        this.activeBacklogs  = activeBacklogs;
        this.graduationYear  = graduationYear;
        this.phone           = phone;
        this.resumeUrl       = resumeUrl;
        this.createdAt       = createdAt;
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getStudentId()         { return studentId; }
    public String getFullName()        { return fullName; }
    public String getEmail()           { return email; }
    public String getUsn()             { return usn; }
    public String getDepartmentCode()  { return departmentCode; }
    public String getDepartment()      { return department; }
    public String getSection()         { return section; }
    public BigDecimal getCgpa()        { return cgpa; }
    public Integer getActiveBacklogs() { return activeBacklogs; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getPhone()           { return phone; }
    public String getResumeUrl()       { return resumeUrl; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
}
