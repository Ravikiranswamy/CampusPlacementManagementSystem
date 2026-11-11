package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.PlacementDriveResponse;
import com.placement.campusplacement.dto.request.DriveCreateRequest;
import com.placement.campusplacement.dto.request.DriveUpdateRequest;

import java.util.List;

public interface PlacementDriveService {

    List<PlacementDriveResponse> getAllDrives();

    List<PlacementDriveResponse> getPublishedDrives();

    PlacementDriveResponse getDriveById(Long id);

    PlacementDriveResponse createDrive(DriveCreateRequest request);

    PlacementDriveResponse updateDrive(Long id, DriveUpdateRequest request);

    PlacementDriveResponse updateDriveStatus(Long id, String status);
}
