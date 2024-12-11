"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Ensure you are using the Next.js useParams hook
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const metrics = [
  { name: "Twitter Post", key: "twitter_post", color: "red" },
  { name: "Twitter User", key: "twitter_user", color: "blue" },
  { name: "Discord Message", key: "discord_message", color: "green" },
  { name: "Discord User", key: "discord_user", color: "grey" },
  { name: "Telegram Message", key: "telegram_message", color: "brown" },
  { name: "Telegram user", key: "telegram_user", color: "aqua" },
  { name: "Opening Price", key: "opening_price", color: "lime" },
  { name: "Closing Price", key: "closing_price", color: "yellow" },
  { name: "Trading Volume", key: "trading_volume", color: "teal" },
  { name: "Return", key: "return", color: "pink" },
];

async function fetchDataFromEndpoint(query) {
  const baseUrl = "https://mopsos-ai-api.onrender.com/";
  const apiKey = "be514f85c4af958bd22e597377bbb11ed756bbec511c803c76b246dbf2074264";
  const endpoint = `${baseUrl}${query}?api-key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during data recovery :", error);
    throw error;
  }
}

function calculateChange(current: number, previous: number) {
  if (previous === 0) return "N/A";
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(2);
}

export default function Dashboard() {
  const { projectId } = useParams(); // Use useParams() to access the projectId
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(metrics.slice(0, 3).map((m) => m.key));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDataFromEndpoint(projectId);
        setHistoricalData(data);
      } catch (error) {
        console.error("Error while loading data :", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (!historicalData.length) {
    return <p>No data available.</p>;
  }

  const currentData = historicalData[historicalData.length - 1];
  const previousData = historicalData[historicalData.length - 2];

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricKey)
        ? prev.filter((key) => key !== metricKey)
        : [...prev, metricKey]
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold capitalize">{projectId} dashboard</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Historical data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4">
            {metrics.map((metric) => (
              <div key={metric.key} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.key}
                  checked={selectedMetrics.includes(metric.key)}
                  onCheckedChange={() => toggleMetric(metric.key)}
                />
                <Label htmlFor={metric.key} className="text-sm">
                  {metric.name}
                </Label>
              </div>
            ))}
          </div>
          <ChartContainer
            config={metrics.reduce((acc, metric) => {
              acc[metric.key] = {
                label: metric.name,
                color: metric.color,
              };
              return acc;
            }, {})}
            className="h-[300px] md:h-[400px] lg:h-[600px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {selectedMetrics.map((metricKey) => {
                  const metric = metrics.find((m) => m.key === metricKey);
                  return (
                    <Line
                      key={metricKey}
                      type="linear"
                      dataKey={metricKey}
                      stroke={metric.color}
                      name={metric.name}
                      strokeWidth={2}
                      dot={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.key}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {currentData[metric.key].toLocaleString("fr-FR")}
              </div>
              <p className="text-xs text-muted-foreground">
                {calculateChange(currentData[metric.key], previousData[metric.key])}
                % from the previous day
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
