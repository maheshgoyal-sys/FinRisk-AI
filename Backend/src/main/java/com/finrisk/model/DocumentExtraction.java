package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "document_extractions")
public class DocumentExtraction {
    @Id
    private String id;
    private String kycDocumentId;
    private String documentType;
    private String extractedName;
    private String extractedDob;
    private String extractedAddress;
    private String extractedAadhaarNumber;
    private String extractedPanNumber;
    private Double extractionConfidence;
    private String rawText;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}