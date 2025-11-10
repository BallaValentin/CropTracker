import { Box } from "@mui/material";
import ForgotPasswordForm from "../elements/forms/ForgotPasswordForm";
import type { PasswordResetMail } from "../interfaces/PasswordResetMail";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetMail } from "../services/MailService";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  console.log("Forgot Password Page");

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordResetMail,
    onSuccess: () => {
      navigate("/signin");
    },
  });

  const sendMail = (verificationForgotPassword: PasswordResetMail) => {
    mutate(verificationForgotPassword);
  };

  return (
    <>
      <Box>
        <ForgotPasswordForm onEmailSubmit={sendMail} isPending={isPending} />
      </Box>
    </>
  );
}

export default ForgotPasswordPage;
