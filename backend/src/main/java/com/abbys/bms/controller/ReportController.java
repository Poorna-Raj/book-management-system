package com.abbys.bms.controller;

import com.abbys.bms.dto.report.BookSalesReport;
import com.abbys.bms.dto.report.CustomerPurchaseReport;
import com.abbys.bms.dto.report.InventoryStockReport;
import com.abbys.bms.dto.report.SupplierPerformanceReport;
import com.abbys.bms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {
    @Autowired
    private ReportService _service;

    @GetMapping("/inventory-stock")
    public List<InventoryStockReport> inventoryStockReport() {
        return _service.getInventoryStockReport();
    }

    @GetMapping("/customer-history/{id}")
    public List<CustomerPurchaseReport> customerPurchaseReports(@PathVariable Integer id) { return _service.getCustomerReport(id); }

    @GetMapping("/supplier-performance")
    public List<SupplierPerformanceReport> supplierPerformanceReports() { return _service.getSupplierPerformanceReport(); }

    @GetMapping("/book-sales-summary")
    public List<BookSalesReport> bookSalesSummary() {
        return _service.getBookSalesReports();
    }
}
