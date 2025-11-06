import { Box } from "@mui/material";
import EmailForm from "../elements/forms/EmailForm";
import type { PasswordResetMail } from "../interfaces/PasswordResetMail";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetMail } from "../services/MailService";
import { useNavigate } from "react-router-dom";

function EmailPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: sendPasswordResetMail,
    onSuccess: () => {
      navigate("/signin");
    },
  });

  const sendMail = (verificationEmail: PasswordResetMail) => {
    mutate(verificationEmail);
  };

  return (
    <>
      <Box>
        <EmailForm onEmailSubmit={sendMail} isPending={isPending} />
      </Box>
    </>
  );
}

export default EmailPage;
