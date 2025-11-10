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
import type { LoginData } from "../../interfaces/LoginData";
import { useState } from "react";

interface LoginFormProps {
  onLoginSubmit: (loginData: LoginData) => void;
  isPending: boolean;
  loginError: string | null;
}

function LoginForm({ onLoginSubmit, isPending, loginError }: LoginFormProps) {
  const [loginData, setLoginData] = useState<LoginData>({
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 5,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Username
              </Typography>
              <TextField
                name="username"
                placeholder="Your username"
                required
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Password
                </Typography>
                <TextField
                  name="password"
                  type="password"
                  placeholder="Your password"
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

              <Typography variant="subtitle2">
                Forgot password?{" "}
                <Link href="/forgot-password" underline="hover">
                  Click here
                </Link>
              </Typography>

              <Button
                type="submit"
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log in"}
              </Button>

              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="body1">
                  Don`t have an account?{" "}
                  <Link href="/signup" underline="hover">
                    Signup
                  </Link>
                </Typography>
              </Box>
            </FormControl>
          </Grid>
        </form>
      </Card>
    </Box>
  );
}

export default LoginForm;
