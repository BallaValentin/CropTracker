import { Alert, Box } from "@mui/material";
import LoginForm from "../elements/forms/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { LoginUserDTO } from "../interfaces/request/LoginUserDTO";
import { fetchUserData } from "../services/UserService";
import { queryClient } from "../query-client/QueryClient";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const { passwordUpdatedMessage, emailVerificationMessage, signUpMessage } =
      location.state || {};
    if (passwordUpdatedMessage) {
      setFeedbackMessage(passwordUpdatedMessage);
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
    if (emailVerificationMessage) {
      setFeedbackMessage(emailVerificationMessage);
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
    if (signUpMessage) {
      setFeedbackMessage(signUpMessage);
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      navigate("/");

      await queryClient.prefetchQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserData,
      });
    },
    onError: (err: AxiosError) => {
      if (err.response?.status == 400) {
        setLoginError("Invalid username or password.");
      }
      if (err.response?.status == 403) {
        setLoginError("Failed to log in. Your account has been suspended.");
      }
    },
  });

  const handlelogin = (loginData: LoginUserDTO) => {
    mutate(loginData);
  };

  return (
    <Box>
      {feedbackMessage && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          sx={{
            position: "absolute",
            top: 8,
            left: "1.25%",
            width: "95%",
            zIndex: 1200,
          }}
          severity="success"
        >
          {feedbackMessage}
        </Alert>
      )}
      <LoginForm
        onLoginSubmit={handlelogin}
        isPending={isPending}
        loginError={loginError}
      />
    </Box>
  );
}

export default LoginPage;
