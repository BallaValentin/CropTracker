import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import type { RegisterData } from "../../interfaces/RegisterData";
import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (registerData: RegisterData) => void;
  isPending: boolean;
}

function RegisterForm(props: RegisterFormProps) {
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSubmit(registerData);
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
          Sign up
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
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                First Name
              </Typography>
              <TextField
                name="firstName"
                placeholder="Your first name"
                required
                onChange={handleFormChange}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Last Name
              </Typography>
              <TextField
                name="lastName"
                placeholder="Your last name"
                required
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Email
                </Typography>
                <TextField
                  name="email"
                  placeholder="Your email address"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

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

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Repeat Password
                </Typography>
                <TextField
                  name="password2"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              <Button
                type="submit"
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                disabled={props.isPending}
              >
                {props.isPending ? "Creating Account..." : "Create Account"}
              </Button>

              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="body1">
                  Already have an account? &nbsp;
                  <Link href="/signin" underline="hover">
                    Sign in
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

export default RegisterForm;
