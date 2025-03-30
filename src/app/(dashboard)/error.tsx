"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[450px] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="mt-2 text-muted-foreground">
          {error.message || "An error occurred while loading the dashboard."}
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
} 