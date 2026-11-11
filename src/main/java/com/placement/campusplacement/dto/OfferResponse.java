package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class OfferResponse {

    private Long offerId;
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String email;
    private String usn;
    private String departmentName;

    private Long driveId;
    private String driveTitle;
    private String companyName;
    private String roleTitle;

    private BigDecimal offeredPackageLpa;
    private LocalDate offerDate;
    private LocalDate joiningDate;
    private String offerStatus;
    private String offerLetterUrl;
    private String additionalInfo;
    private LocalDateTime createdAt;

    public OfferResponse() {}

    public Long getOfferId()                       { return offerId; }
    public Long getApplicationId()                 { return applicationId; }
    public Long getStudentId()                     { return studentId; }
    public String getStudentName()                 { return studentName; }
    public String getEmail()                       { return email; }
    public String getUsn()                         { return usn; }
    public String getDepartmentName()              { return departmentName; }
    public Long getDriveId()                       { return driveId; }
    public String getDriveTitle()                  { return driveTitle; }
    public String getCompanyName()                 { return companyName; }
    public String getRoleTitle()                   { return roleTitle; }
    public BigDecimal getOfferedPackageLpa()       { return offeredPackageLpa; }
    public LocalDate getOfferDate()                { return offerDate; }
    public LocalDate getJoiningDate()              { return joiningDate; }
    public String getOfferStatus()                 { return offerStatus; }
    public String getOfferLetterUrl()              { return offerLetterUrl; }
    public String getAdditionalInfo()              { return additionalInfo; }
    public LocalDateTime getCreatedAt()            { return createdAt; }

    public void setOfferId(Long offerId)                       { this.offerId = offerId; }
    public void setApplicationId(Long applicationId)           { this.applicationId = applicationId; }
    public void setStudentId(Long studentId)                   { this.studentId = studentId; }
    public void setStudentName(String studentName)             { this.studentName = studentName; }
    public void setEmail(String email)                         { this.email = email; }
    public void setUsn(String usn)                             { this.usn = usn; }
    public void setDepartmentName(String departmentName)       { this.departmentName = departmentName; }
    public void setDriveId(Long driveId)                       { this.driveId = driveId; }
    public void setDriveTitle(String driveTitle)               { this.driveTitle = driveTitle; }
    public void setCompanyName(String companyName)             { this.companyName = companyName; }
    public void setRoleTitle(String roleTitle)                 { this.roleTitle = roleTitle; }
    public void setOfferedPackageLpa(BigDecimal packageLpa)    { this.offeredPackageLpa = packageLpa; }
    public void setOfferDate(LocalDate offerDate)              { this.offerDate = offerDate; }
    public void setJoiningDate(LocalDate joiningDate)          { this.joiningDate = joiningDate; }
    public void setOfferStatus(String offerStatus)             { this.offerStatus = offerStatus; }
    public void setOfferLetterUrl(String offerLetterUrl)       { this.offerLetterUrl = offerLetterUrl; }
    public void setAdditionalInfo(String additionalInfo)       { this.additionalInfo = additionalInfo; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }
}
