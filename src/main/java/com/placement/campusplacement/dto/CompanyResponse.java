package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

public class CompanyResponse {

    private Long companyId;
    private String companyName;
    private String industry;
    private String website;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public CompanyResponse() {}

    public CompanyResponse(Long companyId, String companyName, String industry,
                           String website, String contactEmail, String contactPhone,
                           String address, String description, Boolean isActive,
                           LocalDateTime createdAt) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.industry = industry;
        this.website = website;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.address = address;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getCompanyId()         { return companyId; }
    public String getCompanyName()     { return companyName; }
    public String getIndustry()        { return industry; }
    public String getWebsite()         { return website; }
    public String getContactEmail()    { return contactEmail; }
    public String getContactPhone()    { return contactPhone; }
    public String getAddress()         { return address; }
    public String getDescription()     { return description; }
    public Boolean getIsActive()       { return isActive; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setCompanyId(Long companyId)       { this.companyId = companyId; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setIndustry(String industry)       { this.industry = industry; }
    public void setWebsite(String website)         { this.website = website; }
    public void setContactEmail(String email)      { this.contactEmail = email; }
    public void setContactPhone(String phone)      { this.contactPhone = phone; }
    public void setAddress(String address)         { this.address = address; }
    public void setDescription(String description) { this.description = description; }
    public void setIsActive(Boolean isActive)      { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime time)   { this.createdAt = time; }
}

