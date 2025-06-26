package com.example.ticketingsystem.config;

import com.example.ticketingsystem.model.User;
import com.example.ticketingsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeAdmins(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createAdminIfNotExists("admin1", "supportadmin1", userRepository, passwordEncoder);
            createAdminIfNotExists("admin2", "supportadmin2", userRepository, passwordEncoder);
        };
    }

    private void createAdminIfNotExists(String username, String rawPassword, UserRepository repo, PasswordEncoder encoder) {
        if (repo.findByUsername(username).isEmpty()) {
            User admin = new User();
            admin.setUsername(username);
            admin.setPassword(encoder.encode(rawPassword));
            admin.setRole("ADMIN");
            repo.save(admin);
            System.out.println("✅ Admin account created: " + username);
        } else {
            System.out.println("ℹ️ Admin account already exists: " + username);
        }
    }
}
