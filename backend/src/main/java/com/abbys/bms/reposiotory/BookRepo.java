package com.abbys.bms.reposiotory;

import com.abbys.bms.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepo extends JpaRepository<Book,Long> {
}
