package com.abbys.bms.model;

import com.abbys.bms.model.enums.Shift;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_supplier_manager")
public class SupplierManager extends User{
    @Column(unique = true)
    private String supplierManagerId;

    private String workingHours;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    private boolean onDuty;

    @OneToMany(mappedBy = "manager")
    private List<Supplier> suppliers = new ArrayList<>();

    public List<Supplier> getSuppliers() {
        return suppliers;
    }

    public void setSuppliers(List<Supplier> suppliers) {
        this.suppliers = suppliers;
    }

    public void addSupplier(Supplier supplier) {
        suppliers.add(supplier);
        supplier.setManager(this); // maintain both sides
    }

    public void removeSupplier(Supplier supplier) {
        suppliers.remove(supplier);
        supplier.setManager(null);
    }


    public String getSupplierManagerId() {
        return supplierManagerId;
    }

    public void setSupplierManagerId(String supplierManagerId) {
        this.supplierManagerId = supplierManagerId;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public boolean isOnDuty() {
        return onDuty;
    }

    public void setOnDuty(boolean onDuty) {
        this.onDuty = onDuty;
    }
}
