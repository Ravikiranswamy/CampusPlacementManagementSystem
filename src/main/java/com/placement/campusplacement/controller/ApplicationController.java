package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.ApplicationResponse;
import com.placement.campusplacement.dto.request.ApplicationRequest;
import com.placement.campusplacement.dto.request.ApplicationStatusUpdateRequest;
import com.placement.campusplacement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * GET /api/applications
     * Retrieve all placement applications (Placement Team / Officer).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications() {
        List<ApplicationResponse> list = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", list));
    }

    /**
     * GET /api/applications/{id}
     * Retrieve single application by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(@PathVariable Long id) {
        ApplicationResponse app = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success("Application retrieved successfully", app));
    }

    /**
     * GET /api/applications/student/{studentId}
     * Retrieve all applications submitted by a specific student.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByStudent(@PathVariable Long studentId) {
        List<ApplicationResponse> list = applicationService.getApplicationsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student applications retrieved successfully", list));
    }

    /**
     * GET /api/applications/drive/{driveId}
     * Retrieve all applications submitted for a specific placement drive.
     */
    @GetMapping("/drive/{driveId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByDrive(@PathVariable Long driveId) {
        List<ApplicationResponse> list = applicationService.getApplicationsByDrive(driveId);
        return ResponseEntity.ok(ApiResponse.success("Drive applications retrieved successfully", list));
    }

    /**
     * POST /api/applications
     * Submit an application for a placement drive with real-time eligibility evaluation.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForDrive(
            @Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse created = applicationService.applyForDrive(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", created));
    }

    /**
     * PUT /api/applications/{id}/status
     * Update application status (Placement Team).
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        ApplicationResponse updated = applicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", updated));
    }

    /**
     * POST /api/applications/{id}/withdraw?studentId=1
     * Student withdraws their application before drive commencement.
     */
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @PathVariable Long id,
            @RequestParam Long studentId) {
        applicationService.withdrawApplication(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully"));
    }
}
