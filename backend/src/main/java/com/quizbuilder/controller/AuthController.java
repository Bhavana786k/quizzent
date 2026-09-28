package com.quizbuilder.controller;

import com.quizbuilder.dto.request.LoginRequest;
import com.quizbuilder.dto.request.RegisterRequest;
import com.quizbuilder.dto.response.ApiResponse;
import com.quizbuilder.dto.response.AuthResponse;
import com.quizbuilder.dto.response.UserDto;
import com.quizbuilder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto userDto = userService.getCurrentUserDto();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userDto));
    }
}
