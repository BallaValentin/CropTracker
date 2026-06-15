import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { type UpdateUserDTO } from "../../interfaces/request/UpdateUserDTO";
import type { CacheUserData } from "../../interfaces/CacheUserData";

interface EditUserFormProps {
  onSubmit: (userUpdates: UpdateUserDTO) => void;
  userData: CacheUserData | undefined;
  isUpdating: boolean;
}

function EditUserForm({ onSubmit, userData, isUpdating }: EditUserFormProps) {
  const [userUpdates, setUserUpdates] = useState<UpdateUserDTO>({
    username: userData?.username || "",
    email: userData?.email || "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(userUpdates);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserUpdates((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid size={4}>
                <Typography variant="subtitle1">Username</Typography>
              </Grid>
              <Grid size={8}>
                <TextField
                  name="username"
                  value={userUpdates.username}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid size={4}>
                <Typography variant="subtitle1">Email</Typography>
              </Grid>
              <Grid size={8}>
                <TextField
                  name="email"
                  value={userUpdates.email}
                  onChange={handleFormChange}
                />
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
