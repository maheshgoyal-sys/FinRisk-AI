package com.finrisk.controller;

import com.finrisk.model.AuditLog;
import com.finrisk.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/my-logs")
    public ResponseEntity<List<AuditLog>> getMyLogs(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(auditService.getUserAuditLogs(userId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AuditLog>> getRecentLogs(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(auditService.getRecentLogs(limit));
    }

    @GetMapping("/entity")
    public ResponseEntity<List<AuditLog>> getLogsByEntity(
            @RequestParam String entityType,
            @RequestParam String entityId) {
        return ResponseEntity.ok(auditService.getLogsByEntity(entityType, entityId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<AuditLog>> getLogsByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return ResponseEntity.ok(auditService.getLogsByDateRange(startTime, endTime));
    }
}