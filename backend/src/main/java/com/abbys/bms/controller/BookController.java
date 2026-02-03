package com.abbys.bms.controller;

import com.abbys.bms.dto.book.BookCreateRequest;
import com.abbys.bms.dto.book.BookResponse;
import com.abbys.bms.dto.book.BookUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.abbys.bms.service.impl.BookService;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public ResponseEntity<?> createBook(
            @Valid @RequestBody BookCreateRequest dto,
            @RequestHeader("USER_ID") int userId
    ) {
        try {
            return ResponseEntity.ok(bookService.createBook(dto, userId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpdateRequest dto,
            @RequestHeader("USER_ID") int userId
    ) {
        try {
            return ResponseEntity.ok(bookService.updateBook(id, dto, userId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(
            @PathVariable Long id,
            @RequestHeader("USER_ID") int userId
    ) {
        try {
            bookService.deleteBook(id, userId);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookService.getBookById(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }
}
