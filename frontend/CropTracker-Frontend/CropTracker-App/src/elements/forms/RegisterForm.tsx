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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
        passwordRepeatError:
          t("elements.forms.registerForm.passwordRepeatError") ||
          "Passwords do not match.",
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
        roleError:
          t("elements.forms.registerForm.roleError") || "Please select a role.",
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
        mt: 25,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          {t("elements.forms.registerForm.formTitle") || "Register"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                {t("elements.forms.registerForm.usernameLabel") || "Username"}
              </Typography>
              <TextField
                error={!!registerError.usernameError}
                helperText={registerError.usernameError || " "}
                name="username"
                value={registerData.username}
                placeholder={
                  registerData.username
                    ? ""
                    : t("elements.forms.registerForm.usernamePlaceholder") ||
                      "ex. john_smith"
                }
                onChange={handleFormChange}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                {t("elements.forms.registerForm.firstNameLabel") ||
                  "First Name"}
              </Typography>
              <TextField
                error={!!registerError.firstNameError}
                helperText={registerError.firstNameError || " "}
                name="firstName"
                value={registerData.firstName}
                placeholder={
                  registerData.firstName
                    ? ""
                    : t("elements.forms.registerForm.firstNamePlaceholder") ||
                      "ex. John"
                }
                onChange={handleFormChange}
                fullWidth
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography variant="body1" gutterBottom>
                {t("elements.forms.registerForm.lastNameLabel") || "Last Name"}
              </Typography>
              <TextField
                error={!!registerError.lastNameError}
                helperText={registerError.lastNameError || " "}
                name="lastName"
                value={registerData.lastName}
                placeholder={
                  registerData.lastName
                    ? ""
                    : t("elements.forms.registerForm.lastNamePlaceholder") ||
                      "ex. Smith"
                }
                onChange={handleFormChange}
                fullWidth
              />
              <FormControl />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  {t("elements.forms.registerForm.emailLabel") || "Email"}
                </Typography>
                <TextField
                  error={!!registerError.emailError}
                  helperText={registerError.emailError || " "}
                  name="email"
                  value={registerData.email}
                  placeholder={
                    registerData.email
                      ? ""
                      : t("elements.forms.registerForm.emailPlaceholder") ||
                        "ex. john.smith@example.com"
                  }
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <Typography variant="body1" gutterBottom>
                  {t("elements.forms.registerForm.passwordLabel") || "Password"}
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
                  {t("elements.forms.registerForm.repeatPasswordLabel") ||
                    "Repeat Password"}
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
                <Typography variant="body1">
                  {t("elements.forms.registerForm.roleSelectLabel") ||
                    "Select Role"}
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerData.isGrower}
                        onChange={toggleGrower}
                      />
                    }
                    label={
                      t("elements.forms.registerForm.growerRole") || "Grower"
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerData.isWorker}
                        onChange={toggleWorker}
                      />
                    }
                    label={
                      t("elements.forms.registerForm.workerRole") || "Worker"
                    }
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
                {isPending
                  ? t("elements.forms.registerForm.registerButtonPending") ||
                    "Registering..."
                  : t("elements.forms.registerForm.registerButton") ||
                    "Register"}
              </Button>

              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="body1">
                  {t("elements.forms.registerForm.alreadyHaveAccount") ||
                    "Already have an account?"}
                  <Link href="/signin" underline="hover">
                    {t("elements.forms.registerForm.loginLink") || "Login"}
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
