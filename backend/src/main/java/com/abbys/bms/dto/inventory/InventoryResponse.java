package com.abbys.bms.dto.inventory;

import com.abbys.bms.model.enums.InventoryStatus;

public class InventoryResponse {

    private Long inventoryId;
    private String inventoryTitle;
    private int totalBooks;
    private InventoryStatus status;
    private String note;

    public InventoryResponse(Long inventoryId, String inventoryTitle,
                             int totalBooks, InventoryStatus status, String note) {
        this.inventoryId = inventoryId;
        this.inventoryTitle = inventoryTitle;
        this.totalBooks = totalBooks;
        this.status = status;
        this.note = note;
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getInventoryTitle() {
        return inventoryTitle;
    }

    public void setInventoryTitle(String inventoryTitle) {
        this.inventoryTitle = inventoryTitle;
    }

    public int getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(int totalBooks) {
        this.totalBooks = totalBooks;
    }

    public InventoryStatus getStatus() {
        return status;
    }

    public void setStatus(InventoryStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
