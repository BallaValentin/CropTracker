import { CircularProgress, Typography } from "@mui/material";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";

interface ProgressCircleProps {
  loadingMessage: string;
}

function ProgressCircle({ loadingMessage }: ProgressCircleProps) {
  return (
    <>
      <ColumnCenterContainer>
        <CircularProgress />
        <Typography variant="h2">{loadingMessage}</Typography>
      </ColumnCenterContainer>
    </>
  );
}

export default ProgressCircle;
