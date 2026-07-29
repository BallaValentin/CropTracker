import { Box } from "@mui/material";
import ChangePasswordForm from "../elements/forms/ChangePasswordForm";
import type { ChangePasswordData } from "../interfaces/request/UpdatePasswordDTO";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../services/UserService";
import type { AxiosError } from "axios";
import { addSnackbar } from "../utils/SnackbarHelper";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          successMessage: "Your password has been successfully updated",
          key: `${Date.now()}`,
        },
      });
    },
    onError: (err: AxiosError) => {
      console.log(err.status);
      if (err.status === 401 || err.status === 400 || err.status === 404) {
        addSnackbar("Your token is missing or has been expired");
      } else {
        addSnackbar("An unexpected error has occured");
      }
    },
  });

  const changePassword = (newPasswordData: ChangePasswordData) => {
    mutate(newPasswordData);
  };

  return (
    <>
      <Box>
        <ChangePasswordForm
          isPending={isPending}
          handleSubmit={changePassword}
        />
      </Box>
    </>
  );
}

export default ChangePasswordPage;
