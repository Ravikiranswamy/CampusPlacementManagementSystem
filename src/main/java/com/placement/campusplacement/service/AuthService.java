package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.LoginResponse;
import com.placement.campusplacement.dto.request.LoginRequest;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}

