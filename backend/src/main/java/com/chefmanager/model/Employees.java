package com.chefmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "employees")
public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El DUI no puede estar vacío")
    @Size(min = 10, max = 10, message = "El DUI debe tener 10 caracteres (incluyendo el guion)")
    @Column(unique = true)
    private String dui;

    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$", message = "Los nombres solo pueden contener letras y espacios")
    @NotBlank(message = "Los nombres no pueden estar vacíos")
    private String names;

    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$", message = "Los nombres solo pueden contener letras y espacios")
    @NotBlank(message = "Los apellidos no pueden estar vacíos")
    private String lastName;

    @NotNull(message = "El salario semanal es obligatorio")
    @Positive(message = "El salario debe ser un valor positivo")
    private double weeklySalary;

    public Employees() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDui() {
        return dui;
    }

    public void setDui(String dui) {
        this.dui = dui;
    }

    public String getNames() {
        return names;
    }

    public void setNames(String names) {
        this.names = names;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public double getWeeklySalary() {
        return weeklySalary;
    }

    public void setWeeklySalary(double weeklySalary) {
        this.weeklySalary = weeklySalary;
    }
}