"use client"

import { useEffect } from "react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const ArrowLeft = LucideIcons.ArrowLeft
const MapPin = LucideIcons.MapPin
const Users = LucideIcons.Users
const Star = LucideIcons.Star
const Info = LucideIcons.Info
const Sparkles = LucideIcons.Sparkles
const ShoppingBag = LucideIcons.ShoppingBag
const Globe = LucideIcons.Globe

export default function DestinationPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to explore
        </Link>

        {/* Hero Image with Overlay Info */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-6 border border-white/10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook%20Pro%2014_%20-%206-DdM2VdX7LE7fyBXsXEh7d1euBp8ZlU.png"
            alt="Yoga Nandeeshwara Swamy Kalyani"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-purple-600/90 backdrop-blur-sm text-white border-0">Temple</Badge>
              <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20">Heritage Site</Badge>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-3">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-balance">
                Yoga Nandeeshwara Swamy Kalyani
              </h1>
              <Link href={`/viewer/${params.id}`} className="flex-shrink-0">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 text-base font-medium gap-2 shadow-lg shadow-purple-500/30">
                  <Sparkles className="h-5 w-5" />
                  Launch 3D Experience
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>Karnataka, India</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">4.8</span>
                <span className="text-white/60">(234 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Globe className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-white/60 mb-1">Online Visitors</p>
                  <p className="text-sm font-semibold text-white">12.5K+</p>
                </CardContent>
              </Card>
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Users className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-white/60 mb-1">Total Visitors</p>
                  <p className="text-sm font-semibold text-white">50K+</p>
                </CardContent>
              </Card>
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-white/60 mb-1">Virtual Tours</p>
                  <p className="text-sm font-semibold text-white">8.2K</p>
                </CardContent>
              </Card>
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-4 text-center">
                  <Info className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-white/60 mb-1">Entry Fee</p>
                  <p className="text-sm font-semibold text-white">Free</p>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card className="bg-black/60 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Place</h2>
                <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                  <p>
                    Two ancient temples dedicated to Lord Shiva are located in the Hills. The Yoganandishwara Temple on
                    top of the Nandi Hills has the architecture of the Chola style. The garbhagriha entrance of this
                    temple has decorative brass covered doors and dwarapalakas (door keepers) on either side.
                  </p>
                  <p>
                    It is said that these doorkeeper images were the gifts of Krishnadevaraya, the Vijayanagara ruler.
                    The temple showcases intricate carvings and architectural brilliance that dates back centuries,
                    making it a significant heritage site for both religious and historical tourism.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Highlights Section */}
            <Card className="bg-black/60 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {[
                    "Ancient Chola-style architecture",
                    "Decorative brass-covered doors",
                    "Historical doorkeeper sculptures",
                    "Panoramic hilltop views",
                    "Rich cultural heritage",
                  ].map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingBag className="h-5 w-5 text-purple-500" />
                  <h2 className="text-xl font-bold text-white">Online Marketplace</h2>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Explore authentic merchandise, souvenirs, and cultural artifacts from this heritage site. Support
                  local artisans and take home a piece of history.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-10 text-sm"
                  >
                    View Merchandise
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-10 text-sm"
                  >
                    Cultural Artifacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* CTA Card */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Experience in Virtual Reality</h3>
                  <p className="text-sm text-white/70 mb-4">
                    Explore this magnificent temple in stunning 3D detail from anywhere in the world.
                  </p>
                  <Link href={`/viewer/${params.id}`}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 text-sm font-medium">
                      Launch 3D Experience
                    </Button>
                  </Link>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                      <span>Available 24/7</span>
                      <span>No Download Required</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>HD Quality</span>
                      <span>VR Compatible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Location</h3>
                  <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center border border-white/10">
                    <MapPin className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="text-sm text-white/80 mb-2">Nandi Hills, Karnataka</p>
                  <p className="text-xs text-white/60">Approximately 60 km from Bangalore</p>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-black/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Virtual Experience Tips</h3>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li>• Use headphones for immersive audio</li>
                    <li>• Best viewed on desktop or VR headset</li>
                    <li>• Explore at your own pace</li>
                    <li>• Share your experience with friends</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
