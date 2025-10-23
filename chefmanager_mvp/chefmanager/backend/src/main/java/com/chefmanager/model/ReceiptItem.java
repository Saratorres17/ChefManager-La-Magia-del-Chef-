package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class ReceiptItem {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private Receipt receipt;
  @ManyToOne(optional=false) private Product product;
  private Double quantity;
  private Double unitCost;
  private String lotCode;
  private LocalDate expiryDate;
}
