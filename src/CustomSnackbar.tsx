import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { useEffect, useState } from "react";
import { useCampusState } from "./campus-context";

export type SnackbarItem = {
  message: string;
  severity: "success" | "error" | "warning" | "info";
};

const CustomSnackbar = () => {
  const [open, setOpen] = useState(true);
  const [state] = useCampusState();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, [state.snackbarItem]);

  if (state.snackbarItem.message === "" || !state.snackbarItem) return <></>;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={state.snackbarItem.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {state.snackbarItem.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
