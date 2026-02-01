package com.abbys.bms.reposiotory;

import com.abbys.bms.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer,Long> {
}
