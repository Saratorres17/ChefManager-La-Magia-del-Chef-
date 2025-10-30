package com.chefmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.chefmanager.repository.AuditLogRepository;

@Controller
@RequestMapping("/audit")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/list")
    public String listAuditLogs(Model model) {
        model.addAttribute("logs", auditLogRepository.findAll());
        return "audit-log-list";
    }
}