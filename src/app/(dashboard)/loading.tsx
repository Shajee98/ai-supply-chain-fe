import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="mt-2 h-4 w-[300px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="mt-2 h-8 w-[80px]" />
              </div>
              <Skeleton className="h-4 w-[40px]" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border">
          <div className="p-6">
            <Skeleton className="h-6 w-[120px]" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border">
          <div className="p-6">
            <Skeleton className="h-6 w-[160px]" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="p-6">
          <Skeleton className="h-6 w-[120px]" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 