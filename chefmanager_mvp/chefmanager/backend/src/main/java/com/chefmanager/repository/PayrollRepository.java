package com.chefmanager.repository;

import com.chefmanager.model.PayrollEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollRepository extends JpaRepository<PayrollEntry, Long> {
}
