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
const Loader2 = LucideIcons.Loader2

interface Project {
  id: string
  title: string
  location: string
  thumbnail_url: string
  latitude: number
  longitude: number
}

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("[v0] Fetching projects from API...")
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Projects fetched:", data)

        // Handle both response formats
        const projectsList = data.projects || []

        // Filter projects that have coordinates
        const projectsWithCoords = projectsList.filter((p: Project) => p.latitude && p.longitude)

        setProjects(projectsWithCoords)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching projects:", err)
        setError(err instanceof Error ? err.message : "Failed to load projects")
        setProjects([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const destinations = projects.map((project) => ({
    id: project.id,
    name: project.title,
    location: project.location,
    image: project.thumbnail_url,
    lat: project.latitude,
    lng: project.longitude,
  }))

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
            <Button className="h-10 bg-[#6341F2] hover:bg-[#5835d9] text-white px-5 text-sm font-medium">Search</Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#6341F2] mx-auto mb-2" />
                <p className="text-white/60">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <p className="text-red-400 mb-2">Error loading projects</p>
                <p className="text-white/60 text-sm">{error}</p>
              </div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <p className="text-white/60">No projects found</p>
                <Link href="/admin">
                  <Button className="mt-4 bg-[#6341F2] hover:bg-[#5835d9]">Create First Project</Button>
                </Link>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
