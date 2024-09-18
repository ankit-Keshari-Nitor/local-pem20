package com.precisely.pem.repositories;

import com.precisely.pem.models.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Page<Role> findBySponsorKeyAndRoleScopeIn(String sponsorKey, List<String> roleScopes, Pageable pageable);
}
