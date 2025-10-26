package com.chefmanager.controller;
import com.chefmanager.model.Room;
import com.chefmanager.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/rooms")
public class RoomController {
  private final RoomRepository repo;
  public RoomController(RoomRepository r){ this.repo=r; }
  @GetMapping public List<Room> all(){ return repo.findAll(); }
  @GetMapping("/search") public List<Room> search(@RequestParam String q){ return repo.findByNameContainingIgnoreCase(q); }
  @PostMapping public Room create(@RequestBody Room r){ return repo.save(r); }
  @PutMapping("/{id}") public Room update(@PathVariable Long id, @RequestBody Room r){ r.setId(id); return repo.save(r); }
}
