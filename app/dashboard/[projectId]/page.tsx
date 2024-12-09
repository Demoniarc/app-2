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
  { name: "Posts Twitter", key: "twitter_post", color: "red" },
  { name: "Utilisateurs Twitter", key: "twitter_user", color: "blue" },
  { name: "Messages Discord", key: "discord_message", color: "green" },
  { name: "Utilisateurs Discord", key: "discord_user", color: "grey" },
  { name: "Messages Telegram", key: "telegram_message", color: "brown" },
  { name: "Utilisateurs Telegram", key: "telegram_user", color: "aqua" },
  { name: "Commits GitHub", key: "github_commit", color: "orange" },
  { name: "Développeurs GitHub", key: "github_developer", color: "purple" },
  { name: "Prix d'ouverture", key: "opening_price", color: "lime" },
  { name: "Prix de clôture", key: "closing_price", color: "yellow" },
  { name: "Volume d'échanges", key: "trading_volume", color: "teal" },
  { name: "Rendement", key: "return", color: "pink" },
];

async function fetchDataFromEndpoint() {
  const endpoint =
    "https://mopsos-ai-api.onrender.com/oceanprotocol?api-key=be514f85c4af958bd22e597377bbb11ed756bbec511c803c76b246dbf2074264";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
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
        const data = await fetchDataFromEndpoint();
        setHistoricalData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (!historicalData.length) {
    return <p>Aucune donnée disponible.</p>;
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
      <h1 className="text-2xl md:text-3xl font-bold capitalize">{projectId} Tableau de bord</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Données historiques</CardTitle>
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
                % par rapport au jour précédent
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
