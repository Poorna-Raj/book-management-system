package com.abbys.bms.service;

import com.abbys.bms.dto.report.InventoryStockReport;
import com.abbys.bms.reposiotory.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private InventoryRepo _inventory;

    public List<InventoryStockReport> getInventoryStockReport(){
        return _inventory.getInventoryStockReport();
    }
}
