import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { statusCode, statusText, errorMessage } = location.state || {};

  const handleNavClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h1">{statusCode}</Typography>
        <Typography variant="h3">{statusText}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
        <Button
          sx={{ bgcolor: "green", color: "white", mt: 5 }}
          onClick={handleNavClick}
        >
          Back to Login
        </Button>
      </Box>
    </>
  );
}

export default ErrorPage;
