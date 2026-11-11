package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OfferCreateRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Offered package LPA is required")
    @DecimalMin(value = "0.01", message = "Package LPA must be greater than 0")
    private BigDecimal offeredPackageLpa;

    private LocalDate offerDate;

    private LocalDate joiningDate;

    @Size(max = 255, message = "Offer letter URL must not exceed 255 characters")
    private String offerLetterUrl;

    private String additionalInfo;

    public OfferCreateRequest() {}

    public Long getApplicationId()                 { return applicationId; }
    public BigDecimal getOfferedPackageLpa()       { return offeredPackageLpa; }
    public LocalDate getOfferDate()                { return offerDate; }
    public LocalDate getJoiningDate()              { return joiningDate; }
    public String getOfferLetterUrl()              { return offerLetterUrl; }
    public String getAdditionalInfo()              { return additionalInfo; }

    public void setApplicationId(Long applicationId)           { this.applicationId = applicationId; }
    public void setOfferedPackageLpa(BigDecimal packageLpa)    { this.offeredPackageLpa = packageLpa; }
    public void setOfferDate(LocalDate offerDate)              { this.offerDate = offerDate; }
    public void setJoiningDate(LocalDate joiningDate)          { this.joiningDate = joiningDate; }
    public void setOfferLetterUrl(String offerLetterUrl)       { this.offerLetterUrl = offerLetterUrl; }
    public void setAdditionalInfo(String additionalInfo)       { this.additionalInfo = additionalInfo; }
}
