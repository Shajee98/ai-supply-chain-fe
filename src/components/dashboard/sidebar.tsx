import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  ShoppingCart,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react"

const routes = {
  admin: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      color: "text-violet-500",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      color: "text-pink-700",
      href: "/orders",
    },
    {
      label: "Suppliers",
      icon: Users,
      color: "text-orange-700",
      href: "/suppliers",
    },
    {
      label: "Logistics",
      icon: Truck,
      color: "text-emerald-500",
      href: "/logistics",
    },
    {
      label: "Analytics",
      icon: BarChart,
      color: "text-green-700",
      href: "/analytics",
    },
  ],
  supplier: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Products",
      icon: Package,
      href: "/products",
      color: "text-violet-500",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      color: "text-pink-700",
      href: "/orders",
    },
  ],
  warehouse_manager: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      color: "text-violet-500",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      color: "text-pink-700",
      href: "/orders",
    },
  ],
  logistics_coordinator: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Shipments",
      icon: Truck,
      color: "text-emerald-500",
      href: "/shipments",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      color: "text-pink-700",
      href: "/orders",
    },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const userRoutes = routes[user?.role || "admin"]

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-white">AI Supply Chain</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {userRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                pathname === route.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <route.icon
                className={cn("mr-3 h-5 w-5 flex-shrink-0", route.color)}
                aria-hidden="true"
              />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={() => logout()}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Logout
        </button>
        <Link
          href="/settings"
          className="group mt-1 flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </div>
  )
} 