import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import type { RegisterData } from "../../interfaces/RegisterData";
import { useState } from "react";
import type { RegisterError } from "../../interfaces/RegisterError";

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

  const [registerError, setRegisterError] = useState<RegisterError>({
    usernameError: false,
    firstNameError: false,
    lastNameError: false,
    passwordError: false,
    passwordRepeatError: false,
    emailError: false,
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    let hasErrors = false;

    if (!/^[A-Za-z][A-Za-z0-9_]{2,}$/.test(registerData.username)) {
      setRegisterError((prev) => ({ ...prev, usernameError: true }));
      hasErrors = true;
    }

    if (!/^[A-Z][a-z]+$/.test(registerData.firstName)) {
      setRegisterError((prev) => ({ ...prev, firstNameError: true }));
      hasErrors = true;
    }

    if (!/^[A-Z][a-z]+$/.test(registerData.lastName)) {
      setRegisterError((prev) => ({ ...prev, lastNameError: true }));
      hasErrors = true;
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        registerData.email
      )
    ) {
      setRegisterError((prev) => ({ ...prev, emailError: true }));
      hasErrors = true;
    }

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        registerData.password
      )
    ) {
      setRegisterError((prev) => ({ ...prev, passwordError: true }));
      hasErrors = true;
    }

    if (registerData.password != registerData.password2) {
      setRegisterError((prev) => ({ ...prev, passwordRepeatError: true }));
      hasErrors = true;
    }

    return hasErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid()) {
      props.onSubmit(registerData);
    }
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
                error={registerError.usernameError}
                name="username"
                placeholder="Your username"
                required
                onChange={handleFormChange}
                fullWidth
              />
              {registerError.usernameError && (
                <FormHelperText>
                  Your username must start with a letter and can only contain
                  letters and digits.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                First Name
              </Typography>
              <TextField
                error={registerError.firstNameError}
                name="firstName"
                placeholder="Your first name"
                required
                onChange={handleFormChange}
                fullWidth
              />
              {registerError.firstNameError && (
                <FormHelperText>
                  Firstname must contain only letters.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Last Name
              </Typography>
              <TextField
                error={registerError.lastNameError}
                name="lastName"
                placeholder="Your last name"
                required
                onChange={handleFormChange}
                fullWidth
              />
              {registerError.lastNameError && (
                <FormHelperText>
                  Lastname must contain only letters.
                </FormHelperText>
              )}
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Email
                </Typography>
                <TextField
                  error={registerError.emailError}
                  name="email"
                  placeholder="Your email address"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
                {registerError.emailError && (
                  <FormHelperText>
                    Must be a valid email address.
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Password
                </Typography>
                <TextField
                  error={registerError.passwordError}
                  name="password"
                  type="password"
                  placeholder="Your password"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
                {registerError.passwordError && (
                  <FormHelperText>
                    Password must contain uppercase, lowercase letters, digits
                    and special characters.
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Repeat Password
                </Typography>
                <TextField
                  error={registerError.passwordRepeatError}
                  name="password2"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  onChange={handleFormChange}
                  fullWidth
                />
                {registerError.passwordRepeatError && (
                  <FormHelperText>The two passwords must match.</FormHelperText>
                )}
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
