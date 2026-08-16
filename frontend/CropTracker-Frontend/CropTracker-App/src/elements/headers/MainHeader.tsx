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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/AuthService";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import AccountDialog from "../dialogs/AccountDialog";
import MenuIcon from "@mui/icons-material/Menu";
import MainDrawer from "../drawers/MainDrawer";
import { queryClient } from "../../query-client/QueryClient";
import { useDrawer } from "../../contexts/DrawerProvider";
import { useCurrentProfile } from "../../hooks/caching/UseCurrentUser";
import { useRefreshToken } from "../../hooks/caching/UseRefreshToken";
import LanguageSelect from "../selects/LanguageSelect";
import { useTranslation } from "react-i18next";

interface MainHeaderProps {
  hasLogin?: boolean;
}

function MainHeader({ hasLogin = true }: MainHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const { isSuccess: isAuthVerified } = useRefreshToken();

  const { data: userData } = useCurrentProfile(isAuthVerified);

  const { toggleDrawer } = useDrawer();

  useEffect(() => {
    if (!userData) {
      return;
    }

    setAvatarURL(userData.avatarURL);
  }, [userData]);

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("accessToken");
      queryClient.clear();
      navigate("/signin");
    },
    onError: (err: AxiosError) => {
      navigate("error", {
        state: {
          statusCode: err.code,
          statusText: err.cause,
          errorMessage:
            t("elements.headers.mainHeader.signOutErrorMessage") ||
            "Error signing out. Please try again later",
        },
      });
    },
  });

  const handleLogout = () => {
    if (userData) {
      mutate();
    }
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

  return (
    <Box>
      {dialogOpen && (
        <AccountDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          userData={userData}
        />
      )}
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          {userData ? (
            <>
              <IconButton onClick={toggleDrawer}>
                <MenuIcon fontSize="large" sx={{ mr: 1 }} />
              </IconButton>
              <SpaIcon fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                CropTracker
              </Typography>
              <MainDrawer userData={userData} />
            </>
          ) : (
            <>
              <SpaIcon fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                CropTracker
              </Typography>
            </>
          )}
          {userData && hasLogin ? (
            <>
              <Button onClick={handleClick}>
                <Avatar src={avatarURL || ""} alt="Avatar" />
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
                  title={
                    t("elements.headers.mainHeader.manageAccountTooltip") ||
                    "Manage Account"
                  }
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
                      {userData?.firstName + " " + userData?.lastName}
                    </Typography>
                  </MenuItem>
                </Tooltip>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  {isPending
                    ? t("elements.headers.mainHeader.signOutPending") ||
                      "Signing out..."
                    : t("elements.headers.mainHeader.signOutButton") ||
                      "Sign Out"}
                </MenuItem>
              </Menu>
            </>
          ) : hasLogin ? (
            <Button color="inherit" onClick={handleLoginClick}>
              {t("elements.headers.mainHeader.loginButton") || "Login"}
            </Button>
          ) : (
            <LanguageSelect />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
