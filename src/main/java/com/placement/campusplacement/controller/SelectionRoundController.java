package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.RoundResultResponse;
import com.placement.campusplacement.dto.SelectionRoundResponse;
import com.placement.campusplacement.dto.request.RoundResultRequest;
import com.placement.campusplacement.dto.request.SelectionRoundRequest;
import com.placement.campusplacement.service.SelectionRoundService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rounds")
public class SelectionRoundController {

    private final SelectionRoundService roundService;

    public SelectionRoundController(SelectionRoundService roundService) {
        this.roundService = roundService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SelectionRoundResponse>> createRound(
            @Valid @RequestBody SelectionRoundRequest request) {
        SelectionRoundResponse created = roundService.createRound(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Selection round created successfully", created));
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<ApiResponse<List<SelectionRoundResponse>>> getRoundsByDrive(
            @PathVariable Long driveId) {
        List<SelectionRoundResponse> rounds = roundService.getRoundsByDrive(driveId);
        return ResponseEntity.ok(ApiResponse.success("Drive rounds retrieved successfully", rounds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SelectionRoundResponse>> getRoundById(@PathVariable Long id) {
        SelectionRoundResponse round = roundService.getRoundById(id);
        return ResponseEntity.ok(ApiResponse.success("Round retrieved successfully", round));
    }

    @PostMapping("/results")
    public ResponseEntity<ApiResponse<RoundResultResponse>> recordResult(
            @Valid @RequestBody RoundResultRequest request) {
        RoundResultResponse recorded = roundService.recordRoundResult(request);
        return ResponseEntity.ok(ApiResponse.success("Round result recorded successfully", recorded));
    }

    @GetMapping("/{roundId}/results")
    public ResponseEntity<ApiResponse<List<RoundResultResponse>>> getResultsByRound(
            @PathVariable Long roundId) {
        List<RoundResultResponse> results = roundService.getResultsByRound(roundId);
        return ResponseEntity.ok(ApiResponse.success("Round results retrieved successfully", results));
    }

    @GetMapping("/application/{applicationId}/results")
    public ResponseEntity<ApiResponse<List<RoundResultResponse>>> getResultsByApplication(
            @PathVariable Long applicationId) {
        List<RoundResultResponse> results = roundService.getResultsByApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Application round results retrieved successfully", results));
    }
}
