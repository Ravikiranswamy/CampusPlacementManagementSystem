package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.RestrictionResponse;
import com.placement.campusplacement.dto.request.RestrictionRequest;
import com.placement.campusplacement.dto.request.UnblockRequest;
import com.placement.campusplacement.service.RestrictionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restrictions")
public class RestrictionController {

    private final RestrictionService restrictionService;

    public RestrictionController(RestrictionService restrictionService) {
        this.restrictionService = restrictionService;
    }

    @PostMapping("/block")
    public ResponseEntity<ApiResponse<RestrictionResponse>> blockStudent(
            @Valid @RequestBody RestrictionRequest request) {
        RestrictionResponse created = restrictionService.blockStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student placement restriction imposed successfully", created));
    }

    @PostMapping("/{id}/unblock")
    public ResponseEntity<ApiResponse<RestrictionResponse>> unblockStudent(
            @PathVariable Long id,
            @Valid @RequestBody UnblockRequest request) {
        RestrictionResponse updated = restrictionService.unblockStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student unblocked successfully", updated));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestrictionResponse>>> getAllRestrictions() {
        List<RestrictionResponse> list = restrictionService.getAllRestrictions();
        return ResponseEntity.ok(ApiResponse.success("All placement restrictions retrieved successfully", list));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<RestrictionResponse>>> getStudentHistory(
            @PathVariable Long studentId) {
        List<RestrictionResponse> list = restrictionService.getStudentRestrictionHistory(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student restriction history retrieved successfully", list));
    }
}

