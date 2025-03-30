import { Bell, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/lib/store"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.role === "admin" && "Admin Dashboard"}
            {user?.role === "supplier" && "Supplier Dashboard"}
            {user?.role === "warehouse_manager" && "Warehouse Dashboard"}
            {user?.role === "logistics_coordinator" && "Logistics Dashboard"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="sr-only">User profile</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 