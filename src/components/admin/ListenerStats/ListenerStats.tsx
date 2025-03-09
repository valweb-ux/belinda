"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface ListenerData {
  timestamp: string
  count: number
  peak: number
  average: number
}

interface LocationData {
  country: string
  count: number
  percentage: number
}

export const ListenerStats: React.FC = () => {
  const [period, setPeriod] = useState("24h")
  const [listenerData, setListenerData] = useState<ListenerData[]>([])
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchListenerStats()
  }, []) // Removed unnecessary dependency: [period]

  const fetchListenerStats = async () => {
    setIsLoading(true)
    try {
      const [statsResponse, locationResponse] = await Promise.all([
        fetch(`/api/admin/stats/listeners?period=${period}`),
        fetch("/api/admin/stats/locations"),
      ])

      const statsData = await statsResponse.json()
      const locationData = await locationResponse.json()

      setListenerData(statsData)
      setLocationData(locationData)
    } catch (error) {
      console.error("Error fetching listener stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = {
    labels: listenerData.map((d) => {
      const date = new Date(d.timestamp)
      return period === "24h" ? date.toLocaleTimeString() : date.toLocaleDateString()
    }),
    datasets: [
      {
        label: "Поточні слухачі",
        data: listenerData.map((d) => d.count),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Пікові значення",
        data: listenerData.map((d) => d.peak),
        borderColor: "hsl(var(--secondary))",
        backgroundColor: "transparent",
        borderDash: [5, 5],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Статистика прослуховування",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Кількість слухачів",
        },
      },
    },
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-primary text-xl">Завантаження...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">Статистика прослуховування</h2>
        <div className="flex gap-2">
          <Button
            variant={period === "24h" ? "default" : "outline"}
            onClick={() => setPeriod("24h")}
            className="px-4 py-2 text-sm"
          >
            24 години
          </Button>
          <Button
            variant={period === "7d" ? "default" : "outline"}
            onClick={() => setPeriod("7d")}
            className="px-4 py-2 text-sm"
          >
            7 днів
          </Button>
          <Button
            variant={period === "30d" ? "default" : "outline"}
            onClick={() => setPeriod("30d")}
            className="px-4 py-2 text-sm"
          >
            30 днів
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поточні слухачі</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{listenerData[listenerData.length - 1]?.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пікове значення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Math.max(...listenerData.map((d) => d.peak))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середнє значення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(listenerData.reduce((acc, curr) => acc + curr.average, 0) / listenerData.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Графік прослуховування</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] sm:h-[300px] md:h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Географія слухачів</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Країна</TableHead>
                  <TableHead>Слухачі</TableHead>
                  <TableHead>Відсоток</TableHead>
                  <TableHead>Графік</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationData.map((location) => (
                  <TableRow key={location.country} className="hover:bg-muted/50">
                    <TableCell>{location.country}</TableCell>
                    <TableCell>{location.count}</TableCell>
                    <TableCell>{location.percentage}%</TableCell>
                    <TableCell>
                      <div className="w-full sm:w-[200px] bg-secondary h-2 rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

