package com.chefmanager.repository;

import com.chefmanager.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    InventoryItem findBySku(String sku);
}
