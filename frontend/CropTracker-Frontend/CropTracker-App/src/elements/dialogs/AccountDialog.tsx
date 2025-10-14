import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

interface AccountDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

function AccountDialog(accountDialogProps: AccountDialogProps) {
  return (
    <Box>
      <Dialog
        open={accountDialogProps.isOpen}
        onClose={accountDialogProps.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          Manage Account
        </DialogTitle>
        <Divider />
        <DialogContent>
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
