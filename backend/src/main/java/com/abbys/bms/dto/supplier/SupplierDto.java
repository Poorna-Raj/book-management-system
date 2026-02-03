package com.abbys.bms.dto.supplier;

import com.abbys.bms.model.enums.Gender;

public class SupplierDto {
    private Long supplierId;
    private String companyName;
    private String contractorName;
    private String supplierAddress;
    private String contractorNic;
    private String contractorContact;
    private String companyEmail;
    private Gender gender;
    private int managerId;

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

    public int getManagerId() {
        return managerId;
    }

    public void setManagerId(int managerId) {
        this.managerId = managerId;
    }
}
