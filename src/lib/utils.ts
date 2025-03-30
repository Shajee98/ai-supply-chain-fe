import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function generateOrderId() {
  return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function calculateETA(distance: number, speed: number = 60) {
  const hours = distance / speed
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

export function truncateText(text: string, length: number = 50) {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function calculateInventoryValue(quantity: number, unitPrice: number) {
  return quantity * unitPrice
}

export function getStatusColor(status: string): string {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  } as const

  return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export function mergeDeep<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key as keyof typeof source])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof typeof source] })
        } else {
          output[key as keyof typeof output] = mergeDeep(
            target[key as keyof typeof target] as object,
            source[key as keyof typeof source] as DeepPartial<object>
          ) as T[keyof T]
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof typeof source] })
      }
    })
  }
  return output
}

export function isObject(item: unknown): item is object {
  return item !== null && typeof item === "object" && !Array.isArray(item)
} 