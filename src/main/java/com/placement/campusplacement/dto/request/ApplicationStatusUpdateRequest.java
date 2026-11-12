package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ApplicationStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(?i)(APPLIED|UNDER_REVIEW|SELECTED|REJECTED|WITHDRAWN)$",
             message = "Status must be APPLIED, UNDER_REVIEW, SELECTED, REJECTED, or WITHDRAWN")
    private String status;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;

    public ApplicationStatusUpdateRequest() {}

    public String getStatus()  { return status; }
    public String getRemarks() { return remarks; }

    public void setStatus(String status)   { this.status = status; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

