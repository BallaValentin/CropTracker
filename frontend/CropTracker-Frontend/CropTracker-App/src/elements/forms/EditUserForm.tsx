import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { type UpdateUserDTO } from "../../interfaces/request/UpdateUserDTO";
import type { CacheUserData } from "../../interfaces/response/CacheUserData";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  getPersonNameError,
  getUsernameError,
} from "../../utils/FormSubmitHelper";

interface EditUserFormProps {
  onSubmit: (userUpdates: UpdateUserDTO) => void;
  userData: CacheUserData | undefined;
  isUpdating: boolean;
}

function EditUserForm({ onSubmit, userData, isUpdating }: EditUserFormProps) {
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [updatedImage, setUpdatedImage] = useState<string>(
    userData?.avatarURL || "",
  );

  const [userUpdates, setUserUpdates] = useState<UpdateUserDTO>({
    username: userData?.username || "",
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    avatarUrl: "",
  });

  const [updateError, setUpdateError] = useState<Record<string, string>>({
    usernameError: "",
    firstNameError: "",
    lastNameError: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const usernameError = getUsernameError(userUpdates.username) || "";
    const firstNameError = getPersonNameError(userUpdates.firstName) || "";
    const lastNameError = getPersonNameError(userUpdates.lastName) || "";

    setUpdateError((prev) => ({
      ...prev,
      usernameError: usernameError,
      firstNameError: firstNameError,
      lastNameError: lastNameError,
    }));

    if (firstNameError || !!lastNameError || !!usernameError) return;
    onSubmit(userUpdates);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserUpdates((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    console.log("Received file: ", file);
    if (file) {
      const newAvatarUrl = await toBase64(file);
      setUpdatedImage(newAvatarUrl);
      setUserUpdates((prev) => ({
        ...prev,
        avatarUrl: newAvatarUrl,
      }));
    }
  };

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
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
              onChange={handleAvatarChange}
            />

            <FormLabel htmlFor="avatar-upload">
              <Avatar
                src={updatedImage}
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
            </FormLabel>

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
                htmlFor="avatar-upload"
              >
                <CameraAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mt: 2 }} />
          <FormControl>
            <Grid container spacing={4} alignItems="center" sx={{ mt: 2 }}>
              <Grid size={3}>
                <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                  Username
                </Typography>
              </Grid>
              <Grid size={9}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={userUpdates.username}
                  error={!!updateError.usernameError}
                  helperText={updateError.usernameError || " "}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid size={3}>
                <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                  Full name
                </Typography>
              </Grid>
              <Grid size={9}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="First name"
                    name="firstName"
                    value={userUpdates.firstName}
                    error={!!updateError.firstNameError}
                    helperText={updateError.firstNameError || " "}
                    onChange={handleFormChange}
                  />

                  <TextField
                    label="Last name"
                    name="lastName"
                    value={userUpdates.lastName}
                    error={!!updateError.lastNameError}
                    helperText={updateError.lastNameError || " "}
                    onChange={handleFormChange}
                  />
                </Box>
              </Grid>
            </Grid>
            <Button
              disabled={isUpdating}
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              {isUpdating ? "Updating profile..." : "Update profile"}
            </Button>
          </FormControl>
        </form>
      </Box>
    </>
  );
}

export default EditUserForm;
