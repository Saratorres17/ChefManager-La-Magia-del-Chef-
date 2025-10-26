package com.chefmanager.controller;
import com.chefmanager.model.*;
import com.chefmanager.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/pos")
public class ProductionOrderController {
  private final ProductionOrderRepository repo;
  public ProductionOrderController(ProductionOrderRepository r){ this.repo=r; }
  @GetMapping public List<ProductionOrder> all(){ return repo.findAll(); }
  @PostMapping public ProductionOrder create(@RequestBody ProductionOrder po){ po.setStatus("DRAFT"); return repo.save(po); }
  @PostMapping("/{id}/status") public ProductionOrder setStatus(@PathVariable Long id, @RequestParam String status){
    ProductionOrder po = repo.findById(id).orElseThrow();
    po.setStatus(status); return repo.save(po);
  }
}
