import { useTranslation } from "react-i18next";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import PageTitle from "../elements/typographies/PageTitle";
import { useFieldWorksWithDays } from "../hooks/caching/UseFieldWorksWithinDays";
import FieldWorksLineChart from "../elements/charts/FieldWorksLineChart";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState, type MouseEvent } from "react";
import { type GetWorkStatDTO } from "../interfaces/response/GetWorkStatDTO";
import {
  Box,
  Button,
  Card,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { toDateTimeLocal } from "../utils/DateTimeHelper";
import { useWorkTypes } from "../hooks/caching/UseWorkTypes";

function WorkStatisticsPage() {
  const { t } = useTranslation();

  const [fieldWorks, setFieldWorks] = useState<GetWorkStatDTO[] | null>(null);
  const [chartData, setChartData] = useState<
    { workType: string; startDate: string; parameter: string; value: number }[]
  >([]);
  const [series, setSeries] = useState<{ data: number[]; label: string }[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [checkedWorkTypes, setCheckedWorkTypes] = useState<boolean[]>([]);

  const [afterDate, setAfterDate] = useState<string>(
    toDateTimeLocal(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)),
  );
  const workMenuOpen = Boolean(anchorEl);

  const [beforeDate, setBeforeDate] = useState<string>(
    toDateTimeLocal(new Date()),
  );

  const handleWorkMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleWorkMenuClose = () => {
    setAnchorEl(null);
  };

  const { data: user } = useCurrentProfile();
  const { data: workTypes, isLoading: isWorkTypesLoading } = useWorkTypes();

  const { data: fieldWorksData, isLoading: isFieldWorksLoading } =
    useFieldWorksWithDays(365, !!user);

  useEffect(() => {
    if (workTypes) {
      const newWorkTypesChecked = Array(workTypes.length).fill(false);
      newWorkTypesChecked[0] = true;
      setCheckedWorkTypes([...newWorkTypesChecked]);
    }
  }, [workTypes]);

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

      let worksFilteredByWorkType = [...fieldWorks];
      workTypes?.forEach((workType, index) => {
        if (!checkedWorkTypes[index]) {
          worksFilteredByWorkType = worksFilteredByWorkType.filter(
            (work) => work.workTypeId !== workType.uid,
          );
        }
      });

      const filteredFieldWorks = worksFilteredByWorkType.filter(
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
  }, [fieldWorks, workTypes, checkedWorkTypes, afterDate, beforeDate, t]);

  if (isFieldWorksLoading || !fieldWorks || !workTypes || isWorkTypesLoading) {
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

        <Box sx={{ my: 1, display: "flex" }}>
          <Button
            color="inherit"
            onClick={handleWorkMenuOpen}
            sx={{ fontWeight: "bold" }}
          >
            Filter by Work type
          </Button>
        </Box>
        <Menu
          open={workMenuOpen}
          anchorEl={anchorEl}
          onClose={handleWorkMenuClose}
        >
          {workTypes.map((workType, index) => {
            return (
              <MenuItem
                key={workType.uid}
                selected={checkedWorkTypes[index]}
                onClick={() => {
                  const updatedWorkTypesChecked = [...checkedWorkTypes];
                  updatedWorkTypesChecked[index] =
                    !updatedWorkTypesChecked[index];
                  setCheckedWorkTypes([...updatedWorkTypesChecked]);
                }}
              >
                <ListItemIcon>
                  {checkedWorkTypes[index] ? <Check fontSize="small" /> : null}
                </ListItemIcon>
                <ListItemText>
                  {t(
                    `elements.forms.addFieldWorkForm.systemWorkTypes.${workType.name}.name`,
                    {
                      defaultValue: workType.name,
                    },
                  )}
                </ListItemText>
              </MenuItem>
            );
          })}
        </Menu>

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
