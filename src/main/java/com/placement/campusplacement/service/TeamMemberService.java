package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.UserResponse;
import com.placement.campusplacement.dto.request.CreateTeamMemberRequest;

import java.util.List;

public interface TeamMemberService {

    List<UserResponse> getAllTeamMembers();

    UserResponse createTeamMember(CreateTeamMemberRequest request);

    UserResponse toggleTeamMemberStatus(Long userId);

    UserResponse resetPassword(Long userId, String newPassword);

    void deleteTeamMember(Long userId);
}

