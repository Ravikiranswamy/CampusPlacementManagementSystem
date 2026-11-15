package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for updating an existing student's profile.
 * Supports updating personal, academic, admission, semester SGPAs, and contact records.
 */
public class StudentUpdateRequest {

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    private Long departmentId;

    @Size(max = 5, message = "Section must not exceed 5 characters")
    private String section;

    @DecimalMin(value = "0.00", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.00")
    private BigDecimal cgpa;

    @Min(value = 0, message = "Active backlogs cannot be negative")
    private Integer activeBacklogs;

    @Min(value = 2000, message = "Graduation year must be 2000 or later")
    private Integer graduationYear;

    @Size(max = 15, message = "Phone must not exceed 15 characters")
    private String phone;

    private String resumeUrl;

    @DecimalMin(value = "0.00", message = "SSC percentage cannot be negative")
    @DecimalMax(value = "100.00", message = "SSC percentage cannot exceed 100.00")
    private BigDecimal sscPercentage;

    @DecimalMin(value = "0.00", message = "HSC percentage cannot be negative")
    @DecimalMax(value = "100.00", message = "HSC percentage cannot exceed 100.00")
    private BigDecimal hscPercentage;

    @Size(max = 50, message = "Admission quota must not exceed 50 characters")
    private String admissionQuota;

    @Min(value = 1, message = "Entrance rank must be positive")
    private Integer entranceRank;

    @Min(value = 0, message = "Gap years cannot be negative")
    private Integer gapYears;

    @Min(value = 0, message = "History of backlogs cannot be negative")
    private Integer historyBacklogs;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem1Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem2Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem3Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem4Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem5Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem6Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem7Sgpa;

    @DecimalMin(value = "0.00", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "SGPA cannot exceed 10.00")
    private BigDecimal sem8Sgpa;

    @Size(max = 20, message = "Gender must not exceed 20 characters")
    private String gender;

    private LocalDate dateOfBirth;

    @Size(max = 100, message = "Native place must not exceed 100 characters")
    private String nativePlace;

    @Size(max = 150, message = "Parent name must not exceed 150 characters")
    private String parentName;

    private String permanentAddress;

    public StudentUpdateRequest() {}

    public String getFullName()          { return fullName; }
    public Long getDepartmentId()        { return departmentId; }
    public String getSection()           { return section; }
    public BigDecimal getCgpa()          { return cgpa; }
    public Integer getActiveBacklogs()   { return activeBacklogs; }
    public Integer getGraduationYear()   { return graduationYear; }
    public String getPhone()             { return phone; }
    public String getResumeUrl()         { return resumeUrl; }
    public BigDecimal getSscPercentage() { return sscPercentage; }
    public BigDecimal getHscPercentage() { return hscPercentage; }
    public String getAdmissionQuota()    { return admissionQuota; }
    public Integer getEntranceRank()     { return entranceRank; }
    public Integer getGapYears()         { return gapYears; }
    public Integer getHistoryBacklogs()  { return historyBacklogs; }
    public BigDecimal getSem1Sgpa()      { return sem1Sgpa; }
    public BigDecimal getSem2Sgpa()      { return sem2Sgpa; }
    public BigDecimal getSem3Sgpa()      { return sem3Sgpa; }
    public BigDecimal getSem4Sgpa()      { return sem4Sgpa; }
    public BigDecimal getSem5Sgpa()      { return sem5Sgpa; }
    public BigDecimal getSem6Sgpa()      { return sem6Sgpa; }
    public BigDecimal getSem7Sgpa()      { return sem7Sgpa; }
    public BigDecimal getSem8Sgpa()      { return sem8Sgpa; }
    public String getGender()            { return gender; }
    public LocalDate getDateOfBirth()    { return dateOfBirth; }
    public String getNativePlace()       { return nativePlace; }
    public String getParentName()        { return parentName; }
    public String getPermanentAddress()  { return permanentAddress; }

    public void setFullName(String fullName)               { this.fullName = fullName; }
    public void setDepartmentId(Long departmentId)         { this.departmentId = departmentId; }
    public void setSection(String section)                 { this.section = section; }
    public void setCgpa(BigDecimal cgpa)                   { this.cgpa = cgpa; }
    public void setActiveBacklogs(Integer activeBacklogs)  { this.activeBacklogs = activeBacklogs; }
    public void setGraduationYear(Integer graduationYear)  { this.graduationYear = graduationYear; }
    public void setPhone(String phone)                     { this.phone = phone; }
    public void setResumeUrl(String resumeUrl)             { this.resumeUrl = resumeUrl; }
    public void setSscPercentage(BigDecimal sscPercentage) { this.sscPercentage = sscPercentage; }
    public void setHscPercentage(BigDecimal hscPercentage) { this.hscPercentage = hscPercentage; }
    public void setAdmissionQuota(String admissionQuota)   { this.admissionQuota = admissionQuota; }
    public void setEntranceRank(Integer entranceRank)      { this.entranceRank = entranceRank; }
    public void setGapYears(Integer gapYears)              { this.gapYears = gapYears; }
    public void setHistoryBacklogs(Integer historyBacklogs){ this.historyBacklogs = historyBacklogs; }
    public void setSem1Sgpa(BigDecimal sem1Sgpa)          { this.sem1Sgpa = sem1Sgpa; }
    public void setSem2Sgpa(BigDecimal sem2Sgpa)          { this.sem2Sgpa = sem2Sgpa; }
    public void setSem3Sgpa(BigDecimal sem3Sgpa)          { this.sem3Sgpa = sem3Sgpa; }
    public void setSem4Sgpa(BigDecimal sem4Sgpa)          { this.sem4Sgpa = sem4Sgpa; }
    public void setSem5Sgpa(BigDecimal sem5Sgpa)          { this.sem5Sgpa = sem5Sgpa; }
    public void setSem6Sgpa(BigDecimal sem6Sgpa)          { this.sem6Sgpa = sem6Sgpa; }
    public void setSem7Sgpa(BigDecimal sem7Sgpa)          { this.sem7Sgpa = sem7Sgpa; }
    public void setSem8Sgpa(BigDecimal sem8Sgpa)          { this.sem8Sgpa = sem8Sgpa; }
    public void setGender(String gender)                  { this.gender = gender; }
    public void setDateOfBirth(LocalDate dateOfBirth)      { this.dateOfBirth = dateOfBirth; }
    public void setNativePlace(String nativePlace)        { this.nativePlace = nativePlace; }
    public void setParentName(String parentName)          { this.parentName = parentName; }
    public void setPermanentAddress(String permanentAddress){ this.permanentAddress = permanentAddress; }
}

