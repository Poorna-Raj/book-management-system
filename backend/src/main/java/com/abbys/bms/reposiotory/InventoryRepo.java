package com.abbys.bms.reposiotory;

import com.abbys.bms.dto.report.InventoryStockReport;
import com.abbys.bms.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InventoryRepo extends JpaRepository<Inventory,Long> {
    @Query("""
        SELECT new com.abbys.bms.dto.report.InventoryStockReport(
            i.inventoryTitle,
            b.bookName,
            b.isbn,
            b.stock,
            b.price,
            s.companyName,
            wk.name
        )
        FROM Inventory i
        JOIN i.books b
        LEFT JOIN b.supplier s
        LEFT JOIN b.warehouseKeeper wk
    """)
    List<InventoryStockReport> getInventoryStockReport();
}
