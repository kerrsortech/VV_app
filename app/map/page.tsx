"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DestinationCard } from "@/components/destination-card"
import { InteractiveMap } from "@/components/interactive-map"

const Search = LucideIcons.Search
const ArrowLeft = LucideIcons.ArrowLeft

const destinations = [
  {
    id: "1",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 13.3733,
    lng: 77.6833,
  },
  {
    id: "2",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "3",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 15.3647,
    lng: 75.124,
  },
  {
    id: "4",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 14.4426,
    lng: 76.0108,
  },
]

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <div className="min-h-screen bg-black animate-in fade-in duration-500">
      <div className="px-4 py-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h2 className="text-2xl font-bold text-white">Explore Map</h2>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search by destination"
                className="h-10 bg-white/10 backdrop-blur-md border-white/20 pl-10 text-white placeholder:text-white/60 text-sm"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 w-[110px] bg-white/10 backdrop-blur-md border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="temples">Temples</SelectItem>
                <SelectItem value="monuments">Monuments</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-10 bg-purple-600 hover:bg-purple-700 text-white px-5 text-sm font-medium">
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* List View - Takes 4 columns on large screens */}
            <div className="lg:col-span-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
              {destinations.map((destination, index) => (
                <div
                  key={destination.id}
                  onClick={() => setSelectedId(destination.id)}
                  className="cursor-pointer animate-in fade-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DestinationCard {...destination} isSelected={selectedId === destination.id} compact />
                </div>
              ))}
            </div>

            {/* Map View - Takes 8 columns on large screens */}
            <div className="lg:col-span-8 relative h-[500px] lg:h-[calc(100vh-200px)] overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-right duration-500">
              <InteractiveMap destinations={destinations} selectedId={selectedId} onMarkerClick={setSelectedId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
