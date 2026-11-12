package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class SelectionRoundRequest {

    @NotNull(message = "Drive ID is required")
    private Long driveId;

    @NotNull(message = "Round number is required")
    @Min(value = 1, message = "Round number must be 1 or higher")
    private Integer roundNumber;

    @NotBlank(message = "Round name is required")
    @Size(max = 100, message = "Round name must not exceed 100 characters")
    private String roundName;

    private String roundDescription;

    private LocalDateTime scheduledAt;

    @Pattern(regexp = "^(?i)(PENDING|ONGOING|COMPLETED)$", message = "Status must be PENDING, ONGOING, or COMPLETED")
    private String roundStatus = "PENDING";

    public SelectionRoundRequest() {}

    public Long getDriveId()               { return driveId; }
    public Integer getRoundNumber()        { return roundNumber; }
    public String getRoundName()           { return roundName; }
    public String getRoundDescription()    { return roundDescription; }
    public LocalDateTime getScheduledAt()  { return scheduledAt; }
    public String getRoundStatus()         { return roundStatus; }

    public void setDriveId(Long driveId)                       { this.driveId = driveId; }
    public void setRoundNumber(Integer roundNumber)            { this.roundNumber = roundNumber; }
    public void setRoundName(String roundName)                 { this.roundName = roundName; }
    public void setRoundDescription(String roundDescription)   { this.roundDescription = roundDescription; }
    public void setScheduledAt(LocalDateTime scheduledAt)      { this.scheduledAt = scheduledAt; }
    public void setRoundStatus(String roundStatus)             { this.roundStatus = roundStatus; }
}

