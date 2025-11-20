import { Box } from "@mui/material";
import RegisterForm from "../elements/forms/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { RegisterData } from "../interfaces/request/RegisterData";

function RegisterPage() {
  const navigate = useNavigate();
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
      console.log(err.message);
    },
  });

  const handleRegister = (registerData: RegisterData) => {
    mutate(registerData);
  };

  return (
    <Box>
      <RegisterForm onSubmit={handleRegister} isPending={isPending} />
    </Box>
  );
}

export default RegisterPage;
