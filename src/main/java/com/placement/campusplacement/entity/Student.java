
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
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
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
