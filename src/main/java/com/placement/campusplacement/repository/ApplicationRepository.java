package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudent_StudentIdAndDrive_DriveId(Long studentId, Long driveId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE a.student.studentId = :studentId " +
           "ORDER BY a.appliedAt DESC")
    List<Application> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE a.drive.driveId = :driveId " +
           "ORDER BY a.appliedAt DESC")
    List<Application> findByDriveIdWithDetails(@Param("driveId") Long driveId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE a.applicationId = :id")
    Optional<Application> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "ORDER BY a.appliedAt DESC")
    List<Application> findAllWithDetails();
}
