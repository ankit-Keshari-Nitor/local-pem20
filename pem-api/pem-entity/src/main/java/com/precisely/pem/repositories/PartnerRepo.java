package com.precisely.pem.repositories;

import com.precisely.pem.models.Partners;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerRepo extends JpaRepository<Partners,String>{
    Partners findByPartnerKey(String partnerKey);
}
