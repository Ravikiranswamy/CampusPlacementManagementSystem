package com.placement.campusplacement.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long userId, String fullName, String email, String role, Boolean isActive, LocalDateTime createdAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getUserId()             { return userId; }
    public String getFullName()         { return fullName; }
    public String getEmail()            { return email; }
    public String getRole()             { return role; }
    public Boolean getIsActive()        { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId)               { this.userId = userId; }
    public void setFullName(String fullName)         { this.fullName = fullName; }
    public void setEmail(String email)               { this.email = email; }
    public void setRole(String role)                 { this.role = role; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}

