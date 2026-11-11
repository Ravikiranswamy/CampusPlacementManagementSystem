package com.placement.campusplacement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoundResultResponse {

    private Long resultId;
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String usn;
    private Long roundId;
    private Integer roundNumber;
    private String roundName;
    private String resultStatus;
    private BigDecimal score;
    private String remarks;
    private LocalDateTime recordedAt;

    public RoundResultResponse() {}

    public Long getResultId()                  { return resultId; }
    public Long getApplicationId()             { return applicationId; }
    public Long getStudentId()                 { return studentId; }
    public String getStudentName()             { return studentName; }
    public String getUsn()                     { return usn; }
    public Long getRoundId()                   { return roundId; }
    public Integer getRoundNumber()            { return roundNumber; }
    public String getRoundName()               { return roundName; }
    public String getResultStatus()            { return resultStatus; }
    public BigDecimal getScore()               { return score; }
    public String getRemarks()                 { return remarks; }
    public LocalDateTime getRecordedAt()       { return recordedAt; }

    public void setResultId(Long resultId)                 { this.resultId = resultId; }
    public void setApplicationId(Long applicationId)       { this.applicationId = applicationId; }
    public void setStudentId(Long studentId)               { this.studentId = studentId; }
    public void setStudentName(String studentName)         { this.studentName = studentName; }
    public void setUsn(String usn)                         { this.usn = usn; }
    public void setRoundId(Long roundId)                   { this.roundId = roundId; }
    public void setRoundNumber(Integer roundNumber)        { this.roundNumber = roundNumber; }
    public void setRoundName(String roundName)             { this.roundName = roundName; }
    public void setResultStatus(String resultStatus)       { this.resultStatus = resultStatus; }
    public void setScore(BigDecimal score)                 { this.score = score; }
    public void setRemarks(String remarks)                 { this.remarks = remarks; }
    public void setRecordedAt(LocalDateTime recordedAt)    { this.recordedAt = recordedAt; }
}
