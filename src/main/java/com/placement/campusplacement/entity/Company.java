package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'companies' table in Neon PostgreSQL.
 * Represents a recruiting company registered with the placement cell.
 */
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", nullable = false, unique = true, length = 150)
    private String companyName;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "contact_email", nullable = false, length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Company() {}

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
