
package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /** Used to enforce email uniqueness before creating a new user. */
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByRoleOrderByCreatedAtDesc(String role);
}

