import { Box } from "@mui/material";
import ForgotPasswordForm from "../elements/forms/ForgotPasswordForm";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetMail } from "../services/MailService";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { PasswordVerificationEmailDTO } from "../interfaces/request/PasswordVerificationEmailDTO";
import { enqueueSnackbar } from "notistack";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordResetMail,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          emailVerificationMessage:
            "A verification email has been sent to your address",
          key: `${Date.now()}`,
        },
      });
    },
    onError: (err: AxiosError) => {
      if (err.status === 404) {
        enqueueSnackbar(
          "Couldn`t find user. Make sure you added the correct email",
        );
      } else {
        enqueueSnackbar("An unexpected error has occured");
      }
    },
  });

  const sendMail = (
    verificationForgotPassword: PasswordVerificationEmailDTO,
  ) => {
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
