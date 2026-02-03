package com.abbys.bms.dto.book;

import com.abbys.bms.model.enums.BookStatus;
import com.abbys.bms.model.enums.BookType;
import jakarta.validation.constraints.*;

public class BookCreateRequest {
    @NotBlank
    private String bookName;

    @Positive
    private int issue;

    @Positive
    private long pages;

    @Positive
    private int volume;

    @NotNull
    private BookStatus status;

    @NotNull
    private BookType type;

    @NotBlank
    private String isbn;

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

    public int getIssue() {
        return issue;
    }

    public void setIssue(int issue) {
        this.issue = issue;
    }

    public long getPages() {
        return pages;
    }

    public void setPages(long pages) {
        this.pages = pages;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public BookStatus getStatus() {
        return status;
    }

    public void setStatus(BookStatus status) {
        this.status = status;
    }

    public BookType getType() {
        return type;
    }

    public void setType(BookType type) {
        this.type = type;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
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
