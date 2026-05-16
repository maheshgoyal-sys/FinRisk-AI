package com.finrisk.repository;

import com.finrisk.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByUserId(String userId);
    List<AuditLog> findByAction(String action);
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, String entityId);
    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<AuditLog> findByPerformedBy(String performedBy);
    List<AuditLog> findTop100ByOrderByTimestampDesc();
}