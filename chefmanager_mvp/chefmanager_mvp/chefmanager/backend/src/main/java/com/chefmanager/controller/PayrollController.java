package com.chefmanager.controller;
import com.chefmanager.model.PayrollPeriod;
import com.chefmanager.repository.PayrollPeriodRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/payroll")
public class PayrollController {
  private final PayrollPeriodRepository repo;
  public PayrollController(PayrollPeriodRepository r){ this.repo=r; }
  @GetMapping("/periods") public List<PayrollPeriod> all(){ return repo.findAll(); }
  @PostMapping("/periods") public PayrollPeriod create(@RequestBody PayrollPeriod p){ p.setStatus("OPEN"); return repo.save(p); }
  @PostMapping("/periods/{id}/precalc") public PayrollPeriod precalc(@PathVariable Long id){ var p=repo.findById(id).orElseThrow(); p.setStatus("PRECALC"); p.setEstimatedAmount(1000.0); return repo.save(p); }
  @PostMapping("/periods/{id}/approve") public PayrollPeriod approve(@PathVariable Long id){ var p=repo.findById(id).orElseThrow(); p.setStatus("APPROVED"); return repo.save(p); }
}
