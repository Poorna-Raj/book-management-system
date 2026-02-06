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

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private WarehouseManager manager;

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

    public WarehouseManager getManager() {
        return manager;
    }

    public void setManager(WarehouseManager manager) {
        this.manager = manager;
    }
}
