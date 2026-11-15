package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.UserResponse;
import com.placement.campusplacement.dto.request.CreateTeamMemberRequest;
import com.placement.campusplacement.entity.User;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.UserRepository;
import com.placement.campusplacement.service.TeamMemberService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamMemberServiceImpl implements TeamMemberService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeamMemberServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllTeamMembers() {
        return userRepository.findByRoleOrderByCreatedAtDesc("PLACEMENT_TEAM")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponse createTeamMember(CreateTeamMemberRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email '" + email + "' already exists.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("PLACEMENT_TEAM");
        user.setIsActive(true);

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse toggleTeamMemberStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        User updated = userRepository.save(user);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTeamMember(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        userRepository.delete(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
}

