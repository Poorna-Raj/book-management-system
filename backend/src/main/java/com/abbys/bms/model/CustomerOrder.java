package com.abbys.bms.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_customer_orders")
public class CustomerOrder extends Order{
    private String importantNote;

    private String deadline;

    @OneToMany
    @JoinColumn(name = "order_id", nullable = false)
    private List<Book> books = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "cashier_id", nullable = false)
    private Cashier cashier;

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void addBook(Book book) {
        books.add(book);
    }

    public void removeBook(Book book) {
        books.remove(book);
    }

    public String getImportantNote() {
        return importantNote;
    }

    public void setImportantNote(String importantNote) {
        this.importantNote = importantNote;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }
}
