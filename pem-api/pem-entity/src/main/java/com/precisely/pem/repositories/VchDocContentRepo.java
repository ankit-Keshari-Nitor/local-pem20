package com.precisely.pem.repositories;

import com.precisely.pem.models.VchDocumentContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VchDocContentRepo extends JpaRepository<VchDocumentContent, String> {
    VchDocumentContent findByDocumentKey(String documentKey);

    @Query("SELECT d.contentType, dc.content " +
            "FROM VchDocument d JOIN VchDocumentContent dc ON d.documentKey = dc.documentKey " +
            "WHERE d.documentKey = :documentKey")
    List<Object[]> findContentTypeAndDocumentContentByDocumentKey(@Param("documentKey") String documentKey);
}
