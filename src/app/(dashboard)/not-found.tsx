import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardNotFound() {
  return (
    <div className="flex h-[450px] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Return to dashboard</Link>
      </Button>
    </div>
  )
} 