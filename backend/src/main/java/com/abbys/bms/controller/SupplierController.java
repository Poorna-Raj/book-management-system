package com.abbys.bms.controller;

import com.abbys.bms.dto.SupplierCreateRequest;
import com.abbys.bms.dto.SupplierDto;
import com.abbys.bms.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody SupplierCreateRequest dto) {
        try {
            SupplierDto created = supplierService.createSupplier(dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplier(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supplierService.getSupplier(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public List<SupplierDto> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long id, @RequestBody SupplierCreateRequest dto) {
        try {
            return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}