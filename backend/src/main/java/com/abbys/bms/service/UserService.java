package com.abbys.bms.service;

import com.abbys.bms.dto.user.LoginRequest;
import com.abbys.bms.dto.user.LoginResponse;
import com.abbys.bms.model.User;
import com.abbys.bms.reposiotory.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    public Optional<LoginResponse> userLogin(LoginRequest dto) {

        Optional<User> userOpt = repo.findByEmail(dto.getEmail());

        if (userOpt.isEmpty()) return Optional.empty();

        User user = userOpt.get();

        if (!Objects.equals(user.getPassword(), dto.getPassword())) {
            return Optional.empty();
        }

        return Optional.of(
                new LoginResponse(
                        user.getUserId(),
                        user.getEmail(),
                        user.getName(),
                        user.getRole()
                )
        );
    }
}

