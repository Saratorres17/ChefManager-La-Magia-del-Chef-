package com.chefmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "El SKU es obligatorio")
  @Size(max = 50, message = "El SKU no puede exceder 50 caracteres")
  @Column(name = "sku", nullable = false, unique = true, length = 50)
  private String sku;

  @NotBlank(message = "El nombre del producto es obligatorio")
  @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
  @Column(name = "name", nullable = false)
  private String name;

  @NotNull(message = "El costo es obligatorio")
  @DecimalMin(value = "0.01", message = "El costo debe ser mayor a 0")
  @Digits(integer = 8, fraction = 2, message = "El costo debe tener máximo 8 dígitos enteros y 2 decimales")
  @Column(name = "cost", nullable = false, precision = 10, scale = 2)
  private BigDecimal cost;

  @NotNull(message = "Las unidades son obligatorias")
  @Min(value = 0, message = "Las unidades no pueden ser negativas")
  @Column(name = "units", nullable = false)
  private Integer units;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
