package com.chefmanager.controller;

import com.chefmanager.model.Product;
import com.chefmanager.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}, maxAge = 3600)
public class ProductController {

  @Autowired
  private ProductService productService;

  // Obtener todos los productos con paginación
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllProducts(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "15") int size) {
    try {
      Page<Product> productPage = productService.getAllProducts(page, size);

      Map<String, Object> response = new HashMap<>();
      response.put("products", productPage.getContent());
      response.put("currentPage", productPage.getNumber());
      response.put("totalItems", productPage.getTotalElements());
      response.put("totalPages", productPage.getTotalPages());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // Obtener todos los productos sin paginación
  @GetMapping("/all")
  public ResponseEntity<List<Product>> getAllProductsNoPagination() {
    try {
      return ResponseEntity.ok(productService.getAllProducts());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // Obtener producto por ID
  @GetMapping("/{id}")
  public ResponseEntity<Product> getProductById(@PathVariable Long id) {
    try {
      Product product = productService.getProductById(id);
      return ResponseEntity.ok(product);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  // Obtener producto por SKU
  @GetMapping("/sku/{sku}")
  public ResponseEntity<Product> getProductBySku(@PathVariable String sku) {
    try {
      Product product = productService.getProductBySku(sku);
      return ResponseEntity.ok(product);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  // Crear nuevo producto
  @PostMapping
  public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
    try {
      Product createdProduct = productService.createProduct(product);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    } catch (RuntimeException e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(error);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Error al crear el producto");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  // Actualizar producto existente
  @PutMapping("/{id}")
  public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
    try {
      Product updatedProduct = productService.updateProduct(id, productDetails);
      return ResponseEntity.ok(updatedProduct);
    } catch (RuntimeException e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(error);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Error al actualizar el producto");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  // Eliminar producto
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
    try {
      productService.deleteProduct(id);
      Map<String, String> response = new HashMap<>();
      response.put("message", "Producto eliminado exitosamente");
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(error);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Error al eliminar el producto");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  // Verificar si existe un SKU
  @GetMapping("/check-sku/{sku}")
  public ResponseEntity<Map<String, Boolean>> checkSkuExists(@PathVariable String sku) {
    Map<String, Boolean> response = new HashMap<>();
    response.put("exists", productService.existsBySku(sku));
    return ResponseEntity.ok(response);
  }
}
