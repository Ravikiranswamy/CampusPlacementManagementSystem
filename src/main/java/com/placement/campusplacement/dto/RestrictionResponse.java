package com.placement.campusplacement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class RestrictionResponse {

    private Long restrictionId;
    private Long studentId;
    private String studentName;
    private String email;
    private String usn;
    private String departmentName;

    private Long imposedByUserId;
    private String imposedByName;

    private String reason;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private LocalDateTime unblockedAt;
    private String unblockReason;
    private LocalDateTime createdAt;

    public RestrictionResponse() {}

    public Long getRestrictionId()         { return restrictionId; }
    public Long getStudentId()             { return studentId; }
    public String getStudentName()         { return studentName; }
    public String getEmail()               { return email; }
    public String getUsn()                 { return usn; }
    public String getDepartmentName()      { return departmentName; }
    public Long getImposedByUserId()       { return imposedByUserId; }
    public String getImposedByName()       { return imposedByName; }
    public String getReason()              { return reason; }
    public LocalDate getStartDate()        { return startDate; }
    public LocalDate getEndDate()          { return endDate; }
    public Boolean getIsActive()           { return isActive; }
    public LocalDateTime getUnblockedAt()  { return unblockedAt; }
    public String getUnblockReason()       { return unblockReason; }
    public LocalDateTime getCreatedAt()    { return createdAt; }

    public void setRestrictionId(Long restrictionId)       { this.restrictionId = restrictionId; }
    public void setStudentId(Long studentId)               { this.studentId = studentId; }
    public void setStudentName(String studentName)         { this.studentName = studentName; }
    public void setEmail(String email)                     { this.email = email; }
    public void setUsn(String usn)                         { this.usn = usn; }
    public void setDepartmentName(String departmentName)   { this.departmentName = departmentName; }
    public void setImposedByUserId(Long imposedByUserId)   { this.imposedByUserId = imposedByUserId; }
    public void setImposedByName(String imposedByName)     { this.imposedByName = imposedByName; }
    public void setReason(String reason)                   { this.reason = reason; }
    public void setStartDate(LocalDate startDate)          { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate)              { this.endDate = endDate; }
    public void setIsActive(Boolean isActive)              { this.isActive = isActive; }
    public void setUnblockedAt(LocalDateTime unblockedAt)  { this.unblockedAt = unblockedAt; }
    public void setUnblockReason(String unblockReason)     { this.unblockReason = unblockReason; }
    public void setCreatedAt(LocalDateTime createdAt)      { this.createdAt = createdAt; }
}

