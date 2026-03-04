package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class ProductionOrder {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private String code;
  private String status; // DRAFT, PLANNED, IN_PROGRESS, CLOSED, CANCELED
  private Double outputQty;
  @ManyToOne private Product outputProduct;
}
