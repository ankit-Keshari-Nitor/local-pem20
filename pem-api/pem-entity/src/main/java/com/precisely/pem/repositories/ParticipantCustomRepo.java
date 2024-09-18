package com.precisely.pem.repositories;

import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.UserResponse;
import com.precisely.pem.models.Participant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ParticipantCustomRepo {
    Page<UserResponse> findUsers(UserRequest userRequest, Pageable pageable);
}
