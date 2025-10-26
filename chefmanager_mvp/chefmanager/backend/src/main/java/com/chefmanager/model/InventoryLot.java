package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class InventoryLot {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private Product product;
  private String lotCode;
  private Double quantity;
  private LocalDate expiryDate;
}
