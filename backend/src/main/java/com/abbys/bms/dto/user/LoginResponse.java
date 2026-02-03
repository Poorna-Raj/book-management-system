package com.abbys.bms.dto.user;

import com.abbys.bms.model.enums.Role;

public class LoginResponse {

    private int userId;
    private String email;
    private String name;
    private Role role;

    public LoginResponse(int userId, String email, String name, Role role) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}