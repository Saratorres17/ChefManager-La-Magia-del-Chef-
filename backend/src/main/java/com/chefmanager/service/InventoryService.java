package com.chefmanager.service;

import com.chefmanager.model.InventoryItem;
import com.chefmanager.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository repo;
    private final AuditService auditService;
    public InventoryService(InventoryRepository repo, AuditService auditService){this.repo = repo; this.auditService = auditService;}


    public InventoryItem createOrUpdate(InventoryItem item, String user){
        InventoryItem saved = repo.save(item);
        auditService.log(user, "UPSERT_INVENTORY", "id="+saved.getId()+",sku="+saved.getSku());
        return saved;
    }

    public List<InventoryItem> list(){
        return repo.findAll();
    }
}