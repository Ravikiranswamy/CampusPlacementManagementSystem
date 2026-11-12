package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.report.PackageStatisticsReport;
import com.placement.campusplacement.dto.report.PlacementStatisticsReport;
import com.placement.campusplacement.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for Placement Analytics and Course Reports.
 * Fulfills the 2 DBMS Course Report requirements:
 * Report 1: Company-wise and Department-wise Placement Statistics
 * Report 2: Average and Highest Package Analysis
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * GET /api/reports/placement-stats
     * Report 1: Company-wise and Department-wise Placement Statistics.
     */
    @GetMapping("/placement-stats")
    public ResponseEntity<ApiResponse<List<PlacementStatisticsReport>>> getPlacementStatistics() {
        List<PlacementStatisticsReport> reports = reportService.getPlacementStatistics();
        return ResponseEntity.ok(ApiResponse.success("Placement statistics report generated successfully", reports));
    }

    /**
     * GET /api/reports/package-stats
     * Report 2: Average and Highest Package Analysis.
     */
    @GetMapping("/package-stats")
    public ResponseEntity<ApiResponse<List<PackageStatisticsReport>>> getPackageStatistics() {
        List<PackageStatisticsReport> reports = reportService.getPackageStatistics();
        return ResponseEntity.ok(ApiResponse.success("Package statistics report generated successfully", reports));
    }
}
