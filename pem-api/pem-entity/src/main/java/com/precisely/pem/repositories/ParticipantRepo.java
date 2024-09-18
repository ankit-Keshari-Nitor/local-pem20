package com.precisely.pem.repositories;

import com.precisely.pem.models.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepo extends JpaRepository<Participant,String> {
}
