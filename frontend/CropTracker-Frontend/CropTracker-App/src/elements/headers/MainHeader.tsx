import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import type { LoginResponse } from "../../interfaces/LoginResponse";
import { useState } from "react";

interface MainHeaderProps {
  userData: LoginResponse;
}

function MainHeader(mainHeaderProps: MainHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const accessToken = sessionStorage.getItem("accessToken");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          <SpaIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            CropTracker
          </Typography>
          {accessToken && mainHeaderProps.userData ? (
            <>
              <Button onClick={handleClick}>
                <Avatar src={mainHeaderProps.userData.avatar} />
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
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    p: 2,
                  },
                }}
              >
                <Typography variant="subtitle1">
                  {mainHeaderProps.userData.firstName +
                    " " +
                    mainHeaderProps.userData.lastName}
                </Typography>
                <Divider />
                <MenuItem>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={handleClick}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
