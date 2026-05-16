package com.finrisk.service;

import com.finrisk.model.AuditLog;
import com.finrisk.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String userId, String userName, String action, String entityType,
                         String entityId, Map<String, Object> oldValues, Map<String, Object> newValues,
                         String ipAddress, String userAgent, String performedBy, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(userId);
        auditLog.setUserName(userName);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setOldValues(oldValues);
        auditLog.setNewValues(newValues);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setPerformedBy(performedBy);
        auditLog.setDescription(description);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
        log.info("Audit log created: {} - {} by {}", action, entityType, performedBy);
    }

    public void logUserRegistration(String userId, String email, String performedBy) {
        Map<String, Object> values = new HashMap<>();
        values.put("email", email);
        logAction(userId, null, "USER_REGISTERED", "USER", userId, null, values,
                null, null, performedBy, "New user registered");
    }

    public void logKycVerification(String userId, String kycId, String status, String performedBy) {
        Map<String, Object> values = new HashMap<>();
        values.put("status", status);
        logAction(userId, null, "KYC_VERIFICATION", "KYC_VERIFICATION", kycId, null, values,
                null, null, performedBy, "KYC verification status: " + status);
    }

    public void logLoanApplication(String userId, String applicationId, String status, String performedBy) {
        Map<String, Object> values = new HashMap<>();
        values.put("status", status);
        logAction(userId, null, "LOAN_APPLICATION", "LOAN_APPLICATION", applicationId, null, values,
                null, null, performedBy, "Loan application status: " + status);
    }

    public void logFraudAlert(String userId, String alertId, String action, String performedBy) {
        logAction(userId, null, action, "FRAUD_ALERT", alertId, null, null,
                null, null, performedBy, "Fraud alert action: " + action);
    }

    public void logManualOverride(String userId, String entityType, String entityId,
                                   Map<String, Object> oldValues, Map<String, Object> newValues, String performedBy) {
        logAction(userId, null, "MANUAL_OVERRIDE", entityType, entityId, oldValues, newValues,
                null, null, performedBy, "Manual override performed");
    }

    public List<AuditLog> getUserAuditLogs(String userId) {
        return auditLogRepository.findByUserId(userId);
    }

    public List<AuditLog> getRecentLogs(int limit) {
        return auditLogRepository.findTop100ByOrderByTimestampDesc().stream().limit(limit).toList();
    }

    public List<AuditLog> getLogsByEntity(String entityType, String entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    public List<AuditLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampBetween(start, end);
    }
}