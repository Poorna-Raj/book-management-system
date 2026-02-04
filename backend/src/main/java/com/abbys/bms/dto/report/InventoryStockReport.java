package com.abbys.bms.dto.report;

public class InventoryStockReport {

    private String inventoryTitle;
    private String bookName;
    private String isbn;
    private int stock;
    private double price;
    private String supplierName;
    private String warehouseKeeperName;

    public InventoryStockReport(
            String inventoryTitle,
            String bookName,
            String isbn,
            int stock,
            double price,
            String supplierName,
            String warehouseKeeperName
    ) {
        this.inventoryTitle = inventoryTitle;
        this.bookName = bookName;
        this.isbn = isbn;
        this.stock = stock;
        this.price = price;
        this.supplierName = supplierName;
        this.warehouseKeeperName = warehouseKeeperName;
    }

    public String getInventoryTitle() {
        return inventoryTitle;
    }

    public void setInventoryTitle(String inventoryTitle) {
        this.inventoryTitle = inventoryTitle;
    }

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

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getWarehouseKeeperName() {
        return warehouseKeeperName;
    }

    public void setWarehouseKeeperName(String warehouseKeeperName) {
        this.warehouseKeeperName = warehouseKeeperName;
    }
}
