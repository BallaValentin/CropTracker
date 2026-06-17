package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.user.*;
import edu.bbte.allamvizsga.dto.request.user.LoginRequestDTO;
import edu.bbte.allamvizsga.dto.request.user.RegisterRequestDTO;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.VerifyEmailToken;
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
    GetVerifyEmailTokenDTO modelToGetVerifyEmail(VerifyEmailToken verifyEmailToken);
    GetResendCodeDTO modelToGetResendCode(VerifyEmailToken verifyEmailToken);
}
