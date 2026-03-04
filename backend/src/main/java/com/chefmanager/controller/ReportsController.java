package com.chefmanager.controller;

import com.chefmanager.repository.InventoryRepository;
import com.chefmanager.repository.PayrollRepository;
import com.chefmanager.repository.SaleRepository;
import com.chefmanager.util.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    private final SaleRepository saleRepo;
    private final InventoryRepository invRepo;
    private final PayrollRepository payrollRepo;
    private final ExportService exportService;


    public ReportsController(SaleRepository saleRepo, InventoryRepository invRepo, PayrollRepository payrollRepo, ExportService exportService){
        this.saleRepo = saleRepo; this.invRepo = invRepo; this.payrollRepo = payrollRepo; this.exportService = exportService;
    }


    @GetMapping(path="/sales.csv")
    public ResponseEntity<byte[]> salesCsv(){
        try{
            byte[] data = exportService.toCsvSales(saleRepo.findAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ventas.csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(data);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping(path="/sales.pdf")
    public ResponseEntity<byte[]> salesPdf(){
        try{
            byte[] data = exportService.toPdfSales(saleRepo.findAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ventas.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(data);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}
