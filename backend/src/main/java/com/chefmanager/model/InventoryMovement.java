package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class InventoryMovement {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private Product product;
  @ManyToOne private InventoryLot lot;
  private Double quantity; // positive=in, negative=out
  private String type; // IN, OUT, TRANSFER
  private String ref;
  private LocalDateTime createdAt = LocalDateTime.now();
}
