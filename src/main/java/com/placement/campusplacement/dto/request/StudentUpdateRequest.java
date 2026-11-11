package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Request payload for updating an existing student's profile.
 */
public class StudentUpdateRequest {

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Size(max = 5, message = "Section must not exceed 5 characters")
    private String section;

    @DecimalMin(value = "0.00", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.00")
    private BigDecimal cgpa;

    @Min(value = 0, message = "Active backlogs cannot be negative")
    private Integer activeBacklogs;

    @Min(value = 2000, message = "Graduation year must be 2000 or later")
    private Integer graduationYear;

    @Size(max = 15, message = "Phone must not exceed 15 characters")
    private String phone;

    private String resumeUrl;

    public StudentUpdateRequest() {}

    public String getFullName()          { return fullName; }
    public String getSection()           { return section; }
    public BigDecimal getCgpa()          { return cgpa; }
    public Integer getActiveBacklogs()   { return activeBacklogs; }
    public Integer getGraduationYear()   { return graduationYear; }
    public String getPhone()             { return phone; }
    public String getResumeUrl()         { return resumeUrl; }

    public void setFullName(String fullName)               { this.fullName = fullName; }
    public void setSection(String section)                 { this.section = section; }
    public void setCgpa(BigDecimal cgpa)                   { this.cgpa = cgpa; }
    public void setActiveBacklogs(Integer activeBacklogs)  { this.activeBacklogs = activeBacklogs; }
    public void setGraduationYear(Integer graduationYear)  { this.graduationYear = graduationYear; }
    public void setPhone(String phone)                     { this.phone = phone; }
    public void setResumeUrl(String resumeUrl)             { this.resumeUrl = resumeUrl; }
}

