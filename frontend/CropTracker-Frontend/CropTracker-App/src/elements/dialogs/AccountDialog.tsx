import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import type { LoginResponse } from "../../interfaces/LoginResponse";

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
          <Avatar src={userData.avatar} />
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
