package com.chefmanager.service;

import com.chefmanager.model.AuditLog;
import com.chefmanager.repository.AuditRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditRepository auditRepository;
    public AuditService(AuditRepository auditRepository){
        this.auditRepository = auditRepository;
    }

    public void log(String user, String action, String details){
        AuditLog a = new AuditLog();
        a.setUsername(user);
        a.setAction(action);
        a.setDetails(details);
        auditRepository.save(a);
    }
}
