import { Box } from "@mui/material";
import ChangePasswordForm from "../elements/forms/ChangePasswordForm";
import type { ChangePasswordData } from "../interfaces/ChangePasswordData";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../services/UserService";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      navigate("/signin", {
        state: {
          passwordUpdatedMessage: "Your password has been successfully updated",
        },
      });
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
