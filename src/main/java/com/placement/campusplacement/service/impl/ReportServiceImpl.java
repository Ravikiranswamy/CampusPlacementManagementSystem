package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.report.PackageStatisticsReport;
import com.placement.campusplacement.dto.report.PlacementStatisticsReport;
import com.placement.campusplacement.service.ReportService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<PlacementStatisticsReport> getPlacementStatistics() {
        String sql = """
            SELECT 
                c.company_name,
                d.department_code,
                d.department_name,
                COUNT(DISTINCT a.application_id) AS total_applications,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.application_id END) AS selected_students,
                COUNT(DISTINCT o.offer_id) AS total_offers_issued,
                COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.offer_id END) AS accepted_offers
            FROM companies c
            JOIN placement_drives pd ON c.company_id = pd.company_id
            JOIN applications a ON pd.drive_id = a.drive_id
            JOIN students s ON a.student_id = s.student_id
            JOIN departments d ON s.department_id = d.department_id
            LEFT JOIN offers o ON a.application_id = o.application_id
            GROUP BY c.company_name, d.department_code, d.department_name
            ORDER BY c.company_name, d.department_code
            """;

        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> rows = query.getResultList();
        List<PlacementStatisticsReport> reports = new ArrayList<>();

        for (Object[] row : rows) {
            String company = (String) row[0];
            String deptCode = (String) row[1];
            String deptName = (String) row[2];
            Long totalApps = ((Number) row[3]).longValue();
            Long selected = ((Number) row[4]).longValue();
            Long totalOffers = ((Number) row[5]).longValue();
            Long accepted = ((Number) row[6]).longValue();

            reports.add(new PlacementStatisticsReport(
                    company, deptCode, deptName, totalApps, selected, totalOffers, accepted
            ));
        }

        return reports;
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<PackageStatisticsReport> getPackageStatistics() {
        String sql = """
            SELECT 
                c.company_name,
                COUNT(o.offer_id) AS accepted_placements,
                ROUND(AVG(o.offered_package_lpa), 2) AS average_package_lpa,
                MAX(o.offered_package_lpa) AS highest_package_lpa,
                MIN(o.offered_package_lpa) AS lowest_package_lpa
            FROM offers o
            JOIN applications a ON o.application_id = a.application_id
            JOIN placement_drives pd ON a.drive_id = pd.drive_id
            JOIN companies c ON pd.company_id = c.company_id
            WHERE o.offer_status = 'ACCEPTED'
            GROUP BY c.company_name
            ORDER BY average_package_lpa DESC
            """;

        Query query = entityManager.createNativeQuery(sql);
        List<Object[]> rows = query.getResultList();
        List<PackageStatisticsReport> reports = new ArrayList<>();

        for (Object[] row : rows) {
            String company = (String) row[0];
            Long accepted = ((Number) row[1]).longValue();
            BigDecimal avg = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;
            BigDecimal max = row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO;
            BigDecimal min = row[4] != null ? new BigDecimal(row[4].toString()) : BigDecimal.ZERO;

            reports.add(new PackageStatisticsReport(
                    company, accepted, avg, max, min
            ));
        }

        return reports;
    }
}

