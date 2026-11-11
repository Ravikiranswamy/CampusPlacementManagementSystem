package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkillCreateRequest {

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name must not exceed 100 characters")
    private String skillName;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    private String description;

    public SkillCreateRequest() {}

    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }

    public void setSkillName(String skillName) { this.skillName = skillName; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
}
