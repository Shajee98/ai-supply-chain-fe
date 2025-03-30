import { redirect } from "next/navigation"
import { useAuthStore } from "@/lib/store"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is already authenticated
  const isAuthenticated = useAuthStore.getState().isAuthenticated

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return <>{children}</>
} 