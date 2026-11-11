package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

public class SelectionRoundResponse {

    private Long roundId;
    private Long driveId;
    private String driveTitle;
    private String companyName;
    private Integer roundNumber;
    private String roundName;
    private String roundDescription;
    private LocalDateTime scheduledAt;
    private String roundStatus;
    private LocalDateTime createdAt;

    public SelectionRoundResponse() {}

    public Long getRoundId()               { return roundId; }
    public Long getDriveId()               { return driveId; }
    public String getDriveTitle()          { return driveTitle; }
    public String getCompanyName()         { return companyName; }
    public Integer getRoundNumber()        { return roundNumber; }
    public String getRoundName()           { return roundName; }
    public String getRoundDescription()    { return roundDescription; }
    public LocalDateTime getScheduledAt()  { return scheduledAt; }
    public String getRoundStatus()         { return roundStatus; }
    public LocalDateTime getCreatedAt()    { return createdAt; }

    public void setRoundId(Long roundId)                       { this.roundId = roundId; }
    public void setDriveId(Long driveId)                       { this.driveId = driveId; }
    public void setDriveTitle(String driveTitle)               { this.driveTitle = driveTitle; }
    public void setCompanyName(String companyName)             { this.companyName = companyName; }
    public void setRoundNumber(Integer roundNumber)            { this.roundNumber = roundNumber; }
    public void setRoundName(String roundName)                 { this.roundName = roundName; }
    public void setRoundDescription(String roundDescription)   { this.roundDescription = roundDescription; }
    public void setScheduledAt(LocalDateTime scheduledAt)      { this.scheduledAt = scheduledAt; }
    public void setRoundStatus(String roundStatus)             { this.roundStatus = roundStatus; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }
}
