"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardClientLayoutProps {
  children: React.ReactNode
}

export function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-r ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex h-full flex-col overflow-y-auto bg-background px-3 py-4">
            <div className="mb-10 flex items-center justify-between">
              {!collapsed && <span className="text-xl font-semibold">AI Supply Chain</span>}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
            <DashboardNav collapsed={collapsed} />
            <div className="mt-auto border-t pt-4">
              <UserNav collapsed={collapsed} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "pl-16" : "pl-64"}`}>
          <div className="container mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 