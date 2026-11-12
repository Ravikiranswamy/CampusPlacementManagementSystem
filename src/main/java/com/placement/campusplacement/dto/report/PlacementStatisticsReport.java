package com.placement.campusplacement.dto.report;

public class PlacementStatisticsReport {

    private String companyName;
    private String departmentCode;
    private String departmentName;
    private Long totalApplications;
    private Long selectedStudents;
    private Long totalOffers;
    private Long acceptedOffers;

    public PlacementStatisticsReport() {}

    public PlacementStatisticsReport(String companyName, String departmentCode, String departmentName,
                                     Long totalApplications, Long selectedStudents,
                                     Long totalOffers, Long acceptedOffers) {
        this.companyName = companyName;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.totalApplications = totalApplications;
        this.selectedStudents = selectedStudents;
        this.totalOffers = totalOffers;
        this.acceptedOffers = acceptedOffers;
    }

    public String getCompanyName()         { return companyName; }
    public String getDepartmentCode()      { return departmentCode; }
    public String getDepartmentName()      { return departmentName; }
    public Long getTotalApplications()     { return totalApplications; }
    public Long getSelectedStudents()      { return selectedStudents; }
    public Long getTotalOffers()           { return totalOffers; }
    public Long getAcceptedOffers()        { return acceptedOffers; }

    public void setCompanyName(String companyName)             { this.companyName = companyName; }
    public void setDepartmentCode(String departmentCode)       { this.departmentCode = departmentCode; }
    public void setDepartmentName(String departmentName)       { this.departmentName = departmentName; }
    public void setTotalApplications(Long totalApplications)   { this.totalApplications = totalApplications; }
    public void setSelectedStudents(Long selectedStudents)     { this.selectedStudents = selectedStudents; }
    public void setTotalOffers(Long totalOffers)               { this.totalOffers = totalOffers; }
    public void setAcceptedOffers(Long acceptedOffers)         { this.acceptedOffers = acceptedOffers; }
}
