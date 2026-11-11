
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'skills' table.
 * Represents a reusable technical/non-technical skill (e.g. Java, SQL, React).
 * Managed by placement team — students associate themselves to these skills.
 */
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @Column(name = "skill_name", nullable = false, unique = true, length = 100)
    private String skillName;

    @Column(name = "category", length = 50)
    private String category;

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

    public Skill() {}

    public Long getSkillId()           { return skillId; }
    public String getSkillName()       { return skillName; }
    public String getCategory()        { return category; }
    public String getDescription()     { return description; }
    public Boolean getIsActive()       { return isActive; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setSkillId(Long skillId)             { this.skillId = skillId; }
    public void setSkillName(String skillName)       { this.skillName = skillName; }
    public void setCategory(String category)         { this.category = category; }
    public void setDescription(String description)   { this.description = description; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}

