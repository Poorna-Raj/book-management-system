package com.abbys.bms.model;

import com.abbys.bms.model.enums.Shift;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_warehouse_manager")
public class WarehouseManager extends WarehouseKeeper {
    @Enumerated(EnumType.STRING)
    private Shift shift;

    @OneToMany(mappedBy = "warehouseManager")
    private List<Book> books = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "manager_id")
    private List<WarehouseKeeper> supervise = new ArrayList<>();

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void addBook(Book book) {
        books.add(book);
        book.setWarehouseManager(this);
    }

    public void removeBook(Book book) {
        books.remove(book);
        book.setWarehouseManager(null);
    }

    public List<WarehouseKeeper> getSupervise() {
        return supervise;
    }

    public void addWarehouseKeeper(WarehouseKeeper keeper) {
        supervise.add(keeper);
    }

    public void removeWarehouseKeeper(WarehouseKeeper keeper) {
        supervise.remove(keeper);
    }
}
