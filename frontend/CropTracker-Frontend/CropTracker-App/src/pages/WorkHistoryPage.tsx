import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import ProgressCircle from "../elements/progress/ProgressCircle";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useFieldWorks } from "../hooks/UseFieldWorks";

function WorkHistoryPage() {
  const { data: userData, isLoading: isLoadingUser } = useUserProfile();
  const { data: fieldWorks, isLoading: isLoadingFieldWorks } = useFieldWorks();

  if (isLoadingUser) {
    return <ProgressCircle loadingMessage="Loading work history..." />;
  }

  if (isLoadingFieldWorks) {
    <MainContainer hasDrawer={userData != null}>
      <MainHeader userData={userData} />
      <ProgressCircle loadingMessage="Loading work history..." />
    </MainContainer>;
  }

  return (
    <Box>
      <MainContainer hasDrawer={userData != null}>
        <MainHeader userData={userData} />
        {fieldWorks && fieldWorks.length > 0 ? (
          <Box sx={{ mt: 20 }}>
            {fieldWorks.map((fieldWork) => (
              <Card key={fieldWork.uid} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6">{fieldWork.workTypeName}</Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      href={`/field-work-details/${fieldWork.uid}`}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <ColumnCenterContainer>
            <Typography
              color="textSecondary"
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", fontStyle: "italic" }}
            >
              You have no work history yet!
            </Typography>
          </ColumnCenterContainer>
        )}
      </MainContainer>
    </Box>
  );
}

export default WorkHistoryPage;
