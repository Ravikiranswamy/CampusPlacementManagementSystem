
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'student_skills' join table.
 * Represents a student's association with a skill, including
 * proficiency level and an optional certification link.
 *
 * Table now has 5 columns satisfying the DBMS course requirement:
 *   student_id, skill_id, proficiency_level, certification_url, added_at
 */
@Entity
@Table(name = "student_skills")
public class StudentSkill {

    @EmbeddedId
    private StudentSkillId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    /**
     * Proficiency level: BEGINNER, INTERMEDIATE, ADVANCED.
     * Stored as a string in the database; enum-like but kept flexible as VARCHAR.
     */
    @Column(name = "proficiency_level", length = 20)
    private String proficiencyLevel = "INTERMEDIATE";

    /** Optional URL to certificate or proof of skill (Coursera, LinkedIn, etc.) */
    @Column(name = "certification_url")
    private String certificationUrl;

    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) addedAt = LocalDateTime.now();
    }

    public StudentSkill() {}

    public StudentSkill(Student student, Skill skill, String proficiencyLevel, String certificationUrl) {
        this.id               = new StudentSkillId(student.getStudentId(), skill.getSkillId());
        this.student          = student;
        this.skill            = skill;
        this.proficiencyLevel = proficiencyLevel != null ? proficiencyLevel : "INTERMEDIATE";
        this.certificationUrl = certificationUrl;
    }

    public StudentSkillId getId()          { return id; }
    public Student getStudent()            { return student; }
    public Skill getSkill()                { return skill; }
    public String getProficiencyLevel()    { return proficiencyLevel; }
    public String getCertificationUrl()    { return certificationUrl; }
    public LocalDateTime getAddedAt()      { return addedAt; }

    public void setId(StudentSkillId id)                     { this.id = id; }
    public void setStudent(Student student)                  { this.student = student; }
    public void setSkill(Skill skill)                        { this.skill = skill; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
    public void setCertificationUrl(String certificationUrl) { this.certificationUrl = certificationUrl; }
    public void setAddedAt(LocalDateTime addedAt)            { this.addedAt = addedAt; }
}

