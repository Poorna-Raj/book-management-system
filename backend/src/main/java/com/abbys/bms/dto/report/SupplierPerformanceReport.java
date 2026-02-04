package com.abbys.bms.dto.report;

public class SupplierPerformanceReport {

    private String companyName;
    private String managerName;
    private long totalBooks;
    private long totalStock;
    private double averagePrice;

    public SupplierPerformanceReport(
            String companyName,
            String managerName,
            long totalBooks,
            long totalStock,
            double averagePrice
    ) {
        this.companyName = companyName;
        this.managerName = managerName;
        this.totalBooks = totalBooks;
        this.totalStock = totalStock;
        this.averagePrice = averagePrice;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(long totalStock) {
        this.totalStock = totalStock;
    }

    public double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }
}

