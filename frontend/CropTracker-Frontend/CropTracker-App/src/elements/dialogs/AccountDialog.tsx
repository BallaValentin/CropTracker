import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditUserForm from "../forms/EditUserForm";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../services/UserService";
import { queryClient } from "../../query-client/QueryClient";
import type { UpdateUserDTO } from "../../interfaces/request/UpdateUserDTO";
import type { AxiosError } from "axios";
import type { GetUserDTO } from "../../interfaces/response/GetUserDTO";

interface AccountDialogProps {
  isUploading: boolean;
  isOpen: boolean;
  avatarURL: string;
  handleClose: () => void;
  onImageChange: (newImageSrc: string) => void;
  userData: GetUserDTO | undefined;
}

function AccountDialog({
  isUploading,
  isOpen,
  avatarURL,
  handleClose,
  userData,
  onImageChange,
}: AccountDialogProps) {
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = await toBase64(file);
      onImageChange(newImageUrl);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["userProfile"] });
    },
    onError: (err: AxiosError) => {
      console.log(err.message);
    },
  });

  const handleUserdataUpdate = (userUpdates: UpdateUserDTO) => {
    mutate(userUpdates);
  };

  return (
    <Box>
      <Dialog
        open={isOpen}
        aria-disabled={isUploading}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          Manage Account
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {userData?.firstName} {userData?.lastName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <input
              id="avatar-upload"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleAvatarUpload}
            />

            <label htmlFor="avatar-upload">
              <Avatar
                src={avatarURL}
                alt="Avatar"
                sx={{
                  textAlign: "center",
                  width: 120,
                  height: 120,
                  mt: 2,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </label>

            <Tooltip
              title="Change profile picture"
              placement="top"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: "calc(50% - 60px + 8px)",
                  bgcolor: "white",
                  color: "black",
                  "&:hover": {
                    bgcolor: "lightgray",
                    color: "primary.main",
                  },
                }}
                size="small"
                component="label"
              >
                <CameraAltIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mt: 2 }} />
          <EditUserForm
            userData={userData}
            onSubmit={handleUserdataUpdate}
            isUpdating={isPending}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AccountDialog;
