package com.finrisk.controller;

import com.finrisk.model.FraudAlert;
import com.finrisk.service.FraudDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudDetectionService fraudDetectionService;

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlert>> getUserAlerts(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(fraudDetectionService.getAlertsForUser(userId));
    }

    @GetMapping("/alerts/all")
    public ResponseEntity<List<FraudAlert>> getAllAlerts() {
        return ResponseEntity.ok(fraudDetectionService.getAllOpenAlerts());
    }

    @GetMapping("/alerts/count")
    public ResponseEntity<Map<String, Long>> getAlertCounts() {
        long openCount = fraudDetectionService.getOpenAlertCount();
        long criticalCount = fraudDetectionService.getCriticalAlertCount();
        return ResponseEntity.ok(Map.of("open", openCount, "critical", criticalCount));
    }

    @PutMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<FraudAlert> resolveAlert(
            @PathVariable String alertId,
            @RequestBody Map<String, String> request) {
        String resolvedBy = request.get("resolvedBy");
        String resolution = request.get("resolution");
        return ResponseEntity.ok(fraudDetectionService.resolveAlert(alertId, resolvedBy, resolution));
    }
}