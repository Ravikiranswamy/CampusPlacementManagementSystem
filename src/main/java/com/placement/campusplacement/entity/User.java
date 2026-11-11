
package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'users' table.
 * Stores login credentials and role for every system user
 * (Student, Placement Team Member, Placement Officer).
 *
 * IMPORTANT: password_hash must NEVER be returned in any API response DTO.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    /** Always stored as a BCrypt hash — never plaintext. */
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    /** Allowed values enforced by DB CHECK: STUDENT, PLACEMENT_TEAM, PLACEMENT_OFFICER */
    @Column(name = "role", nullable = false, length = 30)
    private String role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public User() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getUserId()            { return userId; }
    public String getFullName()        { return fullName; }
    public String getEmail()           { return email; }
    public String getPasswordHash()    { return passwordHash; }
    public String getRole()            { return role; }
    public Boolean getIsActive()       { return isActive; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setUserId(Long userId)              { this.userId = userId; }
    public void setFullName(String fullName)        { this.fullName = fullName; }
    public void setEmail(String email)              { this.email = email; }
    public void setPasswordHash(String passwordHash){ this.passwordHash = passwordHash; }
    public void setRole(String role)                { this.role = role; }
    public void setIsActive(Boolean isActive)       { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
