import { useTranslation } from "react-i18next";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import PageTitle from "../elements/typographies/PageTitle";
import { useFieldWorksWithDays } from "../hooks/caching/UseFieldWorksWithinDays";
import FieldWorksBarChart from "../elements/charts/FieldWorksBarChart";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
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
import { useCropFieldNames } from "../hooks/caching/UseCropFieldNames";
import type { NumberWithOption } from "../interfaces/helper/NumberWithOption";

function WorkStatisticsPage() {
  const { t } = useTranslation();

  const [fieldWorks, setFieldWorks] = useState<GetWorkStatDTO[] | null>(null);
  const [chartData, setChartData] = useState<
    { workType: string; startDate: string; parameter: string; value: number }[]
  >([]);
  const [series, setSeries] = useState<{ data: number[]; label: string }[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);

  const [workTypesAnchor, setWorkTypesAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [checkedWorkTypes, setCheckedWorkTypes] = useState<boolean[]>([]);

  const [cropFieldsAnchor, setCropFieldsAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [checkedCropFields, setCheckedCropFields] = useState<boolean[]>([]);

  const [afterDate, setAfterDate] = useState<string>(
    toDateTimeLocal(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)),
  );

  const workMenuOpen = Boolean(workTypesAnchor);
  const cropFieldsMenuOpen = Boolean(cropFieldsAnchor);

  const [beforeDate, setBeforeDate] = useState<string>(
    toDateTimeLocal(new Date()),
  );

  const { data: user } = useCurrentProfile();
  const { data: workTypes, isLoading: isWorkTypesLoading } = useWorkTypes();
  const { data: cropFields, isLoading: isCropFieldsLoading } =
    useCropFieldNames(!!user);

  const { data: fieldWorksData, isLoading: isFieldWorksLoading } =
    useFieldWorksWithDays(365, !!user);

  useEffect(() => {
    if (workTypes) {
      const defaultWorkTypesChecked = Array(workTypes.length).fill(false);
      defaultWorkTypesChecked[0] = true;
      setCheckedWorkTypes([...defaultWorkTypesChecked]);
    }
  }, [workTypes]);

  useEffect(() => {
    if (cropFields) {
      const defaultCropFieldsChecked = Array(cropFields.length).fill(false);
      defaultCropFieldsChecked[0] = true;
      setCheckedCropFields([...defaultCropFieldsChecked]);
    }
  }, [cropFields]);

  useEffect(() => {
    if (fieldWorksData) {
      setFieldWorks(fieldWorksData);
    }
  }, [fieldWorksData]);

  const getWorkTypeIndex = (workTypeId: string) => {
    if (!workTypes) return 0;
    for (let i = 0; i < workTypes.length; i++) {
      if (workTypes[i].uid === workTypeId) {
        return i;
      }
    }

    return 0;
  };

  const getDefinitionIndex = (workTypeIndex: number, fieldName: string) => {
    if (!workTypes) return 0;

    const fieldDefinitions = workTypes[workTypeIndex].fieldDefinitions;

    for (let i = 0; i < fieldDefinitions.length; i++) {
      if (fieldDefinitions[i].name === fieldName) {
        return i;
      }
    }

    return 0;
  };

  useEffect(() => {
    if (fieldWorks) {
      const newChartData: {
        workType: string;
        startDate: string;
        parameter: string;
        value: number;
      }[] = [];

      let filteredFieldWorks = [...fieldWorks];
      workTypes?.forEach((workType, index) => {
        if (!checkedWorkTypes[index]) {
          filteredFieldWorks = filteredFieldWorks.filter(
            (work) => work.workTypeId !== workType.uid,
          );
        }
      });

      cropFields?.forEach((cropField, index) => {
        console.log(cropField.name);
        if (!checkedCropFields[index]) {
          filteredFieldWorks = filteredFieldWorks.filter(
            (work) => work.cropFieldId !== cropField.uid,
          );
        }
      });

      filteredFieldWorks = filteredFieldWorks.filter(
        (fieldWork) =>
          fieldWork.startDate >= afterDate && fieldWork.startDate <= beforeDate,
      );

      filteredFieldWorks.forEach((fieldWork) => {
        const workParamaters = fieldWork.parameters;

        Object.entries(workParamaters).forEach(([key, value]) => {
          const isNumberWithOption =
            typeof value === "object" &&
            value !== null &&
            "numericValue" in value &&
            "optionIndex" in value;

          if (
            !!value &&
            (Number.isInteger(Number(value)) || isNumberWithOption)
          ) {
            let numericalValue: number = 0;

            if (isNumberWithOption) {
              const optionIndex = (value as NumberWithOption).optionIndex;
              const workTypeIndex = getWorkTypeIndex(fieldWork.workTypeId);
              const definitionIndex = getDefinitionIndex(workTypeIndex, key);

              const conversionRate =
                workTypes?.[workTypeIndex]?.fieldDefinitions?.[definitionIndex]
                  ?.options?.[optionIndex]?.conversionRate ?? 1;

              numericalValue =
                (value as NumberWithOption).numericValue * conversionRate;
            } else if (typeof value === "number") {
              numericalValue = Number(value);
            }

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
              value: numericalValue,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldWorks,
    workTypes,
    checkedWorkTypes,
    afterDate,
    beforeDate,
    t,
    cropFields,
    checkedCropFields,
  ]);

  if (
    isFieldWorksLoading ||
    !fieldWorks ||
    !workTypes ||
    isWorkTypesLoading ||
    !cropFields ||
    isCropFieldsLoading
  ) {
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

        <Box sx={{ my: 1, display: "flex", justifyContent: "space-between" }}>
          <Button
            color="inherit"
            onClick={(e) => setWorkTypesAnchor(e.currentTarget)}
            sx={{ fontWeight: "bold" }}
          >
            {t("pages.workStatisticsPage.workTypeFilter", {
              defaultValue: "Filter by Work Type",
            })}
          </Button>

          <Button
            color="inherit"
            onClick={(e) => setCropFieldsAnchor(e.currentTarget)}
            sx={{ fontWeight: "bold" }}
          >
            {t("pages.workStatisticsPage.cropFieldFilter", {
              defaultValue: "Filter by Crop Field",
            })}
          </Button>
        </Box>

        <Menu
          open={workMenuOpen}
          anchorEl={workTypesAnchor}
          onClose={() => setWorkTypesAnchor(null)}
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

        <Menu
          open={cropFieldsMenuOpen}
          anchorEl={cropFieldsAnchor}
          onClose={() => setCropFieldsAnchor(null)}
        >
          {cropFields.map((cropField, index) => {
            return (
              <MenuItem
                key={cropField.uid}
                selected={checkedCropFields[index]}
                onClick={() => {
                  const updatedCropFieldsChecked = [...checkedCropFields];
                  updatedCropFieldsChecked[index] =
                    !updatedCropFieldsChecked[index];
                  setCheckedCropFields([...updatedCropFieldsChecked]);
                }}
              >
                <ListItemIcon>
                  {checkedCropFields[index] ? <Check fontSize="small" /> : null}
                </ListItemIcon>
                <ListItemText>{cropField.name}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>

        <Card sx={{ p: 2 }}>
          <FieldWorksBarChart chartData={chartData} series={series} />
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
