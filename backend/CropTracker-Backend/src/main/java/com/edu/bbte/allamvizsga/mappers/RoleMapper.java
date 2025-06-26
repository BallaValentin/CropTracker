package com.edu.bbte.allamvizsga.mappers;

import com.edu.bbte.allamvizsga.dto.response.RoleDTO;
import com.edu.bbte.allamvizsga.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO roleToRoleDTO(Role role);
}
