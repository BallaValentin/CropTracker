import { Alert, Box } from "@mui/material";
import RegisterForm from "../elements/forms/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { CreateUserDTO } from "../interfaces/request/CreateUserDTO";
import type { ErrorResponse } from "../interfaces/error/ErrorResponse";
import { useEffect, useState } from "react";
import type { GetVerifyEmailDTO } from "../interfaces/response/GetVerifyEmailDTO";

function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 6000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response: GetVerifyEmailDTO) => {
      navigate(`/verify-email?token=${response.token}`);
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 400) {
        const message = (err.response.data as ErrorResponse).message;
        setErrorMessage(message || "");
      }
    },
  });

  const handleRegister = (registerData: CreateUserDTO) => {
    mutate(registerData);
  };

  return (
    <Box>
      {errorMessage && <Alert color="error">{errorMessage}</Alert>}
      <RegisterForm onSubmit={handleRegister} isPending={isPending} />
    </Box>
  );
}

export default RegisterPage;
