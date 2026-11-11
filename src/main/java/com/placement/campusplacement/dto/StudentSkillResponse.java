package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for a skill associated with a student.
 */
public class StudentSkillResponse {

    private Long skillId;
    private String skillName;
    private String category;
    private String proficiencyLevel;
    private String certificationUrl;
    private LocalDateTime addedAt;

    public StudentSkillResponse() {}

    public StudentSkillResponse(Long skillId, String skillName, String category,
                                String proficiencyLevel, String certificationUrl,
                                LocalDateTime addedAt) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.proficiencyLevel = proficiencyLevel;
        this.certificationUrl = certificationUrl;
        this.addedAt = addedAt;
    }

    public Long getSkillId() { return skillId; }
    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getProficiencyLevel() { return proficiencyLevel; }
    public String getCertificationUrl() { return certificationUrl; }
    public LocalDateTime getAddedAt() { return addedAt; }

    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public void setCategory(String category) { this.category = category; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
    public void setCertificationUrl(String certificationUrl) { this.certificationUrl = certificationUrl; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}

