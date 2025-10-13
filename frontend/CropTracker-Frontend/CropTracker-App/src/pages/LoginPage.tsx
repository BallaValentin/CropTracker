import { Box } from "@mui/material";
import LoginForm from "../elements/forms/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { LoginData } from "../interfaces/LoginData";
import type { LoginResponse } from "../interfaces/LoginResponse";

function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      navigate("/", { state: { user: data } });
    },
    onError: (err: AxiosError) => {
      console.log(err.message);
    },
  });

  const handlelogin = (loginData: LoginData) => {
    mutate(loginData);
  };

  return (
    <Box>
      <LoginForm onLoginSubmit={handlelogin} isPending={isPending} />
    </Box>
  );
}

export default LoginPage;
