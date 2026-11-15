
package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private BigDecimal sscPercentage;
    private BigDecimal hscPercentage;
    private String admissionQuota;
    private Integer entranceRank;
    private Integer gapYears;
    private Integer historyBacklogs;
    private BigDecimal sem1Sgpa;
    private BigDecimal sem2Sgpa;
    private BigDecimal sem3Sgpa;
    private BigDecimal sem4Sgpa;
    private BigDecimal sem5Sgpa;
    private BigDecimal sem6Sgpa;
    private BigDecimal sem7Sgpa;
    private BigDecimal sem8Sgpa;
    private String gender;
    private LocalDate dateOfBirth;
    private String nativePlace;
    private String parentName;
    private String permanentAddress;
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
    public BigDecimal getSscPercentage() { return sscPercentage; }
    public BigDecimal getHscPercentage() { return hscPercentage; }
    public String getAdmissionQuota()  { return admissionQuota; }
    public Integer getEntranceRank()   { return entranceRank; }
    public Integer getGapYears()       { return gapYears; }
    public Integer getHistoryBacklogs(){ return historyBacklogs; }
    public BigDecimal getSem1Sgpa()    { return sem1Sgpa; }
    public BigDecimal getSem2Sgpa()    { return sem2Sgpa; }
    public BigDecimal getSem3Sgpa()    { return sem3Sgpa; }
    public BigDecimal getSem4Sgpa()    { return sem4Sgpa; }
    public BigDecimal getSem5Sgpa()    { return sem5Sgpa; }
    public BigDecimal getSem6Sgpa()    { return sem6Sgpa; }
    public BigDecimal getSem7Sgpa()    { return sem7Sgpa; }
    public BigDecimal getSem8Sgpa()    { return sem8Sgpa; }
    public String getGender()          { return gender; }
    public LocalDate getDateOfBirth()  { return dateOfBirth; }
    public String getNativePlace()     { return nativePlace; }
    public String getParentName()      { return parentName; }
    public String getPermanentAddress(){ return permanentAddress; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setUsn(String usn) { this.usn = usn; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public void setDepartment(String department) { this.department = department; }
    public void setSection(String section) { this.section = section; }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; }
    public void setActiveBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public void setSscPercentage(BigDecimal sscPercentage) { this.sscPercentage = sscPercentage; }
    public void setHscPercentage(BigDecimal hscPercentage) { this.hscPercentage = hscPercentage; }
    public void setAdmissionQuota(String admissionQuota) { this.admissionQuota = admissionQuota; }
    public void setEntranceRank(Integer entranceRank) { this.entranceRank = entranceRank; }
    public void setGapYears(Integer gapYears) { this.gapYears = gapYears; }
    public void setHistoryBacklogs(Integer historyBacklogs) { this.historyBacklogs = historyBacklogs; }
    public void setSem1Sgpa(BigDecimal sem1Sgpa) { this.sem1Sgpa = sem1Sgpa; }
    public void setSem2Sgpa(BigDecimal sem2Sgpa) { this.sem2Sgpa = sem2Sgpa; }
    public void setSem3Sgpa(BigDecimal sem3Sgpa) { this.sem3Sgpa = sem3Sgpa; }
    public void setSem4Sgpa(BigDecimal sem4Sgpa) { this.sem4Sgpa = sem4Sgpa; }
    public void setSem5Sgpa(BigDecimal sem5Sgpa) { this.sem5Sgpa = sem5Sgpa; }
    public void setSem6Sgpa(BigDecimal sem6Sgpa) { this.sem6Sgpa = sem6Sgpa; }
    public void setSem7Sgpa(BigDecimal sem7Sgpa) { this.sem7Sgpa = sem7Sgpa; }
    public void setSem8Sgpa(BigDecimal sem8Sgpa) { this.sem8Sgpa = sem8Sgpa; }
    public void setGender(String gender) { this.gender = gender; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setNativePlace(String nativePlace) { this.nativePlace = nativePlace; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
