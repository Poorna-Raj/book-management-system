package com.abbys.bms.reposiotory;

import com.abbys.bms.dto.report.SupplierPerformanceReport;
import com.abbys.bms.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierRepo extends JpaRepository<Supplier,Long> {
    @Query("""
        SELECT new com.abbys.bms.dto.report.SupplierPerformanceReport(
            s.companyName,
            sm.name,
            COUNT(b),
            SUM(b.stock),
            AVG(b.price)
        )
        FROM Supplier s
        JOIN s.books b
        LEFT JOIN s.manager sm
        GROUP BY s.companyName, sm.name
    """)
    List<SupplierPerformanceReport> getSupplierPerformanceReport();
}
