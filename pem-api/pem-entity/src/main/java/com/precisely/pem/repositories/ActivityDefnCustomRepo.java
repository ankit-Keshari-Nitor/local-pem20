package com.precisely.pem.repositories;

import com.precisely.pem.models.ActivityDefn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ActivityDefnCustomRepo {
    Page<ActivityDefn> getActivityDefnsPage(String name, String description, List<String> status, String application, String sponsorKey, Pageable pageable);
}
