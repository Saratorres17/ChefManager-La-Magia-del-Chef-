package com.chefmanager.repository;

import com.chefmanager.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Verificar si existe un producto con el mismo SKU (útil para validaciones)
    boolean existsBySku(String sku);

    // Buscar producto por SKU
    Optional<Product> findBySku(String sku);

    // Verificar si existe un SKU diferente al producto actual (para actualizaciones)
    boolean existsBySkuAndIdNot(String sku, Long id);

    // Búsqueda por nombre (opcional, por si lo necesitas después)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}