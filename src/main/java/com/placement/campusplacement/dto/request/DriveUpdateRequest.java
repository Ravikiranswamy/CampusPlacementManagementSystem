package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DriveUpdateRequest {

    @Size(max = 200, message = "Drive title must not exceed 200 characters")
    private String driveTitle;

    private LocalDateTime registrationDeadline;

    private LocalDate driveDate;

    @Pattern(regexp = "^(?i)(DRAFT|PUBLISHED|CLOSED|CANCELLED)$", message = "Status must be DRAFT, PUBLISHED, CLOSED, or CANCELLED")
    private String status;

    private String description;

    public DriveUpdateRequest() {}

    public String getDriveTitle()                  { return driveTitle; }
    public LocalDateTime getRegistrationDeadline() { return registrationDeadline; }
    public LocalDate getDriveDate()                { return driveDate; }
    public String getStatus()                      { return status; }
    public String getDescription()                 { return description; }

    public void setDriveTitle(String driveTitle)                             { this.driveTitle = driveTitle; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline) { this.registrationDeadline = registrationDeadline; }
    public void setDriveDate(LocalDate driveDate)                            { this.driveDate = driveDate; }
    public void setStatus(String status)                                     { this.status = status; }
    public void setDescription(String description)                           { this.description = description; }
}

