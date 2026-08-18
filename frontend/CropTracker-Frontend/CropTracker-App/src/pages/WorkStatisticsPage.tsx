import { useTranslation } from "react-i18next";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import PageTitle from "../elements/typographies/PageTitle";
import { useFieldWorksWithDays } from "../hooks/caching/UseFieldWorksWithinDays";
import FieldWorksLineChart from "../elements/charts/FieldWorksLineChart";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import { type GetWorkStatDTO } from "../interfaces/response/GetWorkStatDTO";
import { Box, Card, TextField } from "@mui/material";
import { toDateTimeLocal } from "../utils/DateTimeHelper";

function WorkStatisticsPage() {
  const { t } = useTranslation();
  const [fieldWorks, setFieldWorks] = useState<GetWorkStatDTO[] | null>(null);

  const [afterDate, setAfterDate] = useState<string>(
    toDateTimeLocal(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)),
  );
  const [beforeDate, setBeforeDate] = useState<string>(
    toDateTimeLocal(new Date()),
  );

  const { data: user } = useCurrentProfile();

  const { data: fieldWorksData, isLoading: isFieldWorksLoading } =
    useFieldWorksWithDays(365, !!user);

  useEffect(() => {
    if (fieldWorksData) {
      setFieldWorks(fieldWorksData);
    }
  }, [fieldWorksData]);

  if (isFieldWorksLoading || !fieldWorks) {
    return (
      <>
        <MainHeader />
        <MainContainer>
          <ProgressCircle loadingMessage="Loading work statistics..." />
        </MainContainer>
      </>
    );
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "beforeDate") {
      setBeforeDate(value);
    } else {
      setAfterDate(value);
    }
  };

  return (
    <>
      <MainHeader />
      <MainContainer>
        <PageTitle
          titleText={t("pages.workStatisticsPage.pageTitle", {
            defaultValue: "Work Statistics",
          })}
        />

        <Box
          sx={{
            mt: 5,
            p: 3,
            display: "flex",
            gap: 3,
            justifyContent: "space-between",
          }}
        >
          <TextField
            sx={{ width: 400 }}
            type="datetime-local"
            label="After Date"
            name="afterDate"
            value={afterDate.substring(0, 16)}
            onChange={handleDateChange}
          />
          <TextField
            sx={{ width: 400 }}
            type="datetime-local"
            label="Before Date"
            name="beforeDate"
            value={beforeDate.substring(0, 16)}
            onChange={handleDateChange}
          />
        </Box>

        <Card sx={{ p: 2 }}>
          <FieldWorksLineChart
            fieldWorks={fieldWorks}
            afterDate={afterDate}
            beforeDate={beforeDate}
          />
        </Card>
      </MainContainer>
    </>
  );
}

export default WorkStatisticsPage;
