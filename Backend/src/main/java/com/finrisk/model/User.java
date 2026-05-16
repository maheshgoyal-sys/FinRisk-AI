package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String fullName;
    private String phone;
    private String role = "USER";
    private boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Verification Fields
    private String aadhaarStatus = "NOT_SUBMITTED";
    private String aadhaarNumber;
    private String aadhaarName;
    private String aadhaarDob;
    private String aadhaarAddress;

    private String panStatus = "NOT_SUBMITTED";
    private String panNumber;
    private String panName;

    private String addressStatus = "NOT_SUBMITTED";
    private String address;

    private String photoStatus = "NOT_SUBMITTED";
    private String photoUrl;

    private String kycStatus = "NOT_SUBMITTED";
}