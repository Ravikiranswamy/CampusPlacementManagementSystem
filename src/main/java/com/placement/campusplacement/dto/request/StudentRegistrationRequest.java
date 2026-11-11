package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Request payload for student registration.
 * Creates both a User record (login credentials) and a Student record (academic profile)
 * in a single atomic database transaction.
 */
public class StudentRegistrationRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "USN is required")
    @Size(max = 20, message = "USN must not exceed 20 characters")
    private String usn;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @Size(max = 5, message = "Section must not exceed 5 characters")
    private String section;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.00", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.00")
    private BigDecimal cgpa;

    @NotNull(message = "Active backlogs count is required")
    @Min(value = 0, message = "Active backlogs cannot be negative")
    private Integer activeBacklogs;

    @NotNull(message = "Graduation year is required")
    @Min(value = 2000, message = "Graduation year must be 2000 or later")
    private Integer graduationYear;

    @Size(max = 15, message = "Phone must not exceed 15 characters")
    private String phone;

    private String resumeUrl;

    public StudentRegistrationRequest() {}

    public String getFullName()          { return fullName; }
    public String getEmail()             { return email; }
    public String getPassword()          { return password; }
    public String getUsn()               { return usn; }
    public Long getDepartmentId()        { return departmentId; }
    public String getSection()           { return section; }
    public BigDecimal getCgpa()          { return cgpa; }
    public Integer getActiveBacklogs()   { return activeBacklogs; }
    public Integer getGraduationYear()   { return graduationYear; }
    public String getPhone()             { return phone; }
    public String getResumeUrl()         { return resumeUrl; }

    public void setFullName(String fullName)               { this.fullName = fullName; }
    public void setEmail(String email)                     { this.email = email; }
    public void setPassword(String password)               { this.password = password; }
    public void setUsn(String usn)                         { this.usn = usn; }
    public void setDepartmentId(Long departmentId)         { this.departmentId = departmentId; }
    public void setSection(String section)                 { this.section = section; }
    public void setCgpa(BigDecimal cgpa)                   { this.cgpa = cgpa; }
    public void setActiveBacklogs(Integer activeBacklogs)  { this.activeBacklogs = activeBacklogs; }
    public void setGraduationYear(Integer graduationYear)  { this.graduationYear = graduationYear; }
    public void setPhone(String phone)                     { this.phone = phone; }
    public void setResumeUrl(String resumeUrl)             { this.resumeUrl = resumeUrl; }
}
