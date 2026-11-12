package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class RoundResultRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Round ID is required")
    private Long roundId;

    @NotBlank(message = "Result status is required")
    @Pattern(regexp = "^(?i)(QUALIFIED|REJECTED|PENDING|ABSENT)$", message = "Result status must be QUALIFIED, REJECTED, PENDING, or ABSENT")
    private String resultStatus;

    private BigDecimal score;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;

    public RoundResultRequest() {}

    public Long getApplicationId() { return applicationId; }
    public Long getRoundId()       { return roundId; }
    public String getResultStatus(){ return resultStatus; }
    public BigDecimal getScore()   { return score; }
    public String getRemarks()     { return remarks; }

    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public void setRoundId(Long roundId)             { this.roundId = roundId; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }
    public void setScore(BigDecimal score)           { this.score = score; }
    public void setRemarks(String remarks)           { this.remarks = remarks; }
}

