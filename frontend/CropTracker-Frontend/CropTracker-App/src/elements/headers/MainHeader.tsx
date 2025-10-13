import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SpaIcon from "@mui/icons-material/Spa";
import type { LoginResponse } from "../../interfaces/LoginResponse";

interface MainHeaderProps {
  userData: LoginResponse;
}

function MainHeader(mainHeaderProps: MainHeaderProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signin");
  };

  const accessToken = sessionStorage.getItem("accessToken");

  return (
    <Box>
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          <SpaIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            CropTracker
          </Typography>
          {accessToken && mainHeaderProps.userData ? (
            <Avatar src={mainHeaderProps.userData.avatar} />
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
