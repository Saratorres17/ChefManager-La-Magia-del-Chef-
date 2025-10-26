package com.chefmanager.service;

import com.chefmanager.model.Employees;
import com.chefmanager.repository.EmployeesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeesService {
    @Autowired
    private EmployeesRepository employeesRepository;

    public Employees saveEmpleado(Employees empleado){

        Optional<Employees> existingEmployee = employeesRepository.findByDui(empleado.getDui());

        if (existingEmployee.isPresent()) {
            throw new IllegalArgumentException("Ya existe un empleado registrado con el DUI: " + empleado.getDui());
        }
        return employeesRepository.save(empleado);
    }

    // Lista de todos los empleados
    public List<Employees> findAllEmployees(){
        return employeesRepository.findAll();
    }
}