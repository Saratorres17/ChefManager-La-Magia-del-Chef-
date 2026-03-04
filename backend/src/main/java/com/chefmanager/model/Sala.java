package com.chefmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "salas")
public class Sala {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "No_de_sala", nullable = false, unique = true)
  private Integer noDeSala;

  @Column(name = "Nombre_comercial", nullable = false)
  private String nombreComercial;

  @Column(name = "direccion")
  private String direccion;

  @Column(name = "distrito")
  private String distrito;

  @Column(name = "municipio")
  private String municipio;

  @Column(name = "departamento")
  private String departamento;
}