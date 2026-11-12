package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity mapping 'round_results'.
 * Stores the outcome of a student application in a particular selection round.
 */
@Entity
@Table(name = "round_results",
       uniqueConstraints = @UniqueConstraint(name = "uq_application_round", columnNames = {"application_id", "round_id"}))
public class RoundResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id", nullable = false)
    private SelectionRound round;

    /**
     * Result status: QUALIFIED, REJECTED, PENDING, ABSENT
     */
    @Column(name = "result_status", nullable = false, length = 20)
    private String resultStatus = "PENDING";

    @Column(name = "score", precision = 6, scale = 2)
    private BigDecimal score;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) recordedAt = LocalDateTime.now();
    }

    public RoundResult() {}

    public Long getResultId()                  { return resultId; }
    public Application getApplication()        { return application; }
    public SelectionRound getRound()           { return round; }
    public String getResultStatus()            { return resultStatus; }
    public BigDecimal getScore()               { return score; }
    public String getRemarks()                 { return remarks; }
    public LocalDateTime getRecordedAt()       { return recordedAt; }

    public void setResultId(Long resultId)                 { this.resultId = resultId; }
    public void setApplication(Application application)    { this.application = application; }
    public void setRound(SelectionRound round)             { this.round = round; }
    public void setResultStatus(String resultStatus)       { this.resultStatus = resultStatus; }
    public void setScore(BigDecimal score)                 { this.score = score; }
    public void setRemarks(String remarks)                 { this.remarks = remarks; }
    public void setRecordedAt(LocalDateTime recordedAt)    { this.recordedAt = recordedAt; }
}

