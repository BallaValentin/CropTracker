package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.AdminUserDTO;
import edu.bbte.allamvizsga.dto.request.LoginRequestDTO;
import edu.bbte.allamvizsga.dto.request.RegisterRequestDTO;
import edu.bbte.allamvizsga.dto.response.LoginResponseDTO;
import edu.bbte.allamvizsga.dto.response.UserDataDTO;
import edu.bbte.allamvizsga.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User loginDtoToModel(LoginRequestDTO loginRequestDTO);
    User registerDtoToModel(RegisterRequestDTO registerRequestDTO);
    @Mapping(target = "roles", ignore = true)
    AdminUserDTO modelToAdminResponse(User user);
    LoginResponseDTO modelToLoginDto(User user);
    UserDataDTO modelToUserData(User user);
}
