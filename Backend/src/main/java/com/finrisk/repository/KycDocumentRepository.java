package com.finrisk.repository;

import com.finrisk.model.KycDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface KycDocumentRepository extends MongoRepository<KycDocument, String> {
    List<KycDocument> findByUserId(String userId);
}