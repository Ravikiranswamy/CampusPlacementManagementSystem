package com.placement.campusplacement.dto;

public class LoginResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private Long studentId;
    private String homeRoute;

    public LoginResponse() {}

    public LoginResponse(Long userId, String fullName, String email, String role, Long studentId) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.studentId = studentId;

        // Map to corresponding frontend route
        if ("STUDENT".equalsIgnoreCase(role)) {
            this.homeRoute = "/student";
        } else if ("PLACEMENT_TEAM".equalsIgnoreCase(role)) {
            this.homeRoute = "/team";
        } else if ("PLACEMENT_OFFICER".equalsIgnoreCase(role)) {
            this.homeRoute = "/officer";
        } else {
            this.homeRoute = "/login";
        }
    }

    public Long getUserId()        { return userId; }
    public String getFullName()    { return fullName; }
    public String getEmail()       { return email; }
    public String getRole()        { return role; }
    public Long getStudentId()     { return studentId; }
    public String getHomeRoute()   { return homeRoute; }

    public void setUserId(Long userId)          { this.userId = userId; }
    public void setFullName(String fullName)    { this.fullName = fullName; }
    public void setEmail(String email)          { this.email = email; }
    public void setRole(String role)            { this.role = role; }
    public void setStudentId(Long studentId)    { this.studentId = studentId; }
    public void setHomeRoute(String homeRoute)  { this.homeRoute = homeRoute; }
}

