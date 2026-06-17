import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import EditUserForm from "../forms/EditUserForm";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../services/UserService";
import { queryClient } from "../../query-client/QueryClient";
import type { UpdateUserDTO } from "../../interfaces/request/UpdateUserDTO";
import type { AxiosError } from "axios";
import type { CacheUserData } from "../../interfaces/response/CacheUserData";
import CloseIcon from "@mui/icons-material/Close";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: CacheUserData | undefined;
}

function AccountDialog({ isOpen, onClose, userData }: AccountDialogProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle sx={{ textAlign: "center", position: "relative" }}>
          Manage Account
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {userData?.firstName} {userData?.lastName}
          </Typography>
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
