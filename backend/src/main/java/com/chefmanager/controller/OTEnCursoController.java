package com.chefmanager.controller;

import com.chefmanager.model.OperationLog;
import com.chefmanager.model.Purchase;
import com.chefmanager.repository.OperationLogRepository;
import com.chefmanager.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ot-en-curso")
@CrossOrigin(origins = "*")
public class OTEnCursoController {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private OperationLogRepository logRepository;

    @GetMapping("/purchases")
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        List<Purchase> purchases = purchaseRepository.findAll();
        return ResponseEntity.ok(purchases);
    }

    @PostMapping("/purchase/save")
    public ResponseEntity<Purchase> savePurchase(@RequestBody Purchase purchase) {
        if (purchase.getProductName() == null || purchase.getProductName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (purchase.getDistributor() == null || purchase.getDistributor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (purchase.getTotalPrice() == null || purchase.getTotalPrice() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Purchase saved = purchaseRepository.save(purchase);

        // Registrar en bitácora
        OperationLog log = new OperationLog();
        log.setUsername("admin"); // Puedes obtener el usuario del token JWT
        log.setAction("CREAR_COMPRA");
        log.setDetails("Compra registrada: " + purchase.getProductName() + " - " + purchase.getDistributor());
        logRepository.save(log);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<OperationLog>> getAllLogs() {
        List<OperationLog> logs = logRepository.findAll();
        return ResponseEntity.ok(logs);
    }
}