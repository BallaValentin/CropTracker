import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "../elements/progress/ProgressCircle";
import type { AuthErrorResponse } from "../interfaces/AuthErrorResponse";

function MainPage() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUserProfile();

  useEffect(() => {
    if (error) {
      navigate("/error", {
        state: {
          statusCode: error.response?.data
            ? (error.response.data as AuthErrorResponse).status
            : 500,
          statusText: error.response?.data
            ? (error.response.data as AuthErrorResponse).error
            : "Internal Server Error",
          errorMessage:
            "Failed to fetch user data. Make sure you are logged in, and try again later.",
        },
      });
    }
  }, [error, navigate]);

  if (isLoading) {
    return <ProgressCircle />;
  }

  return (
    <Box>
      <MainHeader userData={user} />
    </Box>
  );
}

export default MainPage;
