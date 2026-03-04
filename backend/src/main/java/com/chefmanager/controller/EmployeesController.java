package com.chefmanager.controller;

import com.chefmanager.model.Employees;
import com.chefmanager.service.EmployeesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class EmployeesController {

    @Autowired
    private EmployeesService employeesService;

    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employees empleado) {
        try {
            Employees newEmpleado = employeesService.saveEmpleado(empleado);
            return new ResponseEntity<>(newEmpleado, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    //Endpoint de la lista de los empleados
    @GetMapping
    public ResponseEntity<List<Employees>> getEmployees() {
        List<Employees> employees = employeesService.findAllEmployees();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }
}