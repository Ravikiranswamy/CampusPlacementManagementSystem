package com.placement.campusplacement.dto.report;

import java.math.BigDecimal;

public class PackageStatisticsReport {

    private String companyName;
    private Long acceptedPlacements;
    private BigDecimal averagePackageLpa;
    private BigDecimal highestPackageLpa;
    private BigDecimal lowestPackageLpa;

    public PackageStatisticsReport() {}

    public PackageStatisticsReport(String companyName, Long acceptedPlacements,
                                   BigDecimal averagePackageLpa, BigDecimal highestPackageLpa,
                                   BigDecimal lowestPackageLpa) {
        this.companyName = companyName;
        this.acceptedPlacements = acceptedPlacements;
        this.averagePackageLpa = averagePackageLpa;
        this.highestPackageLpa = highestPackageLpa;
        this.lowestPackageLpa = lowestPackageLpa;
    }

    public String getCompanyName()             { return companyName; }
    public Long getAcceptedPlacements()        { return acceptedPlacements; }
    public BigDecimal getAveragePackageLpa()   { return averagePackageLpa; }
    public BigDecimal getHighestPackageLpa()   { return highestPackageLpa; }
    public BigDecimal getLowestPackageLpa()    { return lowestPackageLpa; }

    public void setCompanyName(String companyName)                 { this.companyName = companyName; }
    public void setAcceptedPlacements(Long acceptedPlacements)     { this.acceptedPlacements = acceptedPlacements; }
    public void setAveragePackageLpa(BigDecimal averagePackageLpa) { this.averagePackageLpa = averagePackageLpa; }
    public void setHighestPackageLpa(BigDecimal highestPackageLpa) { this.highestPackageLpa = highestPackageLpa; }
    public void setLowestPackageLpa(BigDecimal lowestPackageLpa)   { this.lowestPackageLpa = lowestPackageLpa; }
}
