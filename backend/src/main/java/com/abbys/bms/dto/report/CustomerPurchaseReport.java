package com.abbys.bms.dto.report;

import com.abbys.bms.model.enums.OrderStatus;

public class CustomerPurchaseReport {

    private String customerName;
    private String email;
    private Long orderId;
    private double totalPrice;
    private OrderStatus orderStatus;
    private String bookName;
    private String cashierName;

    public CustomerPurchaseReport(
            String customerName,
            String email,
            Long orderId,
            double totalPrice,
            OrderStatus orderStatus,
            String bookName,
            String cashierName
    ) {
        this.customerName = customerName;
        this.email = email;
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.bookName = bookName;
        this.cashierName = cashierName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getCashierName() {
        return cashierName;
    }

    public void setCashierName(String cashierName) {
        this.cashierName = cashierName;
    }
}
