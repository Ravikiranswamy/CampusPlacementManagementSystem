package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'offers' table.
 * Records final placement offers issued to selected candidates.
 */
@Entity
@Table(name = "offers",
       uniqueConstraints = @UniqueConstraint(name = "uq_application_offer", columnNames = {"application_id"}))
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "offered_package_lpa", nullable = false, precision = 6, scale = 2)
    private BigDecimal offeredPackageLpa;

    @Column(name = "offer_date", nullable = false)
    private LocalDate offerDate = LocalDate.now();

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    /**
     * Offer status: OFFERED, ACCEPTED, REJECTED, WITHDRAWN
     */
    @Column(name = "offer_status", nullable = false, length = 20)
    private String offerStatus = "OFFERED";

    @Column(name = "offer_letter_url")
    private String offerLetterUrl;

    @Column(name = "additional_info")
    private String additionalInfo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (offerDate == null) offerDate = LocalDate.now();
    }

    public Offer() {}

    public Long getOfferId()                       { return offerId; }
    public Application getApplication()            { return application; }
    public BigDecimal getOfferedPackageLpa()       { return offeredPackageLpa; }
    public LocalDate getOfferDate()                { return offerDate; }
    public LocalDate getJoiningDate()              { return joiningDate; }
    public String getOfferStatus()                 { return offerStatus; }
    public String getOfferLetterUrl()              { return offerLetterUrl; }
    public String getAdditionalInfo()              { return additionalInfo; }
    public LocalDateTime getCreatedAt()            { return createdAt; }

    public void setOfferId(Long offerId)                       { this.offerId = offerId; }
    public void setApplication(Application application)        { this.application = application; }
    public void setOfferedPackageLpa(BigDecimal packageLpa)    { this.offeredPackageLpa = packageLpa; }
    public void setOfferDate(LocalDate offerDate)              { this.offerDate = offerDate; }
    public void setJoiningDate(LocalDate joiningDate)          { this.joiningDate = joiningDate; }
    public void setOfferStatus(String offerStatus)             { this.offerStatus = offerStatus; }
    public void setOfferLetterUrl(String offerLetterUrl)       { this.offerLetterUrl = offerLetterUrl; }
    public void setAdditionalInfo(String additionalInfo)       { this.additionalInfo = additionalInfo; }
    public void setCreatedAt(LocalDateTime createdAt)          { this.createdAt = createdAt; }
}
