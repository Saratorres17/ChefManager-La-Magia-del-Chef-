package com.chefmanager.controller;
import com.chefmanager.model.Product;
import com.chefmanager.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/products")
public class ProductController {
  private final ProductRepository repo;
  public ProductController(ProductRepository r){this.repo=r;}
  @GetMapping public List<Product> all(){ return repo.findAll(); }
  @PostMapping public Product create(@RequestBody Product p){ return repo.save(p); }
  @GetMapping("/{id}") public Product get(@PathVariable Long id){ return repo.findById(id).orElseThrow(); }
  @PutMapping("/{id}") public Product update(@PathVariable Long id, @RequestBody Product p){ p.setId(id); return repo.save(p); }
  @DeleteMapping("/{id}") public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
