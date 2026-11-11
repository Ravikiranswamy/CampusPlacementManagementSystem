package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

    @Query("SELECT d FROM PlacementDrive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "JOIN FETCH d.createdBy " +
           "LEFT JOIN FETCH d.eligibility e " +
           "ORDER BY d.createdAt DESC")
    List<PlacementDrive> findAllWithDetails();

    @Query("SELECT d FROM PlacementDrive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "JOIN FETCH d.createdBy " +
           "LEFT JOIN FETCH d.eligibility e " +
           "WHERE d.driveId = :id")
    Optional<PlacementDrive> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT d FROM PlacementDrive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "JOIN FETCH d.createdBy " +
           "LEFT JOIN FETCH d.eligibility e " +
           "WHERE d.status = :status " +
           "ORDER BY d.registrationDeadline ASC")
    List<PlacementDrive> findByStatusWithDetails(@Param("status") String status);
}
