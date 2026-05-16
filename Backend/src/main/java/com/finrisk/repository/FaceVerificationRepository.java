package com.finrisk.repository;

import com.finrisk.model.FaceVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FaceVerificationRepository extends MongoRepository<FaceVerification, String> {
    Optional<FaceVerification> findByUserId(String userId);
    Optional<FaceVerification> findByKycVerificationId(String kycVerificationId);
}