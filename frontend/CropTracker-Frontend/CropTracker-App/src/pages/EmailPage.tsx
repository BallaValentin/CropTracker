import { Box } from "@mui/material";
import EmailForm from "../elements/forms/EmailForm";

function EmailPage() {
  const sendMail = (verificationEmail: string) => {
    console.log(verificationEmail);
  };
  return (
    <>
      <Box>
        <EmailForm onEmailSubmit={sendMail} />
      </Box>
    </>
  );
}

export default EmailPage;
