package com.abbys.bms.reposiotory;

import com.abbys.bms.model.CustomerManager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerManagerRepo extends JpaRepository<CustomerManager,Integer> {
}
