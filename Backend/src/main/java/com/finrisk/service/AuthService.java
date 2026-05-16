package com.finrisk.service;

import com.finrisk.dto.auth.AuthResponse;
import com.finrisk.dto.auth.LoginRequest;
import com.finrisk.dto.auth.RegisterRequest;
import com.finrisk.model.User;
import com.finrisk.repository.UserRepository;
import com.finrisk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        // Allow role assignment if provided and valid (for admin creation)
        String role = request.getRole();
        if (role == null || (!role.equals("USER") && !role.equals("ADMIN"))) {
            role = "USER";
        }
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(
            token,
            new AuthResponse.UserDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole())
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(
            token,
            new AuthResponse.UserDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole())
        );
    }

    public AuthResponse.UserDTO getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponse.UserDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}