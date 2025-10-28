"use client"

import { useEffect, useRef, useState } from "react"

interface Destination {
  id: string
  name: string
  location: string
  image: string
  lat: number
  lng: number
}

interface InteractiveMapProps {
  destinations: Destination[]
  selectedId: string | null
  onMarkerClick: (id: string) => void
}

export function InteractiveMap({ destinations, selectedId, onMarkerClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    let mapInstance: any = null

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet")
      .then((LeafletModule) => {
        setL(LeafletModule.default)

        // Initialize map centered on Karnataka, India
        mapInstance = LeafletModule.default.map(mapRef.current!, {
          center: [14.5, 76.0],
          zoom: 7,
          zoomControl: false,
          scrollWheelZoom: true,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          attributionControl: false,
        })

        // Add OpenStreetMap tiles (free, no API key needed)
        LeafletModule.default
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            minZoom: 3,
          })
          .addTo(mapInstance)

        LeafletModule.default.control
          .zoom({
            position: "bottomright",
          })
          .addTo(mapInstance)

        setMap(mapInstance)

        console.log("[v0] Map initialized successfully")
      })
      .catch((error) => {
        console.error("[v0] Failed to initialize map:", error)
      })

    // Cleanup
    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove()
          console.log("[v0] Map cleaned up")
        } catch (error) {
          console.warn("[v0] Error cleaning up map:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !L || destinations.length === 0) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove()
      } catch (error) {
        console.warn("[v0] Error removing marker:", error)
      }
    })
    markersRef.current = []

    // Custom marker icon with pin style
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative flex flex-col items-center">
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-500/20 rounded-full animate-ping"></div>
          <div class="relative bg-purple-600 rounded-full p-2 border-2 border-white shadow-xl z-10">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div class="w-0.5 h-4 bg-purple-600 shadow-lg"></div>
        </div>
      `,
      iconSize: [40, 56],
      iconAnchor: [20, 56],
      popupAnchor: [0, -56],
    })

    // Add markers for each destination
    const newMarkers = destinations.map((dest) => {
      const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map)

      // Create popup with thumbnail and name
      const popupContent = `
        <div class="p-0 min-w-[180px] max-w-[220px]">
          <img src="${dest.image}" alt="${dest.name}" class="w-full h-20 object-cover rounded-t-lg" />
          <div class="p-3">
            <h3 class="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">${dest.name}</h3>
            <p class="text-xs text-gray-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              ${dest.location}
            </p>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 220,
        className: "custom-popup",
        closeButton: true,
        autoPan: true,
      })

      marker.on("click", () => {
        onMarkerClick(dest.id)
      })

      return marker
    })

    markersRef.current = newMarkers

    console.log("[v0] Added", newMarkers.length, "markers to map")
  }, [map, L, destinations, onMarkerClick])

  useEffect(() => {
    if (!map || markersRef.current.length === 0) return

    markersRef.current.forEach((marker, index) => {
      const dest = destinations[index]
      if (dest && dest.id === selectedId) {
        marker.openPopup()
        map.setView([dest.lat, dest.lng], 10, { animate: true })
      }
    })
  }, [selectedId, map, destinations])

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 z-0 rounded-xl" />

      {/* Loading overlay */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 rounded-xl">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-2"></div>
            <p className="text-white/80 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </>
  )
}
