package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

public class DepartmentResponse {

    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String hodName;
    private String officeEmail;
    private LocalDateTime createdAt;

    public DepartmentResponse() {}

    public DepartmentResponse(Long departmentId, String departmentCode, String departmentName,
                              String hodName, String officeEmail, LocalDateTime createdAt) {
        this.departmentId = departmentId;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.hodName = hodName;
        this.officeEmail = officeEmail;
        this.createdAt = createdAt;
    }

    public Long getDepartmentId() { return departmentId; }
    public String getDepartmentCode() { return departmentCode; }
    public String getDepartmentName() { return departmentName; }
    public String getHodName() { return hodName; }
    public String getOfficeEmail() { return officeEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public void setHodName(String hodName) { this.hodName = hodName; }
    public void setOfficeEmail(String officeEmail) { this.officeEmail = officeEmail; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

