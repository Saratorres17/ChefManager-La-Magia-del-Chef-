package com.chefmanager.controller;

import com.chefmanager.model.Sale;
import com.chefmanager.service.SaleService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {
    private final SaleService service;
    public SalesController(SaleService service){this.service = service;}


    @PostMapping
    public Sale create(@RequestBody Sale sale, @RequestHeader(value="X-User", defaultValue="system") String user){
        return service.create(sale, user);
    }


    @GetMapping
    public List<Sale> list(){ return service.list(); }
}
