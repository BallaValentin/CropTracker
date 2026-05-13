import { Alert, Avatar, Box, Button, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import type { GridColDef } from "@mui/x-data-grid";
import { useAdminUsers } from "../hooks/UseAdminUsers";
import UsersTable from "../elements/tables/UsersTable";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import { useEffect, useState } from "react";
import UserStatusDialog from "../elements/dialogs/UserStatusDialog";
import { useMutation } from "@tanstack/react-query";
import { updateRoles, updateStatus } from "../services/AdminService";
import type { GetAdminUserDTO } from "../interfaces/response/GetAdminUserDTO";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import UserRoleDialog from "../elements/dialogs/UserRoleDialog";

function UsersListPage() {
  const { data: user, isLoading } = useUserProfile();
  const { data: adminUsers, isLoading: isLoadingUsers } = useAdminUsers();
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [rolesDialogOpen, setRolesDialogOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<GetAdminUserDTO[]>([]);
  const [dialogUser, setDialogUser] = useState<GetAdminUserDTO | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setUsers(adminUsers ?? []);
  }, [adminUsers]);

  const { mutate: mutateStatus, isPending: isStatusPending } = useMutation({
    mutationFn: updateStatus,
    onError: () => {
      if (isActive) {
        setError("Failed to suspend the selected user.");
      } else {
        setError("Failed to add back the selected user.");
      }
      setStatusDialogOpen(false);
      setTimeout(() => setError(null), 7000);
    },
    onSuccess: () => {
      if (!isActive) {
        setSuccess("The selected user has been successfully suspended.");
      } else {
        setSuccess("The selected user has been successfully added back.");
      }
      setStatusDialogOpen(false);
      setTimeout(() => setSuccess(null), 7000);
    },
  });

  const updateUserStatus = (
    selectedUser: GetAdminUserDTO,
    userStatus: boolean,
  ) => {
    mutateStatus({ username: selectedUser.username, isActive: userStatus });

    setUsers((prev) =>
      prev?.map((user) =>
        user.username === selectedUser.username
          ? { ...user, isActive: isActive }
          : user,
      ),
    );
  };

  const { mutate: mutateRoles, isPending: isRolesPending } = useMutation({
    mutationFn: updateRoles,
    onError: () => {
      setError("Failed to update user roles");
      setRolesDialogOpen(false);
      setTimeout(() => setError(null), 7000);
    },
    onSuccess: () => {
      setSuccess("User roles have been successfully updated");
      setRolesDialogOpen(false);
      setTimeout(() => setSuccess(null), 7000);
    },
  });

  const updateUserRoles = (
    selectedUser: GetAdminUserDTO | null,
    choosenRoles: string[],
  ) => {
    console.log("Updating user roles...");
    if (selectedUser) {
      mutateRoles({ username: selectedUser.username, roles: choosenRoles });

      setUsers((prev) =>
        prev?.map((user) =>
          user.username === selectedUser.username
            ? { ...user, roles: choosenRoles }
            : user,
        ),
      );
    } else {
      setError("Selected user is missing");
    }
  };

  const suspendUser = (selectedUser: GetAdminUserDTO) => {
    updateUserStatus(selectedUser, false);
  };

  const addBackUser = (selectedUser: GetAdminUserDTO) => {
    updateUserStatus(selectedUser, true);
  };

  const openStatusDialog = (
    selectedUser: GetAdminUserDTO,
    newStatus: boolean,
  ) => {
    setStatusDialogOpen(true);
    setDialogUser(selectedUser);
    setIsActive(newStatus);
  };

  const openRolesDialog = (selectedUser: GetAdminUserDTO) => {
    setRolesDialogOpen(true);
    setDialogUser(selectedUser);
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
            {
              <>
                <Button
                  onClick={() =>
                    openStatusDialog(params.row, !params.row.isActive)
                  }
                  color={params.row.isActive ? "error" : "success"}
                >
                  {params.row.isActive ? "Suspend" : "Add Back"}
                </Button>
              </>
            }
            <Button onClick={() => openRolesDialog(params.row)} color="primary">
              Edit role
            </Button>
          </Box>
        ),
    },
  ];

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading users..." />;
  }

  return (
    <Box>
      <MainHeader userData={user} />
      <MainContainer hasDrawer={Boolean(user?.username)}>
        <Box sx={{ position: "relative" }}>
          {error && (
            <Alert
              icon={<ErrorOutlineIcon />}
              sx={{
                position: "absolute",
                top: 8,
                left: "1.25%",
                width: "95%",
                zIndex: 1200,
              }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              icon={<CheckIcon />}
              sx={{
                position: "absolute",
                top: 8,
                left: "1.25%",
                width: "95%",
                zIndex: 1200,
              }}
              severity="success"
            >
              {success}
            </Alert>
          )}
          <ColumnCenterContainer>
            <UsersTable
              columns={columns}
              rows={users || []}
              isLoading={isLoadingUsers}
            />
            <UserStatusDialog
              isPending={isStatusPending}
              title={isActive ? "Add back user" : "Suspend user"}
              contentText={
                isActive
                  ? "Are you sure you want to add back this user?"
                  : "Are you sure you want to suspend this user's account?"
              }
              actionText={isActive ? "Add Back" : "Suspend"}
              open={statusDialogOpen}
              onClose={() => setStatusDialogOpen(false)}
              user={dialogUser}
              onAccept={isActive ? addBackUser : suspendUser}
            />
            <UserRoleDialog
              user={dialogUser}
              open={rolesDialogOpen}
              isPending={isRolesPending}
              onClose={() => setRolesDialogOpen(false)}
              onAccept={(user, choosenRoles) =>
                updateUserRoles(user, choosenRoles)
              }
            />
          </ColumnCenterContainer>
        </Box>
      </MainContainer>
    </Box>
  );
}

export default UsersListPage;
