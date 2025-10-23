package com.chefmanager.service;

import com.chefmanager.model.Sale;
import com.chefmanager.repository.SaleRepository;

import java.util.List;

import static org.antlr.v4.runtime.tree.xpath.XPath.findAll;

public class SaleService {

    private final SaleRepository saleRepository;
    private final AuditService auditService;
    public SaleService(SaleRepository saleRepository, AuditService auditService){
        this.saleRepository = saleRepository;
        this.auditService = auditService;
    }


    public Sale create(Sale s, String user){
        Sale saved = saleRepository.save(s);
        auditService.log(user, "CREATE_SALE", "id=" + saved.getId());
        return saved;
    }


    public List<Sale> list(){
        return saleRepository.findAll();
    }

}
