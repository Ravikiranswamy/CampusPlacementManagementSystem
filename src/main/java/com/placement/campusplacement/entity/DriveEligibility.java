package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity mapping the 'drive_eligibility' table.
 * Stores academic eligibility criteria for a recruitment drive:
 * minimum CGPA, maximum backlogs, eligible graduation year, and notes.
 */
@Entity
@Table(name = "drive_eligibility")
public class DriveEligibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eligibility_id")
    private Long eligibilityId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false, unique = true)
    private PlacementDrive drive;

    @Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal minCgpa = BigDecimal.ZERO;

    @Column(name = "max_active_backlogs", nullable = false)
    private Integer maxActiveBacklogs = 0;

    @Column(name = "eligible_graduation_year", nullable = false)
    private Integer eligibleGraduationYear;

    @Column(name = "additional_criteria")
    private String additionalCriteria;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "eligibility", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DriveEligibilityDepartment> eligibleDepartments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public DriveEligibility() {}

    public Long getEligibilityId()                                   { return eligibilityId; }
    public PlacementDrive getDrive()                                  { return drive; }
    public BigDecimal getMinCgpa()                                    { return minCgpa; }
    public Integer getMaxActiveBacklogs()                             { return maxActiveBacklogs; }
    public Integer getEligibleGraduationYear()                         { return eligibleGraduationYear; }
    public String getAdditionalCriteria()                             { return additionalCriteria; }
    public LocalDateTime getCreatedAt()                               { return createdAt; }
    public List<DriveEligibilityDepartment> getEligibleDepartments()  { return eligibleDepartments; }

    public void setEligibilityId(Long eligibilityId)                                 { this.eligibilityId = eligibilityId; }
    public void setDrive(PlacementDrive drive)                                       { this.drive = drive; }
    public void setMinCgpa(BigDecimal minCgpa)                                       { this.minCgpa = minCgpa; }
    public void setMaxActiveBacklogs(Integer maxActiveBacklogs)                       { this.maxActiveBacklogs = maxActiveBacklogs; }
    public void setEligibleGraduationYear(Integer year)                               { this.eligibleGraduationYear = year; }
    public void setAdditionalCriteria(String criteria)                               { this.additionalCriteria = criteria; }
    public void setCreatedAt(LocalDateTime createdAt)                                 { this.createdAt = createdAt; }
    public void setEligibleDepartments(List<DriveEligibilityDepartment> departments)  { this.eligibleDepartments = departments; }
}
