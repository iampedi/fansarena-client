// src/pages/components/FansChart.jsx
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

const GENDER_LABELS = {
  female: "Female",
  male: "Male",
  other: "Other",
};

const GENDER_COLORS = {
  female: "var(--color-europe, #3b82f6)",
  male: "var(--color-continental, #f59e42)",
  other: "#999",
};

function getChartData(fansArr) {
  // console.log("compsArr: \n", fansArr);
  const genderCount = {};
  fansArr.forEach((fanObj) => {
    const gender = fanObj.gender;
    genderCount[gender] = (genderCount[gender] || 0) + 1;
  });

  return Object.entries(genderCount).map(([key, value]) => ({
    gender: GENDER_LABELS[key] || key,
    fans: value,
    fill: GENDER_COLORS[key] || "#888",
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

export default function FansChart() {
  const [fans, setFans] = useState([]);

  const chartData = getChartData(fans);

  // console.log("chartData CC: \n", chartData);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        const filteredUsers = res.data.filter((user) => user.favoriteClub);
        setFans(filteredUsers);
        // console.log("Fans: \n", res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const totalFans = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.fans, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Fans</CardTitle>
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
              dataKey="fans"
              nameKey="gender"
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
                          {totalFans.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Fans
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
