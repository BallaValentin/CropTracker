import { Box, Chip } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import type { GridColDef } from "@mui/x-data-grid";
import { useAdminUsers } from "../hooks/UseAdminUsers";
import UsersTable from "../elements/tables/UsersTable";

function UsersListPage() {
  const { data: user, isLoading } = useUserProfile();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email Address", width: 130 },
    {
      field: "roles",
      headerName: "Roles",
      width: 130,
    },
  ];

  const { data: adminUsers, isLoading: isLoadingUsers } = useAdminUsers();

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      <MainHeader userData={user} />
      <UsersTable
        columns={columns}
        rows={adminUsers || []}
        isLoading={isLoadingUsers}
      />
    </Box>
  );
}

export default UsersListPage;
