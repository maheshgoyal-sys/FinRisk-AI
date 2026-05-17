package com.finrisk.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

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

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getAadhaarStatus() { return aadhaarStatus; }
    public void setAadhaarStatus(String aadhaarStatus) { this.aadhaarStatus = aadhaarStatus; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getAadhaarName() { return aadhaarName; }
    public void setAadhaarName(String aadhaarName) { this.aadhaarName = aadhaarName; }

    public String getAadhaarDob() { return aadhaarDob; }
    public void setAadhaarDob(String aadhaarDob) { this.aadhaarDob = aadhaarDob; }

    public String getAadhaarAddress() { return aadhaarAddress; }
    public void setAadhaarAddress(String aadhaarAddress) { this.aadhaarAddress = aadhaarAddress; }

    public String getPanStatus() { return panStatus; }
    public void setPanStatus(String panStatus) { this.panStatus = panStatus; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getPanName() { return panName; }
    public void setPanName(String panName) { this.panName = panName; }

    public String getAddressStatus() { return addressStatus; }
    public void setAddressStatus(String addressStatus) { this.addressStatus = addressStatus; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhotoStatus() { return photoStatus; }
    public void setPhotoStatus(String photoStatus) { this.photoStatus = photoStatus; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
}