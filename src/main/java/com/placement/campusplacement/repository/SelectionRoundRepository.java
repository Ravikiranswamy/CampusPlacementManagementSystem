package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.SelectionRound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SelectionRoundRepository extends JpaRepository<SelectionRound, Long> {

    @Query("SELECT r FROM SelectionRound r " +
           "JOIN FETCH r.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE r.drive.driveId = :driveId " +
           "ORDER BY r.roundNumber ASC")
    List<SelectionRound> findByDriveIdOrderByRoundNumberAsc(@Param("driveId") Long driveId);

    boolean existsByDrive_DriveIdAndRoundNumber(Long driveId, Integer roundNumber);

    @Query("SELECT r FROM SelectionRound r " +
           "JOIN FETCH r.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE r.roundId = :id")
    Optional<SelectionRound> findByIdWithDetails(@Param("id") Long id);
}

