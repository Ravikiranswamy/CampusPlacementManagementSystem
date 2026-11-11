package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.PlacementRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PlacementRestrictionRepository extends JpaRepository<PlacementRestriction, Long> {

    @Query("SELECT r FROM PlacementRestriction r " +
           "WHERE r.student.studentId = :studentId " +
           "AND r.isActive = true " +
           "AND (r.endDate IS NULL OR r.endDate >= :currentDate)")
    List<PlacementRestriction> findActiveRestrictionsForStudent(
            @Param("studentId") Long studentId,
            @Param("currentDate") LocalDate currentDate);

    @Query("SELECT r FROM PlacementRestriction r " +
           "JOIN FETCH r.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH r.imposedBy " +
           "WHERE r.student.studentId = :studentId " +
           "ORDER BY r.createdAt DESC")
    List<PlacementRestriction> findHistoryByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT r FROM PlacementRestriction r " +
           "JOIN FETCH r.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH r.imposedBy " +
           "ORDER BY r.createdAt DESC")
    List<PlacementRestriction> findAllWithDetails();
}
