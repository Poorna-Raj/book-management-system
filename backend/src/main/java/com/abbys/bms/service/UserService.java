package com.abbys.bms.service;

import com.abbys.bms.dto.LoginRequest;
import com.abbys.bms.model.User;
import com.abbys.bms.reposiotory.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo _repo;

    public Optional<User> UserLogin(LoginRequest dto){
        Optional<User> user = _repo.findByEmail(dto.getEmail());
        if(user.isPresent() && Objects.equals(user.get().getPassword(), dto.getPassword())){
            return user;
        }
        return Optional.empty();
    }
}
