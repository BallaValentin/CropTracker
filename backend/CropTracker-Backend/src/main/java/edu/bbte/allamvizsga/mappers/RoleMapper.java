package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.user.RoleDTO;
import edu.bbte.allamvizsga.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO roleToRoleDTO(Role role);
}
