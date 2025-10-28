import { Box, CircularProgress } from "@mui/material";

function ProgressCircle() {
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
      </Box>
    </>
  );
}

export default ProgressCircle;
