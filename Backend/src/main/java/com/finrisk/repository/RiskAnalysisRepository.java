package com.finrisk.repository;

import com.finrisk.model.RiskAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RiskAnalysisRepository extends MongoRepository<RiskAnalysis, String> {
    List<RiskAnalysis> findByUserId(String userId);
    Optional<RiskAnalysis> findByApplicationId(String applicationId);
    List<RiskAnalysis> findByRiskLevel(String riskLevel);
    List<RiskAnalysis> findByIsEligible(Boolean isEligible);
}