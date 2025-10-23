package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class Product {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false, unique=true)
  private String sku;
  @Column(nullable=false)
  private String name;
  private String unit;
  private Double minStock;
  private Double maxStock;
  private Double cost;
}
