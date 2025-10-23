package com.chefmanager.config;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 🔹 Aquí deberías buscar el usuario en tu base de datos (UserRepository)
        // Ejemplo temporal (usuario fijo para pruebas)
        if ("admin".equals(username)) {
            return new User(
                    "admin",
                    "$2a$10$7zCr5V8xKfMczRMqQmY4w.5Q1Cw6Hr07tq5RPIUyfQ0gR5DzhB4Fe", // contraseña "admin" encriptada con BCrypt
                    Collections.emptyList()
            );
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + username);
    }
}

