package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String action;
    private String entityType;
    private String entityId;
    private Map<String, Object> oldValues;
    private Map<String, Object> newValues;
    private String ipAddress;
    private String userAgent;
    private String performedBy;
    private LocalDateTime timestamp;
    private String description;
}