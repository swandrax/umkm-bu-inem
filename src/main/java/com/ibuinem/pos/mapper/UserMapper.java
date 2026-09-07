package com.ibuinem.pos.mapper;

import com.ibuinem.pos.dto.auth.UserDto;
import com.ibuinem.pos.model.User;

public class UserMapper {

    public static UserDto toDto(User u) {
        if (u == null) return null;
        return new UserDto(u);
    }
}
