package com.abbys.bms.service;

import com.abbys.bms.dto.book.BookCreateRequest;
import com.abbys.bms.dto.book.BookResponse;
import com.abbys.bms.dto.book.BookUpdateRequest;
import com.abbys.bms.model.*;
import com.abbys.bms.model.enums.Role;
import com.abbys.bms.reposiotory.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepo bookRepository;
    @Autowired
    private WarehouseManagerRepo warehouseManagerRepo;
    @Autowired
    private InventoryRepo inventoryRepository;
    @Autowired
    private SupplierRepo supplierRepo;

    public BookResponse createBook(BookCreateRequest dto, int userId) {

        WarehouseManager manager = warehouseManagerRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse manager not found"));

        if (manager.getRole() != Role.WAREHOUSE_MANAGER) {
            throw new IllegalArgumentException("Access denied: Not a warehouse manager");
        }

        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found"));

        Book book = new Book();
        book.setBookName(dto.getBookName());
        book.setIssue(dto.getIssue());
        book.setPages(dto.getPages());
        book.setVolume(dto.getVolume());
        book.setStatus(dto.getStatus());
        book.setType(dto.getType());
        book.setIsbn(dto.getIsbn());
        book.setStock(dto.getStock());
        book.setPrice(dto.getPrice());
        book.setInventory(inventory);
        book.setWarehouseManager(manager);

        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
            book.setSupplier(supplier);
        }

        return mapToDTO(bookRepository.save(book));
    }

    public BookResponse updateBook(Long bookId, BookUpdateRequest dto, int userId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (book.getWarehouseManager().getUserId() != userId) {
            throw new IllegalArgumentException("Only creator can update this book");
        }

        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found"));

        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepo.findById(dto.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
        }

        book.setBookName(dto.getBookName());
        book.setIsbn(dto.getIsbn());
        book.setType(dto.getType());
        book.setStatus(dto.getStatus());
        book.setIssue(dto.getIssue());
        book.setVolume(dto.getVolume());
        book.setPages(dto.getPages());
        book.setStock(dto.getStock());
        book.setPrice(dto.getPrice());
        book.setInventory(inventory);
        book.setSupplier(supplier);

        return mapToDTO(bookRepository.save(book));
    }


    public void deleteBook(Long bookId, int userId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (book.getWarehouseManager().getUserId() != userId) {
            throw new IllegalArgumentException("Only creator can delete this book");
        }

        bookRepository.delete(book);
    }

    public BookResponse getBookById(Long bookId) {
        return mapToDTO(
                bookRepository.findById(bookId)
                        .orElseThrow(() -> new IllegalArgumentException("Book not found"))
        );
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BookResponse mapToDTO(Book book) {

        BookResponse dto = new BookResponse();

        dto.setBookId(book.getBookId());
        dto.setBookName(book.getBookName());
        dto.setIssue(book.getIssue());
        dto.setPages(book.getPages());
        dto.setVolume(book.getVolume());
        dto.setIsbn(book.getIsbn());
        dto.setStock(book.getStock());
        dto.setPrice(book.getPrice());
        dto.setStatus(book.getStatus());
        dto.setType(book.getType());

        // relations flattened
        dto.setInventoryId(book.getInventory().getInventoryId());

        if (book.getSupplier() != null) {
            dto.setSupplierId(book.getSupplier().getSupplierId());
        }

        dto.setCreatedById(book.getWarehouseManager().getUserId());
        dto.setCreatedBy(book.getWarehouseManager().getName());

        return dto;
    }

}
