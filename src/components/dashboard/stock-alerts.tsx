"use client"

import { AlertTriangle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const lowStockItems = [
  {
    id: "ITEM001",
    name: "Industrial Sensors",
    currentStock: 15,
    minThreshold: 20,
    supplier: "TechSense Ltd",
  },
  {
    id: "ITEM002",
    name: "Circuit Boards",
    currentStock: 25,
    minThreshold: 50,
    supplier: "ElectroComponents Inc",
  },
  {
    id: "ITEM003",
    name: "Power Units",
    currentStock: 8,
    minThreshold: 15,
    supplier: "PowerTech Solutions",
  },
]

export function StockAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Stock Alerts
        </CardTitle>
        <CardDescription>Items that need reordering soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Supplier: {item.supplier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-500">
                  Stock: {item.currentStock}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min: {item.minThreshold}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 