package com.chefmanager.controller;

import com.chefmanager.model.Sala;
import com.chefmanager.repository.SalaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    private final SalaRepository repo;

    public SalaController(SalaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Sala> getAll() {
        return repo.findAll();
    }

    @GetMapping("/search")
    public List<Sala> search(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return repo.findAll();
        }
        return repo.findByNoDeSalaOrNombreComercialContaining(query.trim());
    }
}