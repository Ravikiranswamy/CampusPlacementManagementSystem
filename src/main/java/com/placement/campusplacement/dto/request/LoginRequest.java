package com.placement.campusplacement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "USN, Email or Username is required")
    @Size(max = 150, message = "Identifier must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {}

    public String getEmail()    { return email; }
    public String getPassword() { return password; }

    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}

