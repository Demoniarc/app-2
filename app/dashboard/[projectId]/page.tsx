"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

const metrics = [
  { name: "Posts Twitter", key: "twitter_post", color: "hsl(var(--chart-1))" },
  { name: "Utilisateurs Twitter", key: "twitter_user", color: "hsl(var(--chart-2))" },
  { name: "Messages Discord", key: "discord_message", color: "hsl(var(--chart-3))" },
  { name: "Utilisateurs Discord", key: "discord_user", color: "hsl(var(--chart-4))" },
  { name: "Messages Telegram", key: "telegram_message", color: "hsl(var(--chart-5))" },
  { name: "Utilisateurs Telegram", key: "telegram_user", color: "hsl(var(--chart-6))" },
  { name: "Commits GitHub", key: "github_commit", color: "hsl(var(--chart-7))" },
  { name: "Développeurs GitHub", key: "github_developer", color: "hsl(var(--chart-8))" },
  { name: "Prix d'ouverture", key: "opening_price", color: "hsl(var(--chart-9))" },
  { name: "Prix de clôture", key: "closing_price", color: "hsl(var(--chart-10))" },
  { name: "Volume d'échanges", key: "trading_volume", color: "hsl(var(--chart-11))" },
  { name: "Rendement", key: "return", color: "hsl(var(--chart-12))" },
]

function generateHistoricalData(days: number) {
  const data = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayData = {
      date: date.toISOString().split('T')[0],
    }
    metrics.forEach(metric => {
      if (metric.key.includes("price")) {
        dayData[metric.key] = getRandomFloat(0.1, 100)
      } else if (metric.key === "trading_volume") {
        dayData[metric.key] = getRandomInt(100000, 10000000)
      } else if (metric.key === "return") {
        dayData[metric.key] = getRandomFloat(-5, 5)
      } else {
        dayData[metric.key] = getRandomInt(100, 10000)
      }
    })
    data.push(dayData)
  }
  return data
}

function calculateChange(current: number, previous: number) {
  if (previous === 0) return "N/A"
  const change = ((current - previous) / previous) * 100
  return change.toFixed(2)
}

export default function Dashboard({ params }: { params: { projectId: string } }) {
  const historicalData = generateHistoricalData(1000)
  const currentData = historicalData[historicalData.length - 1]
  const previousData = historicalData[historicalData.length - 2]

  const [selectedMetrics, setSelectedMetrics] = useState(metrics.slice(0, 3).map(m => m.key))

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricKey)
        ? prev.filter(key => key !== metricKey)
        : [...prev, metricKey]
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold capitalize">{params.projectId} Tableau de bord</h1>
      
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
                <Label htmlFor={metric.key} className="text-sm">{metric.name}</Label>
              </div>
            ))}
          </div>
          <ChartContainer
            config={metrics.reduce((acc, metric) => {
              acc[metric.key] = {
                label: metric.name,
                color: metric.color,
              }
              return acc
            }, {})}
            className="h-[300px] md:h-[400px] lg:h-[600px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{fontSize: '12px'}} />
                {selectedMetrics.map((metricKey) => {
                  const metric = metrics.find(m => m.key === metricKey)
                  return (
                    <Line
                      key={metricKey}
                      type="linear"
                      dataKey={metricKey}
                      stroke={metric.color}
                      name={metric.name}
                      strokeWidth={2}
                    />
                  )
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
                {currentData[metric.key].toLocaleString('fr-FR')}
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
  )
}

