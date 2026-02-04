package com.abbys.bms.dto.report;

import com.abbys.bms.model.Book;
import com.abbys.bms.model.enums.BookType;

public class BookSalesReport {

    private BookType bookType;
    private Long totalSold;
    private Double totalRevenue;

    public BookSalesReport(
            BookType bookType,
            Long totalSold,
            Double totalRevenue
    ) {
        this.bookType = bookType;
        this.totalSold = totalSold;
        this.totalRevenue = totalRevenue;
    }

    public BookType getBookType() {
        return bookType;
    }

    public void setBookType(BookType bookType) {
        this.bookType = bookType;
    }

    public Long getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Long totalSold) {
        this.totalSold = totalSold;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}

