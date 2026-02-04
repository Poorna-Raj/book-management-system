package com.abbys.bms.reposiotory;

import com.abbys.bms.dto.report.CustomerPurchaseReport;
import com.abbys.bms.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerOrderRepo extends JpaRepository<CustomerOrder,Long> {
    @Query("""
        SELECT new com.abbys.bms.dto.report.CustomerPurchaseReport(
            c.customerName,
            c.email,
            o.orderId,
            o.totalPrice,
            o.orderStatus,
            b.bookName,
            ca.name
        )
        FROM CustomerOrder o
        JOIN o.customer c
        JOIN o.cashier ca
        JOIN o.books b
        WHERE c.customerId = :customerId
    """)
    List<CustomerPurchaseReport> getCustomerPurchaseReport(
            @Param("customerId") Integer customerId
    );
}
