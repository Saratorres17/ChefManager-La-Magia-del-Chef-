package com.chefmanager.controller;

import com.chefmanager.model.AuditLog;
import com.chefmanager.repository.AuditRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditRepository repo;
    public AuditController(AuditRepository repo){this.repo = repo;}


    @GetMapping
    public List<AuditLog> list(){ return repo.findAll(); }

}
