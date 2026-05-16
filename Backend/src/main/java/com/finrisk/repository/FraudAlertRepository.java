package com.finrisk.repository;

import com.finrisk.model.FraudAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FraudAlertRepository extends MongoRepository<FraudAlert, String> {
    List<FraudAlert> findByUserId(String userId);
    List<FraudAlert> findByStatus(String status);
    List<FraudAlert> findBySeverity(String severity);
    List<FraudAlert> findByStatusAndSeverity(String status, String severity);
    List<FraudAlert> findByRelatedApplicationIdsContaining(String applicationId);
    long countByStatus(String status);
    long countBySeverity(String severity);
}