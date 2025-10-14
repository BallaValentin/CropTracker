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
import type { LoginResponse } from "../../interfaces/LoginResponse";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface AccountDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  userData: LoginResponse;
}

function AccountDialog({ isOpen, handleClose, userData }: AccountDialogProps) {
  return (
    <Box>
      <Dialog
        open={isOpen}
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
            {userData.firstName} {userData.lastName}
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
            />

            <label htmlFor="avatar-upload">
              <Avatar
                src={userData.avatar}
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
                <input type="file" hidden accept="image/*" />
              </IconButton>
            </Tooltip>
          </Box>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est fuga,
          nulla consequuntur tempora officiis reprehenderit delectus
          necessitatibus animi modi eius a suscipit quod molestias! Beatae
          explicabo cum sequi labore voluptatibus.
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AccountDialog;
