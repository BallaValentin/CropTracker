import { LineChart } from "@mui/x-charts";

interface FieldWorkLineChartProps {
  chartData: {
    workType: string;
    startDate: string;
    parameter: string;
    value: number;
  }[];
  series: { label: string; data: number[] }[];
}

function FieldWorkLineChart({ chartData, series }: FieldWorkLineChartProps) {
  return (
    <LineChart
      xAxis={[
        {
          scaleType: "point",
          data: chartData.map((entry) => `${entry.startDate.substring(0, 10)}`),
        },
      ]}
      series={series}
      height={400}
    />
  );
}

export default FieldWorkLineChart;
