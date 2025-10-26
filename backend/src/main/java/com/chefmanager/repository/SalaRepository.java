package com.chefmanager.repository;

import com.chefmanager.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SalaRepository extends JpaRepository<Sala, Long> {

    // Buscar por número de sala o nombre comercial (case-insensitive)
    @Query("SELECT s FROM Sala s WHERE " +
            "CAST(s.noDeSala AS string) LIKE %:q% OR " +
            "LOWER(s.nombreComercial) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Sala> findByNoDeSalaOrNombreComercialContaining(@Param("q") String q);
}