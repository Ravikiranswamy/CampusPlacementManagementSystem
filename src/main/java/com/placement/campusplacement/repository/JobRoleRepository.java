package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobRoleRepository extends JpaRepository<JobRole, Long> {

    @Query("SELECT j FROM JobRole j JOIN FETCH j.company WHERE j.company.companyId = :companyId")
    List<JobRole> findByCompanyIdWithDetails(@Param("companyId") Long companyId);

    @Query("SELECT j FROM JobRole j JOIN FETCH j.company WHERE j.jobRoleId = :id")
    Optional<JobRole> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT j FROM JobRole j JOIN FETCH j.company")
    List<JobRole> findAllWithDetails();
}

