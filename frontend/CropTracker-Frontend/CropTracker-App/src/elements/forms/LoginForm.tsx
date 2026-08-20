import {
  Card,
  Typography,
  Grid,
  FormControl,
  TextField,
  Box,
  Button,
  Link,
} from "@mui/material";
import type { LoginUserDTO } from "../../interfaces/request/LoginUserDTO";
import { useState } from "react";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onLoginSubmit: (loginData: LoginUserDTO) => void;
  isPending: boolean;
  loginError: string | null;
}

function LoginForm({ onLoginSubmit, isPending, loginError }: LoginFormProps) {
  const { t } = useTranslation();

  const [loginData, setLoginData] = useState<LoginUserDTO>({
    username: "",
    password: "",
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLoginSubmit(loginData);
  };

  return (
    <ColumnCenterContainer>
      <Card
        sx={{
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          {t("elements.forms.loginForm.formTitle") || "Login"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography
                sx={{ textAlign: "left" }}
                variant="body1"
                gutterBottom
              >
                {t("elements.forms.loginForm.usernameLabel") || "Username"}
              </Typography>
              <TextField
                name="username"
                required
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography
                  sx={{ textAlign: "left" }}
                  variant="body1"
                  gutterBottom
                >
                  {t("elements.forms.loginForm.passwordLabel") || "Password"}
                </Typography>
                <TextField
                  name="password"
                  type="password"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              {loginError != null && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="error">
                    {loginError}
                  </Typography>
                </Box>
              )}

              <Typography sx={{ textAlign: "left" }} variant="subtitle2">
                {t("elements.forms.loginForm.forgotPassword") ||
                  "Forgot password?"}
                <Link href="/forgot-password" underline="hover">
                  {t("elements.forms.loginForm.forgotPasswordLink") ||
                    "Click here"}
                </Link>
              </Typography>

              <Button
                type="submit"
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                disabled={isPending}
              >
                {isPending
                  ? t("elements.forms.loginForm.loginButtonPending") ||
                    "Logging in..."
                  : t("elements.forms.loginForm.loginButton") || "Login"}
              </Button>

              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="body1">
                  {t("elements.forms.loginForm.dontHaveAccount") ||
                    "Don't have an account?"}
                  <Link href="/signup" underline="hover">
                    {t("elements.forms.loginForm.registerLink") || "Register"}
                  </Link>
                </Typography>
              </Box>
            </FormControl>
          </Grid>
        </form>
      </Card>
    </ColumnCenterContainer>
  );
}

export default LoginForm;
