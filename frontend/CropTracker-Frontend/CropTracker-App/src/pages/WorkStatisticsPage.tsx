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
import { Box, Card, Divider, TextField, Typography } from "@mui/material";
import { toDateTimeLocal } from "../utils/DateTimeHelper";

function WorkStatisticsPage() {
  const { t } = useTranslation();

  const [fieldWorks, setFieldWorks] = useState<GetWorkStatDTO[] | null>(null);
  const [chartData, setChartData] = useState<
    { workType: string; startDate: string; parameter: string; value: number }[]
  >([]);
  const [series, setSeries] = useState<{ data: number[]; label: string }[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);

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

  useEffect(() => {
    if (fieldWorks) {
      const newChartData: {
        workType: string;
        startDate: string;
        parameter: string;
        value: number;
      }[] = [];

      const filteredFieldWorks = fieldWorks.filter(
        (fieldWork) =>
          fieldWork.startDate >= afterDate && fieldWork.startDate <= beforeDate,
      );

      filteredFieldWorks.forEach((fieldWork) => {
        const workParamaters = fieldWork.parameters;

        Object.entries(workParamaters).forEach(([key, value]) => {
          if (!!value && Number.isInteger(Number(value))) {
            newChartData.push({
              startDate:
                fieldWork.startDate.substring(0, 10) +
                " " +
                fieldWork.startDate.substring(11, 16),
              workType: t(
                `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWork.workTypeName}.name`,
                {
                  defaultValue: fieldWork.workTypeName,
                },
              ),
              parameter: `${t(
                `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWork.workTypeName}.name`,
                {
                  defaultValue: fieldWork.workTypeName,
                },
              )} - ${t(
                `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWork.workTypeName}.fields.${key}.name`,
                {
                  defaultValue: key,
                },
              )}`,
              value: Number(value),
            });
          }
        });
      });

      setChartData(newChartData);

      const parameters = [
        ...new Set(newChartData.map((item) => item.parameter)),
      ];
      const dates = newChartData.map((entry) =>
        entry.startDate.substring(0, 10),
      );

      setParameters(parameters);

      const newSeries: { label: string; data: number[] }[] = parameters.map(
        (parameter) => ({
          label: parameter,
          data: dates.map((date) => {
            const entry = newChartData.find(
              (entry) =>
                entry.parameter === parameter &&
                entry.startDate.substring(0, 10) === date,
            );

            return entry?.value ?? 0;
          }),
        }),
      );

      setSeries(newSeries);
    }
  }, [fieldWorks, afterDate, beforeDate, t]);

  if (isFieldWorksLoading || !fieldWorks) {
    return (
      <>
        <MainHeader />
        <MainContainer>
          <ProgressCircle
            loadingMessage={t("pages.workStatisticsPage.loadingMessage", {
              defaultValue: "Loading work statistics...",
            })}
          />
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

  const getAverage = (data: number[]) => {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  };

  const getSum = (data: number[]) => {
    return data.reduce((sum, value) => sum + value, 0);
  };

  const getDateForValue = (parameter: string, value: number) => {
    let startDate = null;
    chartData.forEach((entry) => {
      if (entry.parameter === parameter && entry.value === value) {
        startDate = entry.startDate.substring(0, 10);
      }
    });

    return startDate;
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
            label={t("pages.workStatisticsPage.afterDateLabel", {
              defaultValue: "After Date",
            })}
            name="afterDate"
            value={afterDate.substring(0, 16)}
            onChange={handleDateChange}
          />
          <TextField
            sx={{ width: 400 }}
            type="datetime-local"
            label={t("pages.workStatisticsPage.beforeDateLabel", {
              defaultValue: "Before Date",
            })}
            name="beforeDate"
            value={beforeDate.substring(0, 16)}
            onChange={handleDateChange}
          />
        </Box>

        <Card sx={{ p: 2 }}>
          <FieldWorksLineChart chartData={chartData} series={series} />
        </Card>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" component={"h2"} sx={{ fontWeight: "bold" }}>
            {t("pages.workStatisticsPage.summaryText", {
              defaultValue: "Summary",
            })}
          </Typography>
          <Divider />
          {parameters.map((parameter) => {
            const filteredData = chartData.filter(
              (entry) => entry.parameter === parameter,
            );
            const filteredValues = filteredData.map((entry) => entry.value);
            const sumValue = getSum(filteredValues);
            const averageValue = getAverage(filteredValues);
            const minValue = Math.min(...filteredValues);
            const minDate = getDateForValue(parameter, minValue);
            const maxValue = Math.max(...filteredValues);
            const maxDate = getDateForValue(parameter, maxValue);
            return (
              <Box sx={{ my: 1.5 }}>
                <Typography
                  variant="body2"
                  component={"h3"}
                  color="text.secondary"
                  sx={{ fontStyle: "italic", fontWeight: "bold", mb: 1 }}
                >
                  {parameter}
                </Typography>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography>
                      {t("pages.workStatisticsPage.sum", {
                        defaultValue: "Total:",
                      })}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {sumValue}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography>
                      {t("pages.workStatisticsPage.average", {
                        defaultValue: "Average:",
                      })}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {Math.round(averageValue)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>
                      {t("pages.workStatisticsPage.max", {
                        defaultValue: "Maximum:",
                      })}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {maxValue}
                    </Typography>
                    {maxDate && (
                      <Typography
                        color="text.secondary"
                        variant="caption"
                      >{`(${maxDate})`}</Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>
                      {t("pages.workStatisticsPage.min", {
                        defaultValue: "Minimum:",
                      })}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {minValue}
                    </Typography>
                    {minDate && (
                      <Typography
                        color="text.secondary"
                        variant="caption"
                      >{`(${minDate})`}</Typography>
                    )}
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      </MainContainer>
    </>
  );
}

export default WorkStatisticsPage;
