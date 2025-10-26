package com.chefmanager.service;

import com.chefmanager.model.Product;
import com.chefmanager.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Obtener todos los productos con paginación
    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findAll(pageable);
    }

    // Obtener todos los productos sin paginación
    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by("id").descending());
    }

    // Obtener producto por ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    // Obtener producto por SKU
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));
    }

    // Crear nuevo producto
    public Product createProduct(Product product) {
        // Validar que el SKU no exista
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("Ya existe un producto con el SKU: " + product.getSku());
        }

        // Validar valores numéricos
        validateProductValues(product);

        return productRepository.save(product);
    }

    // Actualizar producto existente
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        // Validar que el SKU no esté siendo usado por otro producto
        if (!product.getSku().equals(productDetails.getSku()) &&
                productRepository.existsBySku(productDetails.getSku())) {
            throw new RuntimeException("Ya existe otro producto con el SKU: " + productDetails.getSku());
        }

        // Validar valores numéricos
        validateProductValues(productDetails);

        // Actualizar campos
        product.setSku(productDetails.getSku());
        product.setName(productDetails.getName());
        product.setCost(productDetails.getCost());
        product.setUnits(productDetails.getUnits());

        return productRepository.save(product);
    }

    // Eliminar producto
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    // Validaciones adicionales
    private void validateProductValues(Product product) {
        if (product.getCost() == null || product.getCost().doubleValue() <= 0) {
            throw new RuntimeException("El costo debe ser mayor a 0");
        }

        if (product.getUnits() == null || product.getUnits() < 0) {
            throw new RuntimeException("Las unidades no pueden ser negativas");
        }
    }

    // Verificar si existe un producto
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    // Verificar si existe un SKU
    public boolean existsBySku(String sku) {
        return productRepository.existsBySku(sku);
    }
}
