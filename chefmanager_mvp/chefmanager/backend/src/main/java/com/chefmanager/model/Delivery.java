package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class Delivery {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private String routeCode;
  private String status; // PENDING, IN_TRANSIT, DELIVERED
  private String proofUrl;
}
