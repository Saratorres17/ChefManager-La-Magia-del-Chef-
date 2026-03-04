package com.chefmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;     // quién
    private LocalDateTime whenAction = LocalDateTime.now(); // cuándo
    private String action;       // qué
    private String details;      // detalles

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getWhenAction() { return whenAction; }
    public void setWhenAction(LocalDateTime whenAction) { this.whenAction = whenAction; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details=details;}
}