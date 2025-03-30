// import { redirect } from "next/navigation"
// import { cookies } from "next/headers"
import { DashboardClientLayout } from "@/components/dashboard/dashboard-client-layout"

// Server component that checks authentication
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const cookieStore = await cookies()
  // const token = cookieStore.get("auth-token")

  // Commenting out for testing purposes
  // if (!token) {
  //   redirect("/login")
  // }

  return <DashboardClientLayout>{children}</DashboardClientLayout>
} 