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

    private int age;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    private String note;

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

    public String getNote() {
        return note;
    }

    public void setWorkingHours(String note) {
        this.note = note;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
