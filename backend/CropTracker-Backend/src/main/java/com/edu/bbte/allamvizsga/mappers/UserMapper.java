package com.edu.bbte.allamvizsga.mappers;

import com.edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import com.edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import com.edu.bbte.allamvizsga.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User loginDtoToModel(LoginRequestDTO loginRequestDTO);
    LoginResponseDTO modelToLoginDto(User user);
}
