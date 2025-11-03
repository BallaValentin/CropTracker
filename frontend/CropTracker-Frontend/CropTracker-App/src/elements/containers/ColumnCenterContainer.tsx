import Box from "@mui/material/Box";

interface ColumnCenterContainerProps {
  children: React.ReactNode;
}

function ColumnCenterContainer({ children }: ColumnCenterContainerProps) {
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
        {children}
      </Box>
    </>
  );
}

export default ColumnCenterContainer;
