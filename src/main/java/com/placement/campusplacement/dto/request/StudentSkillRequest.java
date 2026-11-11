package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request payload for associating a skill with a student.
 */
public class StudentSkillRequest {

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @Pattern(regexp = "^(?i)(BEGINNER|INTERMEDIATE|ADVANCED)$", message = "Proficiency level must be BEGINNER, INTERMEDIATE, or ADVANCED")
    private String proficiencyLevel = "INTERMEDIATE";

    @Size(max = 255, message = "Certification URL must not exceed 255 characters")
    private String certificationUrl;

    public StudentSkillRequest() {}

    public Long getSkillId() { return skillId; }
    public String getProficiencyLevel() { return proficiencyLevel; }
    public String getCertificationUrl() { return certificationUrl; }

    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
    public void setCertificationUrl(String certificationUrl) { this.certificationUrl = certificationUrl; }
}

