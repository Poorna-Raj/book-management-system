package com.abbys.bms.dto.book;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

public class BookUpdateRequest {
    private String bookName;

    @Min(0)
    private int stock;

    @Positive
    private double price;

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
