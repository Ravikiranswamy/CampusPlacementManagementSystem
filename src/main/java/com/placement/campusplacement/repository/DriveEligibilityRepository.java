package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.DriveEligibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriveEligibilityRepository extends JpaRepository<DriveEligibility, Long> {

    Optional<DriveEligibility> findByDrive_DriveId(Long driveId);
}

