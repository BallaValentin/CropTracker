import { Box, CircularProgress } from "@mui/material";

function ProgressCircle() {
  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    </>
  );
}

export default ProgressCircle;
