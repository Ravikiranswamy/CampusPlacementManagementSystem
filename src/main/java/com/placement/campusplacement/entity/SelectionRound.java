package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'selection_rounds' table.
 * Represents an ordered round in a placement drive (e.g. Round 1: Aptitude, Round 2: Technical).
 */
@Entity
@Table(name = "selection_rounds",
       uniqueConstraints = @UniqueConstraint(name = "uq_drive_round", columnNames = {"drive_id", "round_number"}))
public class SelectionRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "round_id")
    private Long roundId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "round_name", nullable = false, length = 100)
    private String roundName;

    @Column(name = "round_description")
    private String roundDescription;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    /**
     * Round status: PENDING, ONGOING, COMPLETED
     */
    @Column(name = "round_status", nullable = false, length = 20)
    private String roundStatus = "PENDING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public SelectionRound() {}

    public Long getRoundId()                   { return roundId; }
    public PlacementDrive getDrive()           { return drive; }
    public Integer getRoundNumber()            { return roundNumber; }
    public String getRoundName()               { return roundName; }
    public String getRoundDescription()        { return roundDescription; }
    public LocalDateTime getScheduledAt()      { return scheduledAt; }
    public String getRoundStatus()             { return roundStatus; }
    public LocalDateTime getCreatedAt()        { return createdAt; }

    public void setRoundId(Long roundId)                       { this.roundId = roundId; }
    public void setDrive(PlacementDrive drive)                 { this.drive = drive; }
    public void setRoundNumber(Integer roundNumber)            { this.roundNumber = roundNumber; }
    public void setRoundName(String roundName)                 { this.roundName = roundName; }
    public void setRoundDescription(String roundDescription)   { this.roundDescription = roundDescription; }
    public void setScheduledAt(LocalDateTime scheduledAt)      { this.scheduledAt = scheduledAt; }
    public void setRoundStatus(String roundStatus)             { this.roundStatus = roundStatus; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }
}
