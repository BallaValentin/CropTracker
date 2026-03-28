package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.response.RoleDTO;
import edu.bbte.allamvizsga.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO roleToRoleDTO(Role role);
}
