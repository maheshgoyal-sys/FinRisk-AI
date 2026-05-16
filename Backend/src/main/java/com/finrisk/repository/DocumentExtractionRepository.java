package com.finrisk.repository;

import com.finrisk.model.DocumentExtraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DocumentExtractionRepository extends MongoRepository<DocumentExtraction, String> {
    Optional<DocumentExtraction> findByKycDocumentId(String kycDocumentId);
    Optional<DocumentExtraction> findByDocumentTypeAndExtractedAadhaarNumber(String documentType, String aadhaarNumber);
    Optional<DocumentExtraction> findByDocumentTypeAndExtractedPanNumber(String documentType, String panNumber);
}