package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
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

    private String jd1Url;
    private String jd2Url;
    private String jd3Url;
    private BigDecimal stipendMonthly;

    public DriveUpdateRequest() {}

    public String getDriveTitle()                  { return driveTitle; }
    public LocalDateTime getRegistrationDeadline() { return registrationDeadline; }
    public LocalDate getDriveDate()                { return driveDate; }
    public String getStatus()                      { return status; }
    public String getDescription()                 { return description; }
    public String getJd1Url()                      { return jd1Url; }
    public String getJd2Url()                      { return jd2Url; }
    public String getJd3Url()                      { return jd3Url; }
    public BigDecimal getStipendMonthly()          { return stipendMonthly; }

    public void setDriveTitle(String driveTitle)                             { this.driveTitle = driveTitle; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline) { this.registrationDeadline = registrationDeadline; }
    public void setDriveDate(LocalDate driveDate)                            { this.driveDate = driveDate; }
    public void setStatus(String status)                                     { this.status = status; }
    public void setDescription(String description)                           { this.description = description; }
    public void setJd1Url(String jd1Url)                                     { this.jd1Url = jd1Url; }
    public void setJd2Url(String jd2Url)                                     { this.jd2Url = jd2Url; }
    public void setJd3Url(String jd3Url)                                     { this.jd3Url = jd3Url; }
    public void setStipendMonthly(BigDecimal stipendMonthly)                 { this.stipendMonthly = stipendMonthly; }
}

