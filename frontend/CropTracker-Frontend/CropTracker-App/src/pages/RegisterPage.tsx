import { Box } from "@mui/material";
import RegisterForm from "../elements/forms/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { RegisterData } from "../interfaces/RegisterData";

function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/signin");
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
