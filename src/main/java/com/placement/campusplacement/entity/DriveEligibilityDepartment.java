package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity mapping 'drive_eligibility_departments'.
 * Links an eligibility criteria set to eligible academic departments (CSE, ISE, etc.).
 * Satisfies the 5-attribute DBMS course requirement.
 */
@Entity
@Table(name = "drive_eligibility_departments")
public class DriveEligibilityDepartment {

    @EmbeddedId
    private DriveEligibilityDepartmentId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("eligibilityId")
    @JoinColumn(name = "eligibility_id")
    private DriveEligibility eligibility;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("departmentId")
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "min_dept_cgpa", precision = 4, scale = 2)
    private BigDecimal minDeptCgpa;

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory = true;

    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) addedAt = LocalDateTime.now();
    }

    public DriveEligibilityDepartment() {}

    public DriveEligibilityDepartment(DriveEligibility eligibility, Department department,
                                      BigDecimal minDeptCgpa, Boolean isMandatory) {
        this.id           = new DriveEligibilityDepartmentId(eligibility.getEligibilityId(), department.getDepartmentId());
        this.eligibility  = eligibility;
        this.department   = department;
        this.minDeptCgpa  = minDeptCgpa;
        this.isMandatory  = isMandatory != null ? isMandatory : true;
    }

    public DriveEligibilityDepartmentId getId()    { return id; }
    public DriveEligibility getEligibility()       { return eligibility; }
    public Department getDepartment()              { return department; }
    public BigDecimal getMinDeptCgpa()             { return minDeptCgpa; }
    public Boolean getIsMandatory()                { return isMandatory; }
    public LocalDateTime getAddedAt()              { return addedAt; }

    public void setId(DriveEligibilityDepartmentId id)           { this.id = id; }
    public void setEligibility(DriveEligibility eligibility)     { this.eligibility = eligibility; }
    public void setDepartment(Department department)             { this.department = department; }
    public void setMinDeptCgpa(BigDecimal minDeptCgpa)           { this.minDeptCgpa = minDeptCgpa; }
    public void setIsMandatory(Boolean isMandatory)              { this.isMandatory = isMandatory; }
    public void setAddedAt(LocalDateTime addedAt)                { this.addedAt = addedAt; }
}

