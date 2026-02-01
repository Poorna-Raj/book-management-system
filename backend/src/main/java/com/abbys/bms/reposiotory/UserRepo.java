package com.abbys.bms.reposiotory;

import com.abbys.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Integer> {
}
