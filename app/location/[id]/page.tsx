"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DestinationCard } from "@/components/destination-card"

const destinations = [
  {
    id: "1",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
  },
  {
    id: "2",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
  },
  {
    id: "3",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
  },
  {
    id: "4",
    name: "Yoga Nandeeshwara Swamy Kalyani",
    location: "Karnataka",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png",
  },
]

export default function LocationPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">Welcome to Karnataka</h1>
          <p className="text-xl text-white/90 font-light">ಕರ್ನಾಟಕಕ್ಕೆ ಸ್ವಾಗತ</p>
        </div>
      </section>

      {/* Explore Section */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Explore</h2>

          <div className="mb-8 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search by destination"
                className="h-11 bg-white/10 backdrop-blur-md border-white/20 pl-10 text-white placeholder:text-white/60 text-sm"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-[120px] bg-white/10 backdrop-blur-md border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="temples">Temples</SelectItem>
                <SelectItem value="monuments">Monuments</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-11 bg-purple-600 hover:bg-purple-700 text-white px-6 text-sm font-medium">
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <Link key={destination.id} href={`/destination/${destination.id}`}>
                <DestinationCard {...destination} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
