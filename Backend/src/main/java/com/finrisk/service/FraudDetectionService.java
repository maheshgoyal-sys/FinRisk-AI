package com.finrisk.service;

import com.finrisk.model.FraudAlert;
import com.finrisk.repository.FraudAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionService {

    private final FraudAlertRepository fraudAlertRepository;

    public FraudAlert checkForDuplicateDocuments(String userId, String aadhaarNumber, String panNumber) {
        // Check if same Aadhaar or PAN used by different users
        log.info("Checking for duplicate documents for user: {}", userId);

        // In production, query the database for existing documents
        // For demo, simulate fraud detection
        Random random = new Random();
        if (random.nextInt(10) == 0) { // 10% chance of detecting duplicate
            FraudAlert alert = new FraudAlert();
            alert.setUserId(userId);
            alert.setAlertType("DUPLICATE_DOCUMENT");
            alert.setSeverity("HIGH");
            alert.setDescription("Aadhaar number " + aadhaarNumber + " has been used in another application");
            alert.setStatus("OPEN");
            alert.setFraudScore(85.0);
            alert.setCreatedAt(LocalDateTime.now());
            return fraudAlertRepository.save(alert);
        }
        return null;
    }

    public FraudAlert checkForFaceMismatch(String userId, Double similarityScore) {
        if (similarityScore != null && similarityScore < 70.0) {
            FraudAlert alert = new FraudAlert();
            alert.setUserId(userId);
            alert.setAlertType("FACE_MISMATCH");
            alert.setSeverity("HIGH");
            alert.setDescription("Selfie does not match Aadhaar photo. Similarity score: " + String.format("%.1f", similarityScore) + "%");
            alert.setStatus("OPEN");
            alert.setFraudScore(90.0);
            alert.setCreatedAt(LocalDateTime.now());
            log.warn("Face mismatch detected for user: {}", userId);
            return fraudAlertRepository.save(alert);
        }
        return null;
    }

    public FraudAlert checkForMultipleLoanApplications(String userId, List<String> existingApplicationIds) {
        if (existingApplicationIds != null && existingApplicationIds.size() > 3) {
            FraudAlert alert = new FraudAlert();
            alert.setUserId(userId);
            alert.setAlertType("MULTIPLE_APPLICATIONS");
            alert.setSeverity("MEDIUM");
            alert.setDescription("User has " + existingApplicationIds.size() + " pending loan applications");
            alert.setRelatedApplicationIds(existingApplicationIds);
            alert.setStatus("OPEN");
            alert.setFraudScore(60.0);
            alert.setCreatedAt(LocalDateTime.now());
            return fraudAlertRepository.save(alert);
        }
        return null;
    }

    public FraudAlert checkForSuspiciousActivity(String userId, String activityType, String details) {
        FraudAlert alert = new FraudAlert();
        alert.setUserId(userId);
        alert.setAlertType("SUSPICIOUS_ACTIVITY");
        alert.setSeverity("MEDIUM");
        alert.setDescription("Suspicious " + activityType + ": " + details);
        alert.setStatus("OPEN");
        alert.setFraudScore(50.0);
        alert.setCreatedAt(LocalDateTime.now());
        return fraudAlertRepository.save(alert);
    }

    public FraudAlert checkForFakeDocument(String userId, String documentType, Double confidence) {
        if (confidence != null && confidence < 50.0) {
            FraudAlert alert = new FraudAlert();
            alert.setUserId(userId);
            alert.setAlertType("FAKE_DOCUMENT");
            alert.setSeverity("CRITICAL");
            alert.setDescription("Low confidence (" + String.format("%.1f", confidence) + "%) in " + documentType + " document extraction");
            alert.setStatus("OPEN");
            alert.setFraudScore(95.0);
            alert.setCreatedAt(LocalDateTime.now());
            log.error("Fake document suspected for user: {}", userId);
            return fraudAlertRepository.save(alert);
        }
        return null;
    }

    public List<FraudAlert> getAlertsForUser(String userId) {
        return fraudAlertRepository.findByUserId(userId);
    }

    public List<FraudAlert> getAllOpenAlerts() {
        return fraudAlertRepository.findByStatus("OPEN");
    }

    public FraudAlert resolveAlert(String alertId, String resolvedBy, String resolution) {
        FraudAlert alert = fraudAlertRepository.findById(alertId).orElse(null);
        if (alert != null) {
            alert.setStatus("RESOLVED");
            alert.setResolvedBy(resolvedBy);
            alert.setResolution(resolution);
            alert.setResolvedAt(LocalDateTime.now());
            return fraudAlertRepository.save(alert);
        }
        return null;
    }

    public long getOpenAlertCount() {
        return fraudAlertRepository.countByStatus("OPEN");
    }

    public long getCriticalAlertCount() {
        return fraudAlertRepository.countBySeverity("CRITICAL");
    }
}