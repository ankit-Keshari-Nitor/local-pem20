package com.precisely.pem.repositories;

import com.precisely.pem.dtos.responses.UserResponse;
import com.precisely.pem.models.CompanyUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyUserRepo extends JpaRepository<CompanyUser,String> {
    CompanyUser findByCompanyUserKey(String companyUserKey);
}
