import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import type { PasswordResetMail } from "../../interfaces/request/PasswordResetMail";

interface ForgotPasswordFormProps {
  onEmailSubmit: (verificationEmail: PasswordResetMail) => void;
  isPending: boolean;
}

function ForgotPasswordForm({
  onEmailSubmit,
  isPending,
}: ForgotPasswordFormProps) {
  const [verificationEmail, setVerificationEmail] = useState<PasswordResetMail>(
    {
      email: "",
    }
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onEmailSubmit(verificationEmail);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVerificationEmail((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <ColumnCenterContainer>
        <Card
          sx={{
            p: 4,
            width: 400,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ width: 100, height: 100, bgcolor: "green" }}>
              <PersonIcon sx={{ width: 100, height: 100 }} />
            </Avatar>
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", mt: 2 }}
          >
            Forgot Password?
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography
                variant="body1"
                sx={{ textAlign: "left" }}
                gutterBottom
              >
                To verify yourself, write your email here:
              </Typography>
              <TextField
                name="email"
                placeholder="Your email address"
                required
                onChange={handleEmailChange}
                fullWidth
              />

              <Button
                disabled={isPending}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mt: 1 }}
              >
                {isPending
                  ? "Sending verification email..."
                  : "Send verification email"}
              </Button>

              <Button disabled={isPending} sx={{ mt: 1 }}>
                <Link
                  href="/signin"
                  underline="hover"
                  sx={{
                    mt: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <ArrowBackIosIcon /> Back to Login
                </Link>
              </Button>
            </FormControl>
          </form>
        </Card>
      </ColumnCenterContainer>
    </>
  );
}

export default ForgotPasswordForm;
