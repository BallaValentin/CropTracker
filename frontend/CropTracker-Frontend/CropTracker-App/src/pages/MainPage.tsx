import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useLocation } from "react-router-dom";
import type { LoginResponse } from "../interfaces/LoginResponse";

function MainPage() {
  const location = useLocation();
  const userData: LoginResponse = location.state?.user || {};

  return (
    <Box>
      <MainHeader userData={userData} />
    </Box>
  );
}

export default MainPage;
