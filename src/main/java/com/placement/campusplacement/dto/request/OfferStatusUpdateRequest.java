package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OfferStatusUpdateRequest {

    @NotBlank(message = "Offer status is required")
    @Pattern(regexp = "^(?i)(OFFERED|ACCEPTED|REJECTED|WITHDRAWN)$",
             message = "Status must be OFFERED, ACCEPTED, REJECTED, or WITHDRAWN")
    private String offerStatus;

    public OfferStatusUpdateRequest() {}

    public String getOfferStatus() { return offerStatus; }

    public void setOfferStatus(String offerStatus) { this.offerStatus = offerStatus; }
}

