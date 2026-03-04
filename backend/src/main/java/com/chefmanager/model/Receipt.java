package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class Receipt {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private Supplier supplier;
  private LocalDate date = LocalDate.now();
  private String status; // CREATED, CONFIRMED
}
