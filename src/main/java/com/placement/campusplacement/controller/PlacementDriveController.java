package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.PlacementDriveResponse;
import com.placement.campusplacement.dto.request.DriveCreateRequest;
import com.placement.campusplacement.dto.request.DriveUpdateRequest;
import com.placement.campusplacement.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    public PlacementDriveController(PlacementDriveService driveService) {
        this.driveService = driveService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlacementDriveResponse>>> getAllDrives() {
        List<PlacementDriveResponse> drives = driveService.getAllDrives();
        return ResponseEntity.ok(ApiResponse.success("Placement drives retrieved successfully", drives));
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<PlacementDriveResponse>>> getPublishedDrives() {
        List<PlacementDriveResponse> drives = driveService.getPublishedDrives();
        return ResponseEntity.ok(ApiResponse.success("Published placement drives retrieved successfully", drives));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> getDriveById(@PathVariable Long id) {
        PlacementDriveResponse drive = driveService.getDriveById(id);
        return ResponseEntity.ok(ApiResponse.success("Placement drive retrieved successfully", drive));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> createDrive(
            @Valid @RequestBody DriveCreateRequest request) {
        PlacementDriveResponse created = driveService.createDrive(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Placement drive created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> updateDrive(
            @PathVariable Long id,
            @Valid @RequestBody DriveUpdateRequest request) {
        PlacementDriveResponse updated = driveService.updateDrive(id, request);
        return ResponseEntity.ok(ApiResponse.success("Placement drive updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> updateDriveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        PlacementDriveResponse updated = driveService.updateDriveStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Drive status updated successfully", updated));
    }
}

