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

const RANK_LABELS = {
  "1st": "Champions",
  "2nd": "Runners-up",
  "3rd": "Third-place",
};

const RANK_COLORS = {
  "1st": "var(--color-europe, #3b82f6)",
  "2st": "var(--color-africa, #22c55e)",
  "3rd": "var(--color-continental, #f59e42)",
};

function getChartData(winnersArr) {
  // console.log("compsArr: \n", winnersArr);
  const rankCount = {};
  winnersArr.forEach((winnerObj) => {
    const rank = winnerObj.rank;
    rankCount[rank] = (rankCount[rank] || 0) + 1;
  });

  return Object.entries(rankCount).map(([key, value]) => ({
    rank: RANK_LABELS[key] || key,
    trophies: value,
    fill: RANK_COLORS[key] || "#888",
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

export default function TrophiesChart() {
  const [trophies, setTrophies] = useState([]);

  const chartData = getChartData(trophies);

  // console.log("chartData CC: \n", chartData);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions`);

        const allWinners = res.data.flatMap((comp) => comp.winners);
        setTrophies(allWinners);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
      }
    };

    fetchCompetitions();
  }, []);

  const totalTrophies = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.trophies, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Trophies</CardTitle>
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
              dataKey="trophies"
              nameKey="rank"
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
                          {totalTrophies.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Trophies
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
