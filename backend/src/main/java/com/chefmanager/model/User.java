package com.chefmanager.model;
import jakarta.persistence.*;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name="users")
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false, unique=true)
  private String username;
  @Column(nullable=false)
  private String password; // demo only
  private String role;
  private boolean enabled=true;
}
