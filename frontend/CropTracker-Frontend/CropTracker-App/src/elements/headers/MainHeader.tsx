import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import type { LoginResponse } from "../../interfaces/LoginResponse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/AuthService";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import AccountDialog from "../dialogs/AccountDialog";
import { updateAvatar } from "../../services/UserService";

interface MainHeaderProps {
  userData: LoginResponse;
}

function MainHeader({ userData }: MainHeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(userData.avatar);
  const open = Boolean(anchorEl);
  const accessToken = sessionStorage.getItem("accessToken");

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("accessToken");
      navigate("/signin");
    },
    onError: (err: AxiosError) => {
      console.log(err.message);
    },
  });

  const changeAvatar = useMutation({
    mutationFn: updateAvatar,
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
    setImageSrc(newImageSrc);
    changeAvatar.mutate(newImageSrc);
  };

  return (
    <Box>
      <AccountDialog
        isOpen={dialogOpen}
        handleClose={handleDialogClose}
        userData={userData}
        imageSrc={imageSrc}
        onImageChange={handleAvatarChange}
      />
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          <SpaIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            CropTracker
          </Typography>
          {accessToken && userData ? (
            <>
              <Button onClick={handleClick}>
                <Avatar src={imageSrc} alt="Avatar" />
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
                      {userData.firstName + " " + userData.lastName}
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
    </Box>
  );
}

export default MainHeader;
