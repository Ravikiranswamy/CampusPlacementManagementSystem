package com.placement.campusplacement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for drive_eligibility_departments.
 */
@Embeddable
public class DriveEligibilityDepartmentId implements Serializable {

    @Column(name = "eligibility_id")
    private Long eligibilityId;

    @Column(name = "department_id")
    private Long departmentId;

    public DriveEligibilityDepartmentId() {}

    public DriveEligibilityDepartmentId(Long eligibilityId, Long departmentId) {
        this.eligibilityId = eligibilityId;
        this.departmentId = departmentId;
    }

    public Long getEligibilityId() { return eligibilityId; }
    public Long getDepartmentId()  { return departmentId; }

    public void setEligibilityId(Long eligibilityId) { this.eligibilityId = eligibilityId; }
    public void setDepartmentId(Long departmentId)   { this.departmentId = departmentId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DriveEligibilityDepartmentId that)) return false;
        return Objects.equals(eligibilityId, that.eligibilityId) &&
               Objects.equals(departmentId, that.departmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eligibilityId, departmentId);
    }
}
