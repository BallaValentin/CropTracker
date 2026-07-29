import { Box } from "@mui/material";
import LoginForm from "../elements/forms/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { LoginUserDTO } from "../interfaces/request/LoginUserDTO";
import { useEffect, useRef, useState } from "react";
import type { LoginResponseDTO } from "../interfaces/response/LoginResponseDTO";
import { queryClient } from "../query-client/QueryClient";
import { addSnackbar } from "../utils/SnackbarHelper";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const feedbackRef = useRef<string | null>(null);

  useEffect(() => {
    const { successMessage } = location.state || {};

    if (
      successMessage &&
      (!feedbackRef.current || feedbackRef.current !== location.key)
    ) {
      feedbackRef.current = location.key;
      addSnackbar(successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (response: LoginResponseDTO) => {
      console.log("Your access token is: ", response.accessToken);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      sessionStorage.setItem("accessToken", response.accessToken);
      navigate("/");
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
      <LoginForm
        onLoginSubmit={handlelogin}
        isPending={isPending}
        loginError={loginError}
      />
    </Box>
  );
}

export default LoginPage;
