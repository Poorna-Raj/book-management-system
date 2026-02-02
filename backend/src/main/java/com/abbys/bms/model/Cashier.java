package com.abbys.bms.model;

import com.abbys.bms.model.enums.Shift;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_cashier")
public class Cashier extends User{
    @Column(unique = true,nullable = false)
    private String cashierId;

    private String workingHours;

    private boolean onDuty;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    @OneToMany(mappedBy = "cashier")
    private List<CustomerOrder> orders = new ArrayList<>();

    public String getCashierId() {
        return cashierId;
    }

    public void setCashierId(String cashierId) {
        this.cashierId = cashierId;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    public boolean isOnDuty() {
        return onDuty;
    }

    public void setOnDuty(boolean onDuty) {
        this.onDuty = onDuty;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public List<CustomerOrder> getOrders() {
        return orders;
    }

    public void setOrders(List<CustomerOrder> orders) {
        this.orders = orders;
    }
}
