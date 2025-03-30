"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const recentOrders = [
  {
    id: "ORD001",
    customer: "Acme Corp",
    product: "Industrial Sensors",
    quantity: 50,
    status: "Delivered",
    date: "2024-03-15",
  },
  {
    id: "ORD002",
    customer: "TechGear Inc",
    product: "Circuit Boards",
    quantity: 100,
    status: "Processing",
    date: "2024-03-14",
  },
  {
    id: "ORD003",
    customer: "BuildRight Ltd",
    product: "Steel Beams",
    quantity: 25,
    status: "Shipped",
    date: "2024-03-13",
  },
  {
    id: "ORD004",
    customer: "ElectroPro",
    product: "Power Units",
    quantity: 75,
    status: "Pending",
    date: "2024-03-12",
  },
  {
    id: "ORD005",
    customer: "MechSolutions",
    product: "Hydraulic Pumps",
    quantity: 30,
    status: "Delivered",
    date: "2024-03-11",
  },
]

export function RecentOrders() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 