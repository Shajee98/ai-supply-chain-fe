"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Jan", orders: 4000, revenue: 240000 },
  { name: "Feb", orders: 3000, revenue: 180000 },
  { name: "Mar", orders: 2000, revenue: 120000 },
  { name: "Apr", orders: 2780, revenue: 166800 },
  { name: "May", orders: 1890, revenue: 113400 },
  { name: "Jun", orders: 2390, revenue: 143400 },
  { name: "Jul", orders: 3490, revenue: 209400 },
]

export function OrdersChart() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Orders & Revenue</h3>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 