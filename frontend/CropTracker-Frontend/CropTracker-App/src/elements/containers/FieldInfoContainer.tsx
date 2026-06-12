import { Paper, Typography } from "@mui/material";

interface FieldInfoContainerProps {
  children: React.ReactNode;
  labelText?: string;
  width?: number;
}

function FieldInfoContainer({
  children,
  labelText = "",
  width = 400,
}: FieldInfoContainerProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        width: { width },
        gap: 1,
        borderRadius: 2,
        p: 1.5,
        bgcolor: "background.default",
      }}
    >
      <Typography
        variant="caption"
        color="success"
        sx={{
          position: "absolute",
          top: 0,
          left: 20,
          transform: "translateY(-50%)",
          bgcolor: "background.paper",
          px: 1,
          fontWeight: "bold",
        }}
      >
        {labelText}
      </Typography>
      {children}
    </Paper>
  );
}

export default FieldInfoContainer;
