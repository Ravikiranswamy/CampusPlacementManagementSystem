package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class RestrictionRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Officer user ID is required")
    private Long officerUserId;

    @NotBlank(message = "Reason for restriction is required")
    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    private String reason;

    private LocalDate startDate;

    private LocalDate endDate;

    public RestrictionRequest() {}

    public Long getStudentId()         { return studentId; }
    public Long getOfficerUserId()     { return officerUserId; }
    public String getReason()          { return reason; }
    public LocalDate getStartDate()    { return startDate; }
    public LocalDate getEndDate()      { return endDate; }

    public void setStudentId(Long studentId)         { this.studentId = studentId; }
    public void setOfficerUserId(Long officerUserId) { this.officerUserId = officerUserId; }
    public void setReason(String reason)             { this.reason = reason; }
    public void setStartDate(LocalDate startDate)    { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate)        { this.endDate = endDate; }
}
