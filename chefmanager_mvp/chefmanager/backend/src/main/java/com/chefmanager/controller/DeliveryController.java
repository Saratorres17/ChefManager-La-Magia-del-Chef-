package com.chefmanager.controller;
import com.chefmanager.model.Delivery;
import com.chefmanager.repository.DeliveryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/deliveries")
public class DeliveryController {
  private final DeliveryRepository repo;
  public DeliveryController(DeliveryRepository r){ this.repo=r; }
  @GetMapping public List<Delivery> all(){ return repo.findAll(); }
  @PostMapping public Delivery create(@RequestBody Delivery d){ d.setStatus("PENDING"); return repo.save(d); }
  @PostMapping("/{id}/status") public Delivery setStatus(@PathVariable Long id, @RequestParam String status){ var d=repo.findById(id).orElseThrow(); d.setStatus(status); return repo.save(d);}
}
