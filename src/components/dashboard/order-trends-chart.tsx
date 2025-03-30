"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan",
    orders: 145,
  },
  {
    date: "Feb",
    orders: 168,
  },
  {
    date: "Mar",
    orders: 156,
  },
  {
    date: "Apr",
    orders: 192,
  },
  {
    date: "May",
    orders: 205,
  },
  {
    date: "Jun",
    orders: 187,
  },
  {
    date: "Jul",
    orders: 198,
  },
  {
    date: "Aug",
    orders: 215,
  },
  {
    date: "Sep",
    orders: 187,
  },
  {
    date: "Oct",
    orders: 201,
  },
  {
    date: "Nov",
    orders: 223,
  },
  {
    date: "Dec",
    orders: 234,
  },
]

export function OrderTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#2563eb"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 