// src/pages/components/CompetitionsChart.jsx
import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { API_URL } from "@/config/api";
import axios from "axios";

const LEVEL_LABELS = {
  continental: "Continental",
  asia: "Asia",
  africa: "Africa",
  "north america": "North America",
  "south america": "South America",
  oceania: "Oceania",
  other: "Other",
};

const LEVEL_COLORS = {
  europe: "var(--color-europe, #3b82f6)",
  continental: "var(--color-continental, #f59e42)",
  africa: "var(--color-africa, #22c55e)",
  "north america": "var(--color-north-america, #f43f5e)",
  "south america": "var(--color-south-america, #eab308)",
  oceania: "var(--color-oceania, #8b5cf6)",
  other: "#999",
};

function getChartData(compsArr) {
  // console.log("compsArr: \n", compsArr);
  const levelCount = {};
  compsArr.forEach((compObj) => {
    const level = compObj.level;
    levelCount[level] = (levelCount[level] || 0) + 1;
  });

  return Object.entries(levelCount).map(([key, value]) => ({
    level: LEVEL_LABELS[key] || key,
    competitions: value,
    fill: LEVEL_COLORS[key] || "#888",
  }));
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export default function CompetitionsChart() {
  const [competitions, setCompetitions] = useState([]);

  const chartData = getChartData(competitions);

  // console.log("chartData CC: \n", chartData);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions`);
        setCompetitions(res.data);
        // console.log("competitions: \n", res.data);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
      }
    };
    fetchCompetitions();
  }, []);

  const totalCompetitions = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.competitions, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Competitions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="competitions"
              nameKey="level"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCompetitions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Competitions
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
