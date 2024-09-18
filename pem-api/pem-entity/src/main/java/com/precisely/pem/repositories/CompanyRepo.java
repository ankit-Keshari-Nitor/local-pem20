package com.precisely.pem.repositories;

import com.precisely.pem.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepo extends JpaRepository<Company, String> {
    Company findByCompanyKey(String companyKey);

}
