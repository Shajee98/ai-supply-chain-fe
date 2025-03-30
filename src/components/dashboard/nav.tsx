"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Box,
  Home,
  PackageSearch,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: Box,
  },
  {
    title: "Shipments",
    href: "/dashboard/shipments",
    icon: Truck,
  },
  {
    title: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: PackageSearch,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardNavProps {
  collapsed?: boolean
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "transparent"
            )}
            title={collapsed ? item.title : undefined}
          >
            <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        )
      })}
    </nav>
  )
} 