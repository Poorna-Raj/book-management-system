package com.abbys.bms.service;

import com.abbys.bms.dto.inventory.InventoryResponse;
import com.abbys.bms.model.Inventory;
import com.abbys.bms.reposiotory.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepo inventoryRepo;

    public List<InventoryResponse> getAllInventories() {
        return inventoryRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Optional<InventoryResponse> getInventoryById(Long id) {
        return inventoryRepo.findById(id)
                .map(this::mapToDto);
    }

    private InventoryResponse mapToDto(Inventory inventory) {
        return new InventoryResponse(
                inventory.getInventoryId(),
                inventory.getInventoryTitle(),
                inventory.getTotalBooks(),
                inventory.getStatus(),
                inventory.getNote()
        );
    }
}
