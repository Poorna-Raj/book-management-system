package com.abbys.bms.reposiotory;

import com.abbys.bms.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepo extends JpaRepository<Supplier,Long> {
}
