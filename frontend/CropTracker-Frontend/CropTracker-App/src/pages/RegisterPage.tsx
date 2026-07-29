import { Box } from "@mui/material";
import RegisterForm from "../elements/forms/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { CreateUserDTO } from "../interfaces/request/CreateUserDTO";
import type { ErrorResponse } from "../interfaces/error/ErrorResponse";
import type { GetVerifyEmailDTO } from "../interfaces/response/GetVerifyEmailDTO";
import { addSnackbar } from "../utils/SnackbarHelper";

function RegisterPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: GetVerifyEmailDTO) => {
      navigate(`/verify-email?token=${response.token}`);
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 400) {
        const message = (err.response.data as ErrorResponse).message;
        if (message) {
          addSnackbar(message);
        }
      }
    },
  });

  const handleRegister = (registerData: CreateUserDTO) => {
    mutate(registerData);
  };

  return (
    <Box>
      <RegisterForm onSubmit={handleRegister} isPending={isPending} />
    </Box>
  );
}

export default RegisterPage;
