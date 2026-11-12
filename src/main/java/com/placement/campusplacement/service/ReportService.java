package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.report.PackageStatisticsReport;
import com.placement.campusplacement.dto.report.PlacementStatisticsReport;

import java.util.List;

public interface ReportService {

    List<PlacementStatisticsReport> getPlacementStatistics();

    List<PackageStatisticsReport> getPackageStatistics();
}
