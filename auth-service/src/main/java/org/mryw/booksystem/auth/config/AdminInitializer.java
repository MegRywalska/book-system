package org.mryw.booksystem.auth.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.mryw.booksystem.auth.user.Role;
import org.mryw.booksystem.auth.user.User;
import org.mryw.booksystem.auth.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${seed.admin.email:admin@books.local}")
    private String adminEmail;

    @Value("${seed.admin.password:admin123}")
    private String adminPassword;

    @PostConstruct
    void initAdmin() {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
    }
}
