package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.DriveEligibilityDepartment;
import com.placement.campusplacement.entity.DriveEligibilityDepartmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DriveEligibilityDepartmentRepository extends JpaRepository<DriveEligibilityDepartment, DriveEligibilityDepartmentId> {

    @Query("SELECT ded FROM DriveEligibilityDepartment ded " +
           "JOIN FETCH ded.department " +
           "WHERE ded.eligibility.eligibilityId = :eligibilityId")
    List<DriveEligibilityDepartment> findByEligibilityIdWithDept(@Param("eligibilityId") Long eligibilityId);
}

