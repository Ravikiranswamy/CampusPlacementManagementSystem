package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.EligibilityCheckResponse;
import com.placement.campusplacement.dto.PlacementDriveResponse;

import java.util.List;

public interface EligibilityService {

    EligibilityCheckResponse checkEligibility(Long studentId, Long driveId);

    List<PlacementDriveResponse> getEligibleDrivesForStudent(Long studentId);
}
