
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'students' table in Neon PostgreSQL.
 * Linked one-to-one with the 'users' table and many-to-one with 'departments'.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    /** One student account ↔ one login user. */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** Many students can belong to one department. */
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "usn", nullable = false, unique = true, length = 20)
    private String usn;

    @Column(name = "section", length = 5)
    private String section;

    /**
     * Stored as NUMERIC in PostgreSQL. BigDecimal gives exact decimal
     * representation — important for CGPA comparisons in eligibility checks.
     */
    @Column(name = "cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "active_backlogs", nullable = false)
    private Integer activeBacklogs = 0;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "ssc_percentage", precision = 5, scale = 2)
    private BigDecimal sscPercentage;

    @Column(name = "hsc_percentage", precision = 5, scale = 2)
    private BigDecimal hscPercentage;

    @Column(name = "admission_quota", length = 50)
    private String admissionQuota = "KCET";

    @Column(name = "entrance_rank")
    private Integer entranceRank;

    @Column(name = "gap_years")
    private Integer gapYears = 0;

    @Column(name = "history_backlogs")
    private Integer historyBacklogs = 0;

    @Column(name = "sem1_sgpa", precision = 4, scale = 2)
    private BigDecimal sem1Sgpa;

    @Column(name = "sem2_sgpa", precision = 4, scale = 2)
    private BigDecimal sem2Sgpa;

    @Column(name = "sem3_sgpa", precision = 4, scale = 2)
    private BigDecimal sem3Sgpa;

    @Column(name = "sem4_sgpa", precision = 4, scale = 2)
    private BigDecimal sem4Sgpa;

    @Column(name = "sem5_sgpa", precision = 4, scale = 2)
    private BigDecimal sem5Sgpa;

    @Column(name = "sem6_sgpa", precision = 4, scale = 2)
    private BigDecimal sem6Sgpa;

    @Column(name = "sem7_sgpa", precision = 4, scale = 2)
    private BigDecimal sem7Sgpa;

    @Column(name = "sem8_sgpa", precision = 4, scale = 2)
    private BigDecimal sem8Sgpa;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "native_place", length = 100)
    private String nativePlace;

    @Column(name = "parent_name", length = 150)
    private String parentName;

    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ── Lifecycle callback — auto-set createdAt on first insert ───────────────
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // ── No-arg constructor required by JPA ────────────────────────────────────
    public Student() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getStudentId()       { return studentId; }
    public User getUser()            { return user; }
    public Department getDepartment(){ return department; }
    public String getUsn()           { return usn; }
    public String getSection()       { return section; }
    public BigDecimal getCgpa()      { return cgpa; }
    public Integer getActiveBacklogs(){ return activeBacklogs; }
    public Integer getGraduationYear(){ return graduationYear; }
    public String getPhone()         { return phone; }
    public String getResumeUrl()     { return resumeUrl; }
    public BigDecimal getSscPercentage() { return sscPercentage; }
    public BigDecimal getHscPercentage() { return hscPercentage; }
    public String getAdmissionQuota() { return admissionQuota; }
    public Integer getEntranceRank() { return entranceRank; }
    public Integer getGapYears()     { return gapYears; }
    public Integer getHistoryBacklogs() { return historyBacklogs; }
    public BigDecimal getSem1Sgpa()  { return sem1Sgpa; }
    public BigDecimal getSem2Sgpa()  { return sem2Sgpa; }
    public BigDecimal getSem3Sgpa()  { return sem3Sgpa; }
    public BigDecimal getSem4Sgpa()  { return sem4Sgpa; }
    public BigDecimal getSem5Sgpa()  { return sem5Sgpa; }
    public BigDecimal getSem6Sgpa()  { return sem6Sgpa; }
    public BigDecimal getSem7Sgpa()  { return sem7Sgpa; }
    public BigDecimal getSem8Sgpa()  { return sem8Sgpa; }
    public String getGender()        { return gender; }
    public LocalDate getDateOfBirth(){ return dateOfBirth; }
    public String getNativePlace()   { return nativePlace; }
    public String getParentName()    { return parentName; }
    public String getPermanentAddress() { return permanentAddress; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setStudentId(Long studentId)         { this.studentId = studentId; }
    public void setUser(User user)                   { this.user = user; }
    public void setDepartment(Department department) { this.department = department; }
    public void setUsn(String usn)                   { this.usn = usn; }
    public void setSection(String section)           { this.section = section; }
    public void setCgpa(BigDecimal cgpa)             { this.cgpa = cgpa; }
    public void setActiveBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setPhone(String phone)               { this.phone = phone; }
    public void setResumeUrl(String resumeUrl)       { this.resumeUrl = resumeUrl; }
    public void setSscPercentage(BigDecimal sscPercentage) { this.sscPercentage = sscPercentage; }
    public void setHscPercentage(BigDecimal hscPercentage) { this.hscPercentage = hscPercentage; }
    public void setAdmissionQuota(String admissionQuota) { this.admissionQuota = admissionQuota; }
    public void setEntranceRank(Integer entranceRank) { this.entranceRank = entranceRank; }
    public void setGapYears(Integer gapYears)         { this.gapYears = gapYears; }
    public void setHistoryBacklogs(Integer historyBacklogs) { this.historyBacklogs = historyBacklogs; }
    public void setSem1Sgpa(BigDecimal sem1Sgpa)      { this.sem1Sgpa = sem1Sgpa; }
    public void setSem2Sgpa(BigDecimal sem2Sgpa)      { this.sem2Sgpa = sem2Sgpa; }
    public void setSem3Sgpa(BigDecimal sem3Sgpa)      { this.sem3Sgpa = sem3Sgpa; }
    public void setSem4Sgpa(BigDecimal sem4Sgpa)      { this.sem4Sgpa = sem4Sgpa; }
    public void setSem5Sgpa(BigDecimal sem5Sgpa)      { this.sem5Sgpa = sem5Sgpa; }
    public void setSem6Sgpa(BigDecimal sem6Sgpa)      { this.sem6Sgpa = sem6Sgpa; }
    public void setSem7Sgpa(BigDecimal sem7Sgpa)      { this.sem7Sgpa = sem7Sgpa; }
    public void setSem8Sgpa(BigDecimal sem8Sgpa)      { this.sem8Sgpa = sem8Sgpa; }
    public void setGender(String gender)              { this.gender = gender; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setNativePlace(String nativePlace)    { this.nativePlace = nativePlace; }
    public void setParentName(String parentName)      { this.parentName = parentName; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
