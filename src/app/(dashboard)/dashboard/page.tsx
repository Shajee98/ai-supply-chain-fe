import { Metadata } from "next"
import {
  PackageSearch,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryOverview } from "@/components/dashboard/inventory-overview"
import { OrdersChart } from "@/components/dashboard/orders-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { StockAlerts } from "@/components/dashboard/stock-alerts"
import { OrderTrendsChart } from "@/components/dashboard/order-trends-chart"
import { InventoryDistributionChart } from "@/components/dashboard/inventory-distribution-chart"

export const metadata: Metadata = {
  title: "Dashboard | AI Supply Chain Management",
  description: "Overview of your supply chain operations",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your supply chain management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+1 this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryOverview />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border">
          <div className="p-6">
            <h3 className="font-semibold">Order Trends</h3>
            <OrderTrendsChart />
          </div>
        </div>

        <div className="col-span-3">
          <StockAlerts />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Recent Orders</h3>
            <RecentOrders />
          </div>
        </div>

        <div className="col-span-3 rounded-xl border">
          <div className="p-6">
            <h3 className="font-semibold">Inventory Distribution</h3>
            <InventoryDistributionChart />
          </div>
        </div>
      </div>
    </div>
  )
} 