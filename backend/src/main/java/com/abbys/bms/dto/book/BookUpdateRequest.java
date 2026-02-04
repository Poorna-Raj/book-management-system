package com.abbys.bms.dto.book;

import com.abbys.bms.model.enums.BookStatus;
import com.abbys.bms.model.enums.BookType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BookUpdateRequest {

    @NotNull
    private String bookName;

    @NotNull
    private String isbn;

    @NotNull
    private BookType type;

    @NotNull
    private BookStatus status;

    @Min(0)
    private int issue;

    @Min(0)
    private int volume;

    @Min(1)
    private long pages;

    @Min(0)
    private int stock;

    @Positive
    private double price;

    @NotNull
    private Long inventoryId;

    private Long supplierId;

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BookType getType() {
        return type;
    }

    public void setType(BookType type) {
        this.type = type;
    }

    public BookStatus getStatus() {
        return status;
    }

    public void setStatus(BookStatus status) {
        this.status = status;
    }

    public int getIssue() {
        return issue;
    }

    public void setIssue(int issue) {
        this.issue = issue;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public long getPages() {
        return pages;
    }

    public void setPages(long pages) {
        this.pages = pages;
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

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
}
