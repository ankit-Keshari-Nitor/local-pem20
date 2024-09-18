package com.precisely.pem.repositories;

import com.precisely.pem.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole,String> {
    Optional<UserRole> findByParticipantKey(String participantKey);
    List<UserRole> findByParticipantKeyIn(List<String> participantKeys);

    Optional<UserRole> findByRoleKey(String roleKEY);
}
