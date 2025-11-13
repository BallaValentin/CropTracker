import { Alert, Box } from "@mui/material";
import ForgotPasswordForm from "../elements/forms/ForgotPasswordForm";
import type { PasswordResetMail } from "../interfaces/PasswordResetMail";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetMail } from "../services/MailService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AxiosError } from "axios";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordResetMail,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          emailVerificationMessage:
            "A verification email has been sent to your address",
        },
      });
    },
    onError: (err: AxiosError) => {
      if (err.status === 404) {
        setError("Couldn`t find user. Make sure you added the correct email");
      } else {
        setError("An unexpected error has occured");
      }
      setTimeout(() => setError(null), 7000);
    },
  });

  const sendMail = (verificationForgotPassword: PasswordResetMail) => {
    mutate(verificationForgotPassword);
  };

  return (
    <>
      <Box>
        {error && (
          <Alert
            icon={<ErrorOutlineIcon />}
            sx={{
              position: "absolute",
              top: 8,
              left: "1.25%",
              width: "95%",
              zIndex: 1200,
            }}
            severity="error"
          >
            {error}
          </Alert>
        )}
        <ForgotPasswordForm onEmailSubmit={sendMail} isPending={isPending} />
      </Box>
    </>
  );
}

export default ForgotPasswordPage;
