package com.abbys.bms.service;

import com.abbys.bms.dto.supplier.SupplierCreateRequest;
import com.abbys.bms.dto.supplier.SupplierDto;
import com.abbys.bms.model.enums.Gender;
import com.abbys.bms.model.enums.Role;
import com.abbys.bms.model.Supplier;
import com.abbys.bms.model.SupplierManager;
import com.abbys.bms.reposiotory.SupplierManagerRepo;
import com.abbys.bms.reposiotory.SupplierRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepo supplierRepo;

    @Autowired
    private SupplierManagerRepo managerRepo;

    public SupplierDto createSupplier(SupplierCreateRequest dto) {
        Optional<SupplierManager> managerOpt = managerRepo.findById(dto.getManagerId());
        if(managerOpt.isEmpty())
            throw new IllegalArgumentException("Invalid managerId: No such SupplierManager exists.");

        SupplierManager manager = managerOpt.get();

        if(manager.getRole() != Role.SUPPLIER_MANAGER)
            throw new IllegalArgumentException("Invalid managerId: Not a SupplierManager.");

        Supplier supplier = new Supplier();
        supplier.setCompanyName(dto.getCompanyName());
        supplier.setContractorName(dto.getContractorName());
        supplier.setSupplierAddress(dto.getSupplierAddress());
        supplier.setContractorNic(dto.getContractorNic());
        supplier.setContractorContact(dto.getContractorContact());
        supplier.setCompanyEmail(dto.getCompanyEmail());
        supplier.setGender(Enum.valueOf(Gender.class, dto.getGender().toUpperCase()));
        supplier.setManager(manager);

        supplierRepo.save(supplier);

        manager.addSupplier(supplier);
        managerRepo.save(manager);

        return getSupplierDto(supplier);
    }

    public SupplierDto getSupplier(Long id) {
        Supplier supplier = supplierRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
        return getSupplierDto(supplier);
    }

    public List<SupplierDto> getAllSuppliers() {
        return supplierRepo.findAll().stream()
                .map(this::getSupplierDto)
                .collect(Collectors.toList());
    }

    public SupplierDto updateSupplier(Long id, SupplierCreateRequest dto) {
        Supplier supplier = supplierRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        supplier.setCompanyName(dto.getCompanyName());
        supplier.setContractorName(dto.getContractorName());
        supplier.setSupplierAddress(dto.getSupplierAddress());
        supplier.setContractorNic(dto.getContractorNic());
        supplier.setContractorContact(dto.getContractorContact());
        supplier.setCompanyEmail(dto.getCompanyEmail());
        supplier.setGender(Enum.valueOf(Gender.class, dto.getGender().toUpperCase()));

        supplierRepo.save(supplier);
        return getSupplierDto(supplier);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
        supplierRepo.delete(supplier);
    }

    private SupplierDto getSupplierDto(Supplier supplier) {
        SupplierDto dto = new SupplierDto();
        dto.setSupplierId(supplier.getSupplierId());
        dto.setCompanyName(supplier.getCompanyName());
        dto.setContractorName(supplier.getContractorName());
        dto.setSupplierAddress(supplier.getSupplierAddress());
        dto.setContractorNic(supplier.getContractorNic());
        dto.setContractorContact(supplier.getContractorContact());
        dto.setCompanyEmail(supplier.getCompanyEmail());
        dto.setGender(supplier.getGender());
        dto.setManagerId(supplier.getManager() != null ? supplier.getManager().getUserId() : null);
        return dto;
    }
}