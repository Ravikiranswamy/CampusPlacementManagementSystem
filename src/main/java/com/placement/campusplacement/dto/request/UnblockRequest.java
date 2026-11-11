package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UnblockRequest {

    @NotNull(message = "Officer user ID is required")
    private Long officerUserId;

    @NotBlank(message = "Unblock reason is required")
    @Size(max = 1000, message = "Unblock reason cannot exceed 1000 characters")
    private String unblockReason;

    public UnblockRequest() {}

    public Long getOfficerUserId()     { return officerUserId; }
    public String getUnblockReason()   { return unblockReason; }

    public void setOfficerUserId(Long officerUserId)     { this.officerUserId = officerUserId; }
    public void setUnblockReason(String unblockReason)   { this.unblockReason = unblockReason; }
}
