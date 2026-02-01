package com.abbys.bms.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_warehouse_keeper")
public class WarehouseKeeper extends User{
    @Column(unique = true)
    private String warehouseStaffId;

    private boolean onDuty;

    @OneToMany(mappedBy = "warehouseKeeper")
    private List<Book> books = new ArrayList<>();

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public void addBook(Book book) {
        books.add(book);
        book.setWarehouseKeeper(this);
    }

    public void removeBook(Book book) {
        books.remove(book);
        book.setWarehouseKeeper(null);
    }

    public String getWarehouseStaffId() {
        return warehouseStaffId;
    }

    public void setWarehouseStaffId(String warehouseStaffId) {
        this.warehouseStaffId = warehouseStaffId;
    }

    public boolean isOnDuty() {
        return onDuty;
    }

    public void setOnDuty(boolean onDuty) {
        this.onDuty = onDuty;
    }
}
