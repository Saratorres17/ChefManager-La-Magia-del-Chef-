package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity
public class Room {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false, unique=true) private String storeCode;
  @Column(nullable=false) private String name;
  private String departmentName;
  private String municipality;
  private String address;
  private Double latitude;
  private Double longitude;
  private String status; // OPERATIVE, REMODELING, CLOSED
  private String services; // comma separated
}
