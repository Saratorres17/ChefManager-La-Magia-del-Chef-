package com.chefmanager.controller;

import com.chefmanager.model.InventoryItem;
import com.chefmanager.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService service;
    public InventoryController(InventoryService service){this.service = service;}


    @PostMapping
    public InventoryItem upsert(@RequestBody InventoryItem item, @RequestHeader(value="X-User", defaultValue="system") String user){
        return service.createOrUpdate(item, user);
    }


    @GetMapping
    public List<InventoryItem> list(){ return service.list(); }
}
