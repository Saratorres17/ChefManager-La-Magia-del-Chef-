package com.chefmanager.service;

import com.chefmanager.model.PayrollEntry;
import com.chefmanager.repository.PayrollRepository;

import java.util.List;

public class PayrollService {
    private final PayrollRepository repo;
    private final AuditService auditService;
    public PayrollService(PayrollRepository repo, AuditService auditService){this.repo = repo; this.auditService = auditService;}


    public PayrollEntry create(PayrollEntry p, String user){
        PayrollEntry saved = repo.save(p);
        auditService.log(user, "CREATE_PAYROLL", "id="+saved.getId()+",employee="+saved.getEmployeeName());
        return saved;
    }


    public List<PayrollEntry> list(){
        return repo.findAll();
    }
}
