import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
  Checkbox,
  Divider,
} from "@mui/material";
import type { CreateUserDTO } from "../../interfaces/request/CreateUserDTO";
import { useState } from "react";
import type { RegisterErrorDTO } from "../../interfaces/response/RegisterErrorDTO";

interface RegisterFormProps {
  onSubmit: (registerData: CreateUserDTO) => void;
  isPending: boolean;
}

function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
  const [registerData, setRegisterData] = useState<CreateUserDTO>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    isGrower: true,
    isWorker: false,
  });

  const [registerError, setRegisterError] = useState<RegisterErrorDTO>({
    usernameError: false,
    firstNameError: false,
    lastNameError: false,
    passwordError: false,
    passwordRepeatError: false,
    emailError: false,
    roleError: false,
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    let isValid = true;

    if (!/^[A-Za-z][A-Za-z0-9_]{2,}$/.test(registerData.username)) {
      setRegisterError((prev) => ({ ...prev, usernameError: true }));
      isValid = false;
    }

    if (!/^[A-Z][a-z]+$/.test(registerData.firstName)) {
      setRegisterError((prev) => ({ ...prev, firstNameError: true }));
      isValid = false;
    }

    if (!/^[A-Z][a-z]+$/.test(registerData.lastName)) {
      setRegisterError((prev) => ({ ...prev, lastNameError: true }));
      isValid = false;
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        registerData.email,
      )
    ) {
      setRegisterError((prev) => ({ ...prev, emailError: true }));
      isValid = false;
    }

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        registerData.password,
      )
    ) {
      setRegisterError((prev) => ({ ...prev, passwordError: true }));
      isValid = false;
    }

    if (registerData.password != registerData.password2) {
      setRegisterError((prev) => ({ ...prev, passwordRepeatError: true }));
      isValid = false;
    }

    if (!registerData.isWorker && !registerData.isGrower) {
      setRegisterError((prev) => ({ ...prev, roleError: true }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid()) {
      onSubmit(registerData);
    }
  };

  const toggleGrower = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({ ...prev, isGrower: event.target.checked }));
  };

  const toggleWorker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({
      ...prev,
      isWorker: event.target.checked,
    }));
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

              <Divider sx={{ mt: 2 }} />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1">
                  I want to use this application as
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerData.isGrower}
                        onChange={toggleGrower}
                      />
                    }
                    label="Grower"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerData.isWorker}
                        onChange={toggleWorker}
                      />
                    }
                    label="Worker"
                  />
                </FormGroup>
                {registerError.roleError && (
                  <FormHelperText>
                    One of the roles must be choosen.
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                disabled={isPending}
              >
                {isPending ? "Creating Account..." : "Create Account"}
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
