package com.abbys.bms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_customer_managers")
public class CustomerManager extends User{
    @Column(unique = true)
    private Long customerManagerId;

    private String workingHours;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    private boolean onDuty;

    public Long getCustomerManagerId() {
        return customerManagerId;
    }

    public void setCustomerManagerId(Long customerManagerId) {
        this.customerManagerId = customerManagerId;
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
