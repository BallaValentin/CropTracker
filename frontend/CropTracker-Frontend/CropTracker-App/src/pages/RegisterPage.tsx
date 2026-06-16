import { Alert, Box } from "@mui/material";
import RegisterForm from "../elements/forms/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { CreateUserDTO } from "../interfaces/request/CreateUserDTO";
import type { ErrorResponse } from "../interfaces/ErrorResponse";
import { useEffect, useState } from "react";

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
    onSuccess: () => {
      navigate("/signin", {
        state: {
          signUpMessage: "Your account has been successfully created.",
        },
      });
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
