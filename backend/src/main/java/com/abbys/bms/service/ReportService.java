package com.abbys.bms.service;

import com.abbys.bms.dto.report.BookSalesReport;
import com.abbys.bms.dto.report.CustomerPurchaseReport;
import com.abbys.bms.dto.report.InventoryStockReport;
import com.abbys.bms.dto.report.SupplierPerformanceReport;
import com.abbys.bms.reposiotory.CustomerOrderRepo;
import com.abbys.bms.reposiotory.InventoryRepo;
import com.abbys.bms.reposiotory.SupplierRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private InventoryRepo _inventory;
    @Autowired
    private CustomerOrderRepo _order;
    @Autowired
    private SupplierRepo _supplier;

    public List<InventoryStockReport> getInventoryStockReport(){
        return _inventory.getInventoryStockReport();
    }

    public List<CustomerPurchaseReport> getCustomerReport(Integer customerId) { return _order.getCustomerPurchaseReport(customerId); }

    public List<SupplierPerformanceReport> getSupplierPerformanceReport() { return _supplier.getSupplierPerformanceReport(); }

    public List<BookSalesReport> getBookSalesReports() {
        return _order.getBookSalesSummary();
    }
}
