package com.chefmanager.controller;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/kpi")
public class KpiController {
  @GetMapping("/inventory-turnover")
  public Map<String,Object> inv(){ return Map.of("kpi","inventoryTurnover","value",5.2); }
  @GetMapping("/orders-open")
  public Map<String,Object> orders(){ return Map.of("kpi","ordersOpen","value",3); }
  @GetMapping("/pos-in-progress")
  public Map<String,Object> pos(){ return Map.of("kpi","posInProgress","value",2); }
  @GetMapping("/payroll-next")
  public Map<String,Object> payroll(){ return Map.of("kpi","payrollNextDays","value",6); }
  @GetMapping("/alerts")
  public List<Map<String,String>> alerts(){ return List.of(Map.of("type","STOCK","message","Ajo granulado bajo en stock")); }
}
