import { useEffect, useState } from "react";
import type { GetWorkStatDTO } from "../../interfaces/response/GetWorkStatDTO";
import { LineChart } from "@mui/x-charts";
import { useTranslation } from "react-i18next";

interface FieldWorkLineChartProps {
  fieldWorks: GetWorkStatDTO[];
  afterDate: string;
  beforeDate: string;
}

function FieldWorkLineChart({
  fieldWorks,
  afterDate,
  beforeDate,
}: FieldWorkLineChartProps) {
  const { t } = useTranslation();

  const [chartData, setChartData] = useState<
    { workType: string; startDate: string; parameter: string; value: number }[]
  >([]);

  const [series, setSeries] = useState<{ data: number[]; label: string }[]>([]);

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
        console.log("Field work: ", fieldWork);
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

      console.log("All number values: ", newChartData);
      setChartData(newChartData);

      const parameters = [
        ...new Set(newChartData.map((item) => item.parameter)),
      ];

      const newSeries: { label: string; data: number[] }[] = parameters.map(
        (parameter) => ({
          label: parameter,
          data: newChartData
            .filter((chartEntry) => chartEntry.parameter === parameter)
            .map((chartEntry) => chartEntry.value),
        }),
      );

      setSeries(newSeries);
    }
  }, [fieldWorks, afterDate, beforeDate, t]);

  return (
    <LineChart
      xAxis={[
        {
          scaleType: "point",
          data: chartData.map(
            (entry) => `${entry.startDate} - ${entry.workType}`,
          ),
        },
      ]}
      series={series}
      height={400}
    />
  );
}

export default FieldWorkLineChart;
