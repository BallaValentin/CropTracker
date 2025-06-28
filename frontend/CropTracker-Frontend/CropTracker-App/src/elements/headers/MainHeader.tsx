import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SpaIcon from "@mui/icons-material/Spa";

function MainHeader() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signin");
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Toolbar>
          <SpaIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            CropTracker
          </Typography>
          <Button color="inherit" onClick={handleClick}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
