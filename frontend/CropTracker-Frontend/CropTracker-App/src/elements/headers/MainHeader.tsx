import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/AuthService";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import AccountDialog from "../dialogs/AccountDialog";
import { updateAvatar } from "../../services/UserService";
import { useUserProfile } from "../../hooks/UseUserProfile";
import MenuIcon from "@mui/icons-material/Menu";
import MainDrawer from "../drawers/MainDrawer";
import type { UserData } from "../../interfaces/UserData";
import { queryClient } from "../../query-client/QueryClient";

interface MainHeaderProps {
  userData: UserData | undefined;
}

function MainHeader({ userData }: MainHeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const accessToken = sessionStorage.getItem("accessToken");

  const { data: user, isLoading } = useUserProfile();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      navigate("/signin");
    },
    onError: (err: AxiosError) => {
      console.log(err.message);
    },
  });

  const changeAvatar = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err: AxiosError) => {
      console.log(err.message);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAvatarChange = (newImageSrc: string) => {
    changeAvatar.mutate(newImageSrc);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      <AccountDialog
        isOpen={dialogOpen}
        handleClose={handleDialogClose}
        userData={user}
        onImageChange={handleAvatarChange}
      />
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon fontSize="large" sx={{ mr: 1 }} />
          </IconButton>
          <SpaIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            CropTracker
          </Typography>
          {accessToken && userData ? (
            <>
              <Button onClick={handleClick}>
                <Avatar src={user?.avatar || ""} alt="Avatar" />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 180,
                    p: 2,
                  },
                }}
              >
                <Tooltip
                  title="Manage account"
                  placement="top"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <MenuItem onClick={handleDialogOpen}>
                    <ManageAccountsIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      {user?.firstName + " " + user?.lastName}
                    </Typography>
                  </MenuItem>
                </Tooltip>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  {isPending ? "Logging out..." : "Logout"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <MainDrawer
        isOpen={drawerOpen}
        handleClose={closeDrawer}
        handleClick={closeDrawer}
      />
    </Box>
  );
}

export default MainHeader;
