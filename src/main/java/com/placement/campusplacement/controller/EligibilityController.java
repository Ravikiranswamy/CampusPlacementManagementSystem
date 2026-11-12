package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.EligibilityCheckResponse;
import com.placement.campusplacement.dto.PlacementDriveResponse;
import com.placement.campusplacement.service.EligibilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    /**
     * GET /api/eligibility/check?studentId=1&driveId=2
     * Evaluate multi-factor eligibility breakdown for a student against a drive.
     */
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<EligibilityCheckResponse>> checkEligibility(
            @RequestParam Long studentId,
            @RequestParam Long driveId) {
        EligibilityCheckResponse result = eligibilityService.checkEligibility(studentId, driveId);
        return ResponseEntity.ok(ApiResponse.success("Eligibility evaluated successfully", result));
    }

    /**
     * GET /api/eligibility/drives/student/{studentId}
     * List all published drives that a specific student is fully eligible for.
     */
    @GetMapping("/drives/student/{studentId}")
    public ResponseEntity<ApiResponse<List<PlacementDriveResponse>>> getEligibleDrivesForStudent(
            @PathVariable Long studentId) {
        List<PlacementDriveResponse> eligibleDrives = eligibilityService.getEligibleDrivesForStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Eligible drives retrieved successfully", eligibleDrives));
    }
}

