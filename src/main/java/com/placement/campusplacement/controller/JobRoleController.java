package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.JobRoleResponse;
import com.placement.campusplacement.dto.request.JobRoleRequest;
import com.placement.campusplacement.service.JobRoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-roles")
public class JobRoleController {

    private final JobRoleService jobRoleService;

    public JobRoleController(JobRoleService jobRoleService) {
        this.jobRoleService = jobRoleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobRoleResponse>>> getAllJobRoles() {
        List<JobRoleResponse> roles = jobRoleService.getAllJobRoles();
        return ResponseEntity.ok(ApiResponse.success("Job roles retrieved successfully", roles));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<JobRoleResponse>>> getJobRolesByCompany(@PathVariable Long companyId) {
        List<JobRoleResponse> roles = jobRoleService.getJobRolesByCompanyId(companyId);
        return ResponseEntity.ok(ApiResponse.success("Company job roles retrieved successfully", roles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobRoleResponse>> getJobRoleById(@PathVariable Long id) {
        JobRoleResponse role = jobRoleService.getJobRoleById(id);
        return ResponseEntity.ok(ApiResponse.success("Job role retrieved successfully", role));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobRoleResponse>> createJobRole(
            @Valid @RequestBody JobRoleRequest request) {
        JobRoleResponse created = jobRoleService.createJobRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job role created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobRoleResponse>> updateJobRole(
            @PathVariable Long id,
            @Valid @RequestBody JobRoleRequest request) {
        JobRoleResponse updated = jobRoleService.updateJobRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("Job role updated successfully", updated));
    }
}

