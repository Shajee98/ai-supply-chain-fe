"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

// Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
}

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  location: {
    lat: number
    lng: number
    address: string
  }
}

interface OrderItem {
  product: Product
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  supplier: Supplier
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  orderDate: string
  expectedDeliveryDate: string
  notes?: string
}

interface OrderMapProps {
  orders: Order[]
  onOrderSelect?: (order: Order) => void
}

export function OrderMap({ orders, onOrderSelect }: OrderMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  useEffect(() => {
    if (!mapContainer.current) return
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40], // Default center
      zoom: 9
    })
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    
    // Cleanup
    return () => {
      map.current?.remove()
    }
  }, [])
  
  useEffect(() => {
    if (!map.current) return
    
    // Remove existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker")
    while (markers[0]) {
      markers[0].remove()
    }
    
    // Add markers for each order
    orders.forEach(order => {
      const { lat, lng } = order.supplier.location
      
      // Create marker element
      const el = document.createElement("div")
      el.className = "cursor-pointer"
      el.innerHTML = `
        <div class="bg-white rounded-full p-2 shadow-lg border-2 ${
          selectedOrder?.id === order.id ? "border-blue-500" : "border-gray-200"
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${order.orderNumber}</h3>
            <p class="text-sm text-gray-600">${order.supplier.name}</p>
            <p class="text-sm text-gray-500">${order.items.length} items</p>
          </div>
        `)
      
      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!)
        .getElement()
        .addEventListener("click", () => {
          setSelectedOrder(order)
          onOrderSelect?.(order)
        })
    })
    
    // Fit bounds to show all markers
    if (orders.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      orders.forEach(order => {
        bounds.extend([order.supplier.location.lng, order.supplier.location.lat])
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [orders, selectedOrder, onOrderSelect])
  
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Order Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="w-full h-[500px]" />
      </CardContent>
    </Card>
  )
} 