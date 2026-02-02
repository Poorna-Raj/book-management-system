package com.abbys.bms.model;

import com.abbys.bms.model.enums.Gender;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    @Column(unique = true)
    private String companyName;

    private String contractorName;

    private String supplierAddress;

    @Column(unique = true)
    private String contractorNic;

    private String contractorContact;

    @Column(unique = true)
    private String companyEmail;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private SupplierManager manager;

    @OneToMany(mappedBy = "supplier")
    private List<Book> books = new ArrayList<>();

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public void addBook(Book book) {
        books.add(book);
        book.setSupplier(this);
    }

    public void removeBook(Book book) {
        books.remove(book);
        book.setSupplier(null);
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getContractorName() {
        return contractorName;
    }

    public void setContractorName(String contractorName) {
        this.contractorName = contractorName;
    }

    public String getSupplierAddress() {
        return supplierAddress;
    }

    public void setSupplierAddress(String supplierAddress) {
        this.supplierAddress = supplierAddress;
    }

    public String getContractorNic() {
        return contractorNic;
    }

    public void setContractorNic(String contractorNic) {
        this.contractorNic = contractorNic;
    }

    public String getContractorContact() {
        return contractorContact;
    }

    public void setContractorContact(String contractorContact) {
        this.contractorContact = contractorContact;
    }

    public String getCompanyEmail() {
        return companyEmail;
    }

    public void setCompanyEmail(String companyEmail) {
        this.companyEmail = companyEmail;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public SupplierManager getManager() {
        return manager;
    }

    public void setManager(SupplierManager manager) {
        this.manager = manager;
    }
}
