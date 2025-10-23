package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class PayrollPeriod {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private LocalDate startDate;
  private LocalDate endDate;
  private String status; // OPEN, PRECALC, APPROVED
  private Double estimatedAmount;
}
