import { Avatar, Box, Button, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import type { GridColDef } from "@mui/x-data-grid";
import { useAdminUsers } from "../hooks/UseAdminUsers";
import UsersTable from "../elements/tables/UsersTable";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import { useState } from "react";
import UserStatusDialog from "../elements/dialogs/UserStatusDialog";
import { useMutation } from "@tanstack/react-query";
import { updateStatus } from "../services/AdminService";
import type { UserStatusUpdate } from "../interfaces/UserStatusUpdate";

function UsersListPage() {
  const { data: user, isLoading } = useUserProfile();
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);

  const handleClose = () => {
    setStatusDialogOpen(false);
  };

  const handleClickOpen = () => {
    setStatusDialogOpen(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateStatus,
  });

  const updateUserStatus = (userStatusUpdate: UserStatusUpdate) => {
    mutate(userStatusUpdate);
  };

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
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) =>
        params.row.username !== user?.username && (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              gap: 1,
            }}
          >
            {params.row.status === "ACTIVE" ? (
              <>
                <Button onClick={handleClickOpen} color="error">
                  Suspend
                </Button>
                <UserStatusDialog
                  isPending={isPending}
                  title={"Suspend user"}
                  contentText={
                    "Are you sure you want to suspend this user's account?"
                  }
                  actionText={"Suspend"}
                  open={statusDialogOpen}
                  onClose={handleClose}
                  userStatusUpdate={{
                    status: "SUSPENDED",
                    username: params.row.username,
                  }}
                  onAccept={() =>
                    updateUserStatus({
                      status: "SUSPENDED",
                      username: params.row.username,
                    })
                  }
                />
              </>
            ) : (
              <>
                <Button onClick={handleClickOpen} color="success">
                  Add Back
                </Button>
                <UserStatusDialog
                  isPending={isPending}
                  title={"Add back user"}
                  contentText={
                    "Are you sure you want to remove suspension from this user's account?"
                  }
                  actionText={"Add Back"}
                  open={statusDialogOpen}
                  onClose={handleClose}
                  userStatusUpdate={{
                    status: "ACTIVE",
                    username: params.row.username,
                  }}
                  onAccept={() =>
                    updateUserStatus({
                      status: "ACTIVE",
                      username: params.row.username,
                    })
                  }
                />
              </>
            )}
            <Button color="primary">Edit role</Button>
          </Box>
        ),
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
