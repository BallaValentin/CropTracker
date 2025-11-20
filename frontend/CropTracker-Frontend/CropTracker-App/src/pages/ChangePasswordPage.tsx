import { Alert, Box } from "@mui/material";
import ChangePasswordForm from "../elements/forms/ChangePasswordForm";
import type { ChangePasswordData } from "../interfaces/request/ChangePasswordData";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../services/UserService";
import { useState } from "react";
import type { AxiosError } from "axios";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          passwordUpdatedMessage: "Your password has been successfully updated",
        },
      });
    },
    onError: (err: AxiosError) => {
      console.log(err.status);
      if (err.status === 401 || err.status === 400 || err.status === 404) {
        setError("Your token is missing or has been expired");
      } else {
        setError("An unexpected error has occured");
      }
      setTimeout(() => setError(null), 7000);
    },
  });

  const changePassword = (newPasswordData: ChangePasswordData) => {
    mutate(newPasswordData);
  };

  return (
    <>
      <Box>
        {error && (
          <Alert
            icon={<ErrorOutlineIcon />}
            sx={{
              position: "absolute",
              top: 8,
              left: "1.25%",
              width: "95%",
              zIndex: 1200,
            }}
            severity="error"
          >
            {error}
          </Alert>
        )}
        <ChangePasswordForm
          isPending={isPending}
          handleSubmit={changePassword}
        />
      </Box>
    </>
  );
}

export default ChangePasswordPage;
