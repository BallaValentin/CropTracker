import { Box } from "@mui/material";
import LoginForm from "../elements/forms/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { LoginData } from "../interfaces/LoginData";
import { fetchUserData } from "../services/UserService";
import { queryClient } from "../query-client/QueryClient";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

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
        setLoginError("Invalid username or password");
      }
    },
  });

  const handlelogin = (loginData: LoginData) => {
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
