package com.abbys.bms.service;

import com.abbys.bms.dto.*;
import com.abbys.bms.dto.customerOrder.CustomerOrderRequest;
import com.abbys.bms.dto.customerOrder.CustomerOrderResponse;
import com.abbys.bms.model.*;
import com.abbys.bms.reposiotory.BookRepo;
import com.abbys.bms.reposiotory.CashierRepo;
import com.abbys.bms.reposiotory.CustomerOrderRepo;
import com.abbys.bms.reposiotory.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerOrderService {
    @Autowired
    private CustomerOrderRepo orderRepository;
    @Autowired
    private BookRepo bookRepository;
    @Autowired
    private CustomerRepo customerRepository;
    @Autowired
    private CashierRepo cashierRepository;

    public CustomerOrderResponse createOrder(CustomerOrderRequest dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Cashier cashier = cashierRepository.findById(dto.getCashierId())
                .orElseThrow(() -> new IllegalArgumentException("Cashier not found"));

        CustomerOrder order = new CustomerOrder();
        order.setImportantNote(dto.getImportantNote());
        order.setDeadline(dto.getDeadline());
        order.setCustomer(customer);
        order.setCashier(cashier);

        List<Book> books = new ArrayList<>();

        for (Long bookId : dto.getBookIds()) {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new IllegalArgumentException("Book not found"));

            if (book.getStock() <= 0) {
                throw new IllegalArgumentException(
                        "Book out of stock: " + book.getBookName()
                );
            }

            book.setStock(book.getStock() - 1);
            bookRepository.save(book);

            books.add(book);
        }

        order.setBooks(books);
        CustomerOrder savedOrder = orderRepository.save(order);

        return mapToDTO(savedOrder);
    }

    public CustomerOrderResponse getOrderById(Long id) {
        return mapToDTO(
                orderRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Order not found"))
        );
    }

    public List<CustomerOrderResponse> getAllOrders() {
        List<CustomerOrderResponse> list = new ArrayList<>();
        for (CustomerOrder order : orderRepository.findAll()) {
            list.add(mapToDTO(order));
        }
        return list;
    }

    public void deleteOrder(Long id) {

        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // restore stock
        for (Book book : order.getBooks()) {
            book.setStock(book.getStock() + 1);
            bookRepository.save(book);
        }

        orderRepository.delete(order);
    }

    private CustomerOrderResponse mapToDTO(CustomerOrder order) {

        CustomerOrderResponse dto = new CustomerOrderResponse();
        dto.setOrderId(order.getOrderId());
        dto.setImportantNote(order.getImportantNote());
        dto.setDeadline(order.getDeadline());
        dto.setCustomerName(order.getCustomer().getCustomerName());
        dto.setCashierName(order.getCashier().getName());

        List<String> bookNames = new ArrayList<>();
        for (Book book : order.getBooks()) {
            bookNames.add(book.getBookName());
        }

        dto.setBookNames(bookNames);
        return dto;
    }
}
