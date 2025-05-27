//
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

const CONTINENT_LABELS = {
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  "north america": "North America",
  "south america": "South America",
  oceania: "Oceania",
  other: "Other",
};

const CONTINENT_COLORS = {
  europe: "var(--color-europe, #3b82f6)",
  asia: "var(--color-asia, #f59e42)",
  africa: "var(--color-africa, #22c55e)",
  "north america": "var(--color-north-america, #f43f5e)",
  "south america": "var(--color-south-america, #eab308)",
  oceania: "var(--color-oceania, #8b5cf6)",
  other: "#999",
};

function getChartData(clubs) {
  // جمع کردن تعداد باشگاه‌ها به ازای هر قاره
  const continentCount = {};
  clubs.forEach((club) => {
    const continent = club.country?.continent || "other";
    continentCount[continent] = (continentCount[continent] || 0) + 1;
  });

  // تبدیل به آرایه مورد نیاز برای نمودار
  return Object.entries(continentCount).map(([key, value]) => ({
    browser: CONTINENT_LABELS[key] || key, // فیلد browser رو به continent تغییر بده اگه لازم داری
    visitors: value,
    fill: CONTINENT_COLORS[key] || "#888",
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

export default function ClubsChart() {
  const [clubs, setClubs] = useState([]);

  const chartData = getChartData(clubs);

  // console.log("chartData: \n", chartData);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs`);
        setClubs(res.data);
        // console.log("clubs: \n", res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  const totalClubs = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Clubs</CardTitle>
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
              dataKey="visitors"
              nameKey="browser"
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
                          {totalClubs.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clubs
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
