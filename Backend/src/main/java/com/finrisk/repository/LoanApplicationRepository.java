package com.finrisk.repository;

import com.finrisk.model.LoanApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LoanApplicationRepository extends MongoRepository<LoanApplication, String> {
    List<LoanApplication> findByUserId(String userId);
    List<LoanApplication> findByStatus(String status);
}