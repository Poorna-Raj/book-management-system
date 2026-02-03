package com.abbys.bms.reposiotory;

import com.abbys.bms.model.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CashierRepo extends JpaRepository<Cashier,Integer> {
}
