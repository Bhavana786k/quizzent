package com.quizbuilder.service;

import com.quizbuilder.dto.request.LoginRequest;
import com.quizbuilder.dto.request.RegisterRequest;
import com.quizbuilder.dto.response.AuthResponse;
import com.quizbuilder.dto.response.UserDto;
import com.quizbuilder.entity.User;
import com.quizbuilder.exception.BadRequestException;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.exception.UnauthorizedException;
import com.quizbuilder.repository.UserRepository;
import com.quizbuilder.security.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getFullName(), savedUser.getEmail());
        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = new UserDto(user.getId(), user.getFullName(), user.getEmail());
        return new AuthResponse(token, userDto);
    }

    public User getCurrentUserEntity() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof String str) {
            email = str;
        } else {
            throw new UnauthorizedException("User is not authenticated");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public UserDto getCurrentUserDto() {
        User user = getCurrentUserEntity();
        return new UserDto(user.getId(), user.getFullName(), user.getEmail());
    }
}
