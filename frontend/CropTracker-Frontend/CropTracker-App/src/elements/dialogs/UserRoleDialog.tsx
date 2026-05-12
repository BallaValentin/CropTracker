import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import type { GetAdminUserDTO } from "../../interfaces/response/GetAdminUserDTO";
import { useEffect, useMemo, useState } from "react";

interface UserRoleDialogProps {
  user: GetAdminUserDTO | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onAccept: (user: GetAdminUserDTO | null, choosenRoles: string[]) => void;
}

function UserRoleDialog({
  user,
  open,
  onClose,
  onAccept,
  isPending,
}: UserRoleDialogProps) {
  const allRoles = ["Admin", "Farmer", "Day laborer"];
  const roleNames = ["ADMIN", "GROWER", "WORKER"];
  const userRoles = useMemo(() => user?.roles || [], [user?.roles]);

  const [choosenRoles, setChoosenRoles] = useState<string[]>(userRoles);
  const [error, setError] = useState<string | null>(null);

  console.log(choosenRoles);

  const zip = (a: string[], b: string[]) => a.map((value, i) => [value, b[i]]);

  useEffect(() => {
    setChoosenRoles(userRoles);
  }, [userRoles]);

  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    roleName: string,
  ) => {
    setError(null);
    setChoosenRoles((prev) =>
      event.target.checked
        ? [...prev, roleName]
        : prev.filter((r) => r !== roleName),
    );
  };

  const handleClick = () => {
    if (choosenRoles.length === 0) {
      setError("One of the roles must be choosen");
    } else {
      onAccept(user, choosenRoles);
    }
  };

  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={onClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Manage user roles</DialogTitle>
          <DialogContent>
            <DialogContentText>
              From the following roles, add or remove from the user
            </DialogContentText>
            <Box sx={{ mt: 2 }}>
              {zip(allRoles, roleNames).map(([role, roleName]) => {
                return (
                  <FormControlLabel
                    label={role}
                    control={
                      <Checkbox
                        checked={choosenRoles.includes(roleName)}
                        onChange={(e) => handleCheck(e, roleName)}
                      />
                    }
                  />
                );
              })}
              {error && (
                <Typography color="error" variant="subtitle1">
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={isPending} onClick={handleClick}>
              {isPending ? "Saving user roles..." : "Save user roles"}
            </Button>
            <Button disabled={isPending} onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default UserRoleDialog;
