import { Avatar, Box, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import type { GridColDef } from "@mui/x-data-grid";
import { useAdminUsers } from "../hooks/UseAdminUsers";
import UsersTable from "../elements/tables/UsersTable";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";

function UsersListPage() {
  const { data: user, isLoading } = useUserProfile();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "User",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", height: "100%", alignItems: "center", gap: 1 }}
        >
          <Avatar src={params.row.avatarSrc} />
          <Typography variant="body2" sx={{ textDecoration: "bold" }}>
            {params.row.username}
          </Typography>
        </Box>
      ),
    },
    {
      field: "fullname",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Typography variant="body2">
            {params.row.firstName} {params.row.lastName}
          </Typography>
        </Box>
      ),
    },
    { field: "email", headerName: "Email Address", width: 200 },
    {
      field: "roles",
      headerName: "Roles",
      width: 200,
    },
  ];

  const { data: adminUsers, isLoading: isLoadingUsers } = useAdminUsers();

  if (isLoading) {
    return <ProgressCircle />;
  }

  return (
    <Box>
      <MainHeader userData={user} authenticated={true} />
      <MainContainer hasDrawer={true}>
        <UsersTable
          columns={columns}
          rows={adminUsers || []}
          isLoading={isLoadingUsers}
        />
      </MainContainer>
    </Box>
  );
}

export default UsersListPage;
