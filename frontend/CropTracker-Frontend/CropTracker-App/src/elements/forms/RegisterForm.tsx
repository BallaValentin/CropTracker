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
import {
  getEmailError,
  getPasswordError,
  getPersonNameError,
  getUsernameError,
} from "../../utils/FormSubmitHelper";

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

  const [registerError, setRegisterError] = useState<Record<string, string>>({
    usernameError: "",
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
    passwordRepeatError: "",
    emailError: "",
    roleError: "",
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    let isValid = true;

    const usernameError = getUsernameError(registerData.username) || "";
    setRegisterError((prev) => ({ ...prev, usernameError: usernameError }));
    isValid = isValid || usernameError;

    const firstNameError = getPersonNameError(registerData.firstName) || "";
    setRegisterError((prev) => ({ ...prev, firstNameError: firstNameError }));
    isValid = isValid || firstNameError;

    const lastNameError = getPersonNameError(registerData.lastName) || "";
    setRegisterError((prev) => ({ ...prev, lastNameError: lastNameError }));
    isValid = isValid || lastNameError;

    const emailError = getEmailError(registerData.email) || "";
    setRegisterError((prev) => ({ ...prev, emailError: emailError }));
    isValid = isValid || emailError;

    const passwordError = getPasswordError(registerData.password) || "";
    setRegisterError((prev) => ({ ...prev, passwordError: passwordError }));
    isValid = isValid || passwordError;

    if (registerData.password != registerData.password2) {
      setRegisterError((prev) => ({
        ...prev,
        passwordRepeatError: "Passwords must match.",
      }));
      isValid = false;
    } else {
      setRegisterError((prev) => ({
        ...prev,
        passwordRepeatError: "",
      }));
    }

    if (!registerData.isWorker && !registerData.isGrower) {
      setRegisterError((prev) => ({
        ...prev,
        roleError: "At least one role must be choosen.",
      }));
      isValid = false;
    } else {
      setRegisterError((prev) => ({
        ...prev,
        roleError: "",
      }));
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
                error={!!registerError.usernameError}
                helperText={registerError.usernameError || " "}
                name="username"
                value={registerData.username}
                placeholder={registerData.username ? "" : "ex. user"}
                onChange={handleFormChange}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                First Name
              </Typography>
              <TextField
                error={!!registerError.firstNameError}
                helperText={registerError.firstNameError || " "}
                name="firstName"
                value={registerData.firstName}
                placeholder={registerData.firstName ? "" : "ex. John"}
                onChange={handleFormChange}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                Last Name
              </Typography>
              <TextField
                error={!!registerError.lastNameError}
                helperText={registerError.lastNameError || " "}
                name="lastName"
                value={registerData.lastName}
                placeholder={registerData.lastName ? "" : "ex. Smith"}
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Email
                </Typography>
                <TextField
                  error={!!registerError.emailError}
                  helperText={registerError.emailError || " "}
                  name="email"
                  value={registerData.email}
                  placeholder={
                    registerData.email ? "" : "ex. john.smith@email.com"
                  }
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Password
                </Typography>
                <TextField
                  error={!!registerError.passwordError}
                  helperText={registerError.passwordError || " "}
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  Repeat Password
                </Typography>
                <TextField
                  error={!!registerError.passwordRepeatError}
                  helperText={registerError.passwordRepeatError || " "}
                  name="password2"
                  type="password"
                  value={registerData.password2}
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              <Divider sx={{ mt: 2 }} />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1">Sign up as</Typography>
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
                  <FormHelperText sx={{ color: "error" }}>
                    {registerError.roleError}
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
