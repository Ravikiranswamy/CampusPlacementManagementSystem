package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyName;

    @Size(max = 100, message = "Industry must not exceed 100 characters")
    private String industry;

    @Size(max = 255, message = "Website must not exceed 255 characters")
    private String website;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid contact email")
    @Size(max = 150, message = "Contact email must not exceed 150 characters")
    private String contactEmail;

    @Size(max = 20, message = "Contact phone must not exceed 20 characters")
    private String contactPhone;

    private String address;

    private String description;

    public CompanyRequest() {}

    public String getCompanyName()  { return companyName; }
    public String getIndustry()     { return industry; }
    public String getWebsite()      { return website; }
    public String getContactEmail() { return contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public String getAddress()      { return address; }
    public String getDescription()  { return description; }

    public void setCompanyName(String companyName)   { this.companyName = companyName; }
    public void setIndustry(String industry)         { this.industry = industry; }
    public void setWebsite(String website)           { this.website = website; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public void setAddress(String address)           { this.address = address; }
    public void setDescription(String description)   { this.description = description; }
}
