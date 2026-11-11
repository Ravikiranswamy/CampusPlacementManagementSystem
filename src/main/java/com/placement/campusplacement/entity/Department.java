
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'departments' table.
 * Represents a college department (e.g. CSE, ISE).
 * One department can have many students.
 */
@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "department_code", nullable = false, unique = true, length = 10)
    private String departmentCode;

    @Column(name = "department_name", nullable = false, unique = true, length = 100)
    private String departmentName;

    @Column(name = "hod_name", length = 100)
    private String hodName;

    @Column(name = "office_email", length = 150)
    private String officeEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Department() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getDepartmentId()      { return departmentId; }
    public String getDepartmentCode()  { return departmentCode; }
    public String getDepartmentName()  { return departmentName; }
    public String getHodName()         { return hodName; }
    public String getOfficeEmail()     { return officeEmail; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setDepartmentId(Long departmentId)      { this.departmentId = departmentId; }
    public void setDepartmentCode(String departmentCode){ this.departmentCode = departmentCode; }
    public void setDepartmentName(String departmentName){ this.departmentName = departmentName; }
    public void setHodName(String hodName)              { this.hodName = hodName; }
    public void setOfficeEmail(String officeEmail)      { this.officeEmail = officeEmail; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
}
