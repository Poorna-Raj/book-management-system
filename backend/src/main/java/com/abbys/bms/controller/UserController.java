package com.abbys.bms.controller;

import com.abbys.bms.dto.LoginRequest;
import com.abbys.bms.model.User;
import com.abbys.bms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService _service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        Optional<User> user = _service.UserLogin(req);
        if(user.isPresent()){
            return ResponseEntity.ok(user.get()); // return the user object
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}
