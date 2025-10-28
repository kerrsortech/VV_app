"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DestinationCard } from "@/components/destination-card"
import { InteractiveMap } from "@/components/interactive-map"

const Search = LucideIcons.Search
const SlidersHorizontal = LucideIcons.SlidersHorizontal

const destinations = [
  {
    id: "1",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    category: "temples",
    description: "Ancient temple with beautiful architecture",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 13.3733,
    lng: 77.6833,
  },
  {
    id: "2",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    category: "temples",
    description: "Historic temple complex",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "3",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    category: "monuments",
    description: "Ancient monument with rich history",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 15.3647,
    lng: 75.124,
  },
  {
    id: "4",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    category: "museums",
    description: "Cultural museum showcasing heritage",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
    lat: 14.4426,
    lng: 76.0108,
  },
]

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredDestinations, setFilteredDestinations] = useState(destinations)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleSearch = () => {
    let filtered = destinations

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.location.toLowerCase().includes(query) ||
          dest.description?.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory)
    }

    setFilteredDestinations(filtered)
    setSelectedId(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const searchBar = (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        <Input
          placeholder="Search destinations, locations..."
          className="h-10 bg-white/10 backdrop-blur-md border-white/20 pl-10 text-white placeholder:text-white/60 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="h-10 w-[140px] bg-white/10 backdrop-blur-md border-white/20 text-white text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-black/95 backdrop-blur-md border-white/20">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="temples">Temples</SelectItem>
          <SelectItem value="monuments">Monuments</SelectItem>
          <SelectItem value="museums">Museums</SelectItem>
          <SelectItem value="resorts">Resorts</SelectItem>
          <SelectItem value="hotels">Hotels</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
      <Button
        className="h-10 bg-purple-600 hover:bg-purple-700 text-white px-6 text-sm font-medium"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Search Bar Section - Sticky below main header */}
      <div className="sticky top-16 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto px-4 md:px-6 lg:px-8 py-3">{searchBar}</div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="sticky top-[108px] z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-3">
              <Select defaultValue="any">
                <SelectTrigger className="h-9 w-[140px] bg-white/10 backdrop-blur-md border-white/20 text-white text-sm">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-md border-white/20">
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="4plus">4+ Stars</SelectItem>
                  <SelectItem value="3plus">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="any">
                <SelectTrigger className="h-9 w-[140px] bg-white/10 backdrop-blur-md border-white/20 text-white text-sm">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-md border-white/20">
                  <SelectItem value="any">Any Distance</SelectItem>
                  <SelectItem value="5km">Within 5km</SelectItem>
                  <SelectItem value="10km">Within 10km</SelectItem>
                  <SelectItem value="25km">Within 25km</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setFilteredDestinations(destinations)
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className="relative h-[calc(100vh-108px)] min-h-[700px]">
        <div className="absolute inset-0">
          <InteractiveMap destinations={filteredDestinations} selectedId={selectedId} onMarkerClick={setSelectedId} />
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-full md:w-[340px] lg:w-[380px] p-3 md:p-4 pointer-events-none">
          <div className="h-full flex flex-col gap-3 pointer-events-auto">
            <div className="bg-black/85 backdrop-blur-xl rounded-lg px-4 py-3 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Explore</h2>
                <p className="text-xs text-white/70 font-medium">
                  {filteredDestinations.length} {filteredDestinations.length === 1 ? "result" : "results"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    onClick={() => setSelectedId(destination.id)}
                    className="cursor-pointer animate-in fade-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <Link href={`/destination/${destination.id}`}>
                      <DestinationCard {...destination} isSelected={selectedId === destination.id} compact />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center bg-black/85 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl p-6">
                  <p className="text-white/70 text-sm">No destinations found</p>
                  <p className="text-white/50 text-xs mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
