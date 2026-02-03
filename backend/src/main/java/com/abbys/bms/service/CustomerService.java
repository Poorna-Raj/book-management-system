package com.abbys.bms.service;

import com.abbys.bms.dto.customer.CustomerCreateRequest;
import com.abbys.bms.dto.customer.CustomerDto;
import com.abbys.bms.model.Customer;
import com.abbys.bms.model.CustomerManager;
import com.abbys.bms.model.enums.Gender;
import com.abbys.bms.model.enums.Role;
import com.abbys.bms.reposiotory.CustomerManagerRepo;
import com.abbys.bms.reposiotory.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private CustomerManagerRepo managerRepo;

    public CustomerDto createCustomer(CustomerCreateRequest dto) {
        CustomerManager manager = getValidManager(dto.getManagerId());

        Customer customer = new Customer();
        mapDtoToCustomer(dto, customer);
        customer.setManager(manager);

        customerRepo.save(customer);

        manager.addCustomer(customer);
        managerRepo.save(manager);

        return mapToDto(customer);
    }

    public CustomerDto updateCustomer(Long customerId, CustomerCreateRequest dto) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerManager manager = getValidManager(dto.getManagerId());

        mapDtoToCustomer(dto, customer);
        customer.setManager(manager);

        customerRepo.save(customer);

        manager.addCustomer(customer);
        managerRepo.save(manager);

        return mapToDto(customer);
    }

    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerManager manager = customer.getManager();
        if (manager != null) {
            manager.getCustomers().remove(customer);
            managerRepo.save(manager);
        }

        customerRepo.delete(customer);
    }

    public CustomerDto getCustomerById(Long customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        return mapToDto(customer);
    }

    public List<CustomerDto> getAllCustomers() {
        return customerRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CustomerManager getValidManager(int managerId) {
        Optional<CustomerManager> managerOpt = managerRepo.findById(managerId);
        if (managerOpt.isEmpty() || managerOpt.get().getRole() != Role.CUSTOMER_MANAGER) {
            throw new IllegalArgumentException("Invalid managerId");
        }
        return managerOpt.get();
    }

    private void mapDtoToCustomer(CustomerCreateRequest dto, Customer customer) {
        customer.setCustomerName(dto.getCustomerName());
        customer.setAge(dto.getAge());
        customer.setAddress(dto.getAddress());
        customer.setNic(dto.getNic());
        customer.setContactNumber(dto.getContactNumber());
        customer.setEmail(dto.getEmail());
        customer.setGender(Gender.valueOf(dto.getGender().toUpperCase()));
    }

    private CustomerDto mapToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setCustomerId(customer.getCustomerId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setAge(customer.getAge());
        dto.setAddress(customer.getAddress());
        dto.setNic(customer.getNic());
        dto.setContactNumber(customer.getContactNumber());
        dto.setEmail(customer.getEmail());
        dto.setGender(customer.getGender());
        if (customer.getManager() != null) {
            dto.setManagerId(customer.getManager().getUserId());
        }
        return dto;
    }
}

