import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useFieldWorks } from "../hooks/UseFieldWorks";
import type { GetFieldWorkDTO } from "../interfaces/response/GetFieldWorkDTO";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentProfile } from "../hooks/UseCurrentUser";

function WorkHistoryPage() {
  const { isLoading: isLoadingUser, error: userError } = useCurrentProfile();
  const { data: fieldWorks, isLoading: isLoadingFieldWorks } = useFieldWorks();
  const [fieldWorksByDate, setFieldWorksByDate] = useState<
    Record<string, GetFieldWorkDTO[]>
  >({});
  const navigate = useNavigate();

  useEffect(() => {
    if (fieldWorks) {
      const groupedByDate: Record<string, GetFieldWorkDTO[]> = {};
      fieldWorks.forEach((work) => {
        const dateKey = work.startDate.substring(0, 10);
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push(work);
      });
      setFieldWorksByDate(groupedByDate);
    }
  }, [fieldWorks]);

  if (isLoadingUser) {
    return <ProgressCircle loadingMessage="Loading work history..." />;
  }

  if (isLoadingFieldWorks) {
    <MainContainer>
      <MainHeader />
      <ProgressCircle loadingMessage="Loading work history..." />
    </MainContainer>;
  }

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  return (
    <Box>
      <MainContainer>
        <MainHeader />
        {fieldWorksByDate && Object.keys(fieldWorksByDate).length > 0 ? (
          <Box sx={{ mt: 20 }}>
            {Object.entries(fieldWorksByDate).map(([date, fieldWorks]) => (
              <Card key={date} sx={{ mb: 4 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontStyle: "italic" }}
                  >
                    {date}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {fieldWorks.map((fieldWork) => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ display: "flex" }}>
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            fontSize={"medium"}
                            sx={{ fontStyle: "italic", fontWeight: "bold" }}
                          >
                            {fieldWork.startDate.substring(11, 16)}
                          </Typography>
                          {fieldWork.endDate && (
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                              fontSize={"medium"}
                              sx={{ fontStyle: "italic", fontWeight: "bold" }}
                            >
                              -{fieldWork.endDate.substring(11, 16)}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          variant="h6"
                          fontSize={"medium"}
                          sx={{ fontWeight: "bold" }}
                        >
                          {fieldWork.workTypeName}
                        </Typography>
                      </Box>

                      <Button
                        color="success"
                        href={`/field-work-details/${fieldWork.uid}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  ))}
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
