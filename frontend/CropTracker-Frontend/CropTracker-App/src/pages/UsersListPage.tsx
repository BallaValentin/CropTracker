import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import type { GridColDef } from "@mui/x-data-grid";
import { useAdminUsers } from "../hooks/UseAdminUsers";
import UsersTable from "../elements/tables/UsersTable";
import {
  COLLAPSED_DRAWER_WIDTH,
  EXPANDED_DRAWER_WIDTH,
} from "../utils/constants";
import { useDrawer } from "../contexts/DrawerProvider";

function UsersListPage() {
  const { data: user, isLoading } = useUserProfile();

  const { isDrawerExpanded } = useDrawer();
  const drawerWidth = isDrawerExpanded
    ? EXPANDED_DRAWER_WIDTH
    : COLLAPSED_DRAWER_WIDTH;

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
      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100%  - ${drawerWidth}px + 1px)`,
          ml: `${drawerWidth + 1}px`,
          transition: "all 0.3s ease",
        }}
      >
        <UsersTable
          columns={columns}
          rows={adminUsers || []}
          isLoading={isLoadingUsers}
        />
      </Box>
    </Box>
  );
}

export default UsersListPage;
