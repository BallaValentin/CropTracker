import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import type { ChangePasswordData } from "../../interfaces/ChangePasswordData";
import PersonIcon from "@mui/icons-material/Person";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useLocation } from "react-router-dom";

interface ChangePasswordFormProps {
  handleSubmit: (newPasswordData: ChangePasswordData) => void;
  isPending: boolean;
}

function ChangePasswordForm({
  handleSubmit,
  isPending,
}: ChangePasswordFormProps) {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [changePasswordData, setChangePasswordData] =
    useState<ChangePasswordData>({
      password1: "",
      password2: "",
      token: token ?? "",
    });

  const [error, setError] = useState({
    password1Error: false,
    password2Error: false,
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangePasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewPassword = (event: React.FormEvent) => {
    event.preventDefault();

    setError({
      password1Error: false,
      password2Error: false,
    });

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        changePasswordData.password1
      )
    ) {
      setError((prev) => ({ ...prev, ["password1Error"]: true }));
      return;
    }

    if (changePasswordData.password1 !== changePasswordData.password2) {
      setError((prev) => ({ ...prev, ["password2Error"]: true }));
      return;
    }
    handleSubmit(changePasswordData);
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
            Change Password
          </Typography>
          <form onSubmit={submitNewPassword}>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography
                sx={{ textAlign: "left" }}
                variant="body1"
                gutterBottom
              >
                New password
              </Typography>
              <TextField
                error={!!error.password1Error}
                name="password1"
                type="password"
                value={changePasswordData.password1}
                required
                onChange={handleFormChange}
                fullWidth
              />
              {error.password1Error && (
                <FormHelperText>
                  Password must contain uppercase, lowercase letters, digits and
                  special characters.
                </FormHelperText>
              )}

              <Typography
                sx={{ textAlign: "left", mt: 1 }}
                variant="body1"
                gutterBottom
              >
                Confirm new password
              </Typography>
              <TextField
                error={!!error.password2Error}
                name="password2"
                type="password"
                value={changePasswordData.password2}
                required
                onChange={handleFormChange}
                fullWidth
              />
              {error.password2Error && (
                <FormHelperText>Passwords must match.</FormHelperText>
              )}

              <Button
                disabled={isPending}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mt: 1 }}
              >
                {isPending ? "Changing password..." : "Change password"}
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

export default ChangePasswordForm;
