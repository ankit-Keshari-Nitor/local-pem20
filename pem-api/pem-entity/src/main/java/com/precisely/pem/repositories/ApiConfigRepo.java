package com.precisely.pem.repositories;

import com.precisely.pem.models.ApiConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiConfigRepo extends JpaRepository<ApiConfig,String > {
    ApiConfig findByApiConfigKey(String apiConfigKey);
}
