package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "kyc_documents")
public class KycDocument {
    @Id
    private String id;
    private String userId;
    private String documentType;
    private String fileName;
    private String fileUrl;
    private String status = "PENDING";
    private LocalDateTime uploadedAt;
}