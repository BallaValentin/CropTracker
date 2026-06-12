package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.user.AdminUserDTO;
import edu.bbte.allamvizsga.dto.request.user.LoginRequestDTO;
import edu.bbte.allamvizsga.dto.request.user.RegisterRequestDTO;
import edu.bbte.allamvizsga.dto.response.user.LoginResponseDTO;
import edu.bbte.allamvizsga.dto.response.user.UserDataDTO;
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
