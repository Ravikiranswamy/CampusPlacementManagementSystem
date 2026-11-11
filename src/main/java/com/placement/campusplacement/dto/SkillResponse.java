package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for master skills.
 */
public class SkillResponse {

    private Long skillId;
    private String skillName;
    private String category;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public SkillResponse() {}

    public SkillResponse(Long skillId, String skillName, String category,
                         String description, Boolean isActive, LocalDateTime createdAt) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getSkillId() { return skillId; }
    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
