package com.abbys.bms.reposiotory;

import com.abbys.bms.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepo extends JpaRepository<CustomerOrder,Long> {
}
