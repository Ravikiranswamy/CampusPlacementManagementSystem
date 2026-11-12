package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApplicationRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Drive ID is required")
    private Long driveId;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;

    public ApplicationRequest() {}

    public Long getStudentId() { return studentId; }
    public Long getDriveId()   { return driveId; }
    public String getRemarks() { return remarks; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setDriveId(Long driveId)     { this.driveId = driveId; }
    public void setRemarks(String remarks)   { this.remarks = remarks; }
}

