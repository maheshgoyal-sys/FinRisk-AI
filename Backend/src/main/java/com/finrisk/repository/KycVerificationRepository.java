package com.finrisk.repository;

import com.finrisk.model.KycVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface KycVerificationRepository extends MongoRepository<KycVerification, String> {
    Optional<KycVerification> findByUserId(String userId);
    List<KycVerification> findByOverallStatus(String status);
    List<KycVerification> findByAadhaarStatus(String status);
    List<KycVerification> findByPanStatus(String status);
}