"use client"

import type React from "react"

import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const ArrowLeft = LucideIcons.ArrowLeft
const MapPin = LucideIcons.MapPin
const Tag = LucideIcons.Tag
const FileText = LucideIcons.FileText
const ImageIcon = LucideIcons.ImageIcon
const Save = LucideIcons.Save
const Sparkles = LucideIcons.Sparkles
const Plus = LucideIcons.Plus
const X = LucideIcons.X
const Star = LucideIcons.Star
const Users = LucideIcons.Users
const ShoppingBag = LucideIcons.ShoppingBag
const Upload = LucideIcons.Upload
const Loader2 = LucideIcons.Loader2

const categories = [
  "Temple",
  "Monument",
  "Museum",
  "Resort",
  "Hotel",
  "Beach",
  "Mountain",
  "Historical Site",
  "Natural Wonder",
  "Cultural Center",
]

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingModel, setUploadingModel] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    category: "",
    rating: "4.5",
    review_count: "0",
    online_visitors: "0",
    total_visitors: "0",
    virtual_tours: "0",
    thumbnail_url: "",
    hero_image_url: "",
    model_url: "",
  })

  const [highlights, setHighlights] = useState<string[]>([""])
  const [visitorTips, setVisitorTips] = useState<string[]>([""])
  const [marketplaceLinks, setMarketplaceLinks] = useState<{ name: string; url: string }[]>([{ name: "", url: "" }])
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addHighlight = () => setHighlights([...highlights, ""])
  const removeHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index))
  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights]
    newHighlights[index] = value
    setHighlights(newHighlights)
  }

  const addVisitorTip = () => setVisitorTips([...visitorTips, ""])
  const removeVisitorTip = (index: number) => setVisitorTips(visitorTips.filter((_, i) => i !== index))
  const updateVisitorTip = (index: number, value: string) => {
    const newTips = [...visitorTips]
    newTips[index] = value
    setVisitorTips(newTips)
  }

  const addMarketplaceLink = () => setMarketplaceLinks([...marketplaceLinks, { name: "", url: "" }])
  const removeMarketplaceLink = (index: number) => setMarketplaceLinks(marketplaceLinks.filter((_, i) => i !== index))
  const updateMarketplaceLink = (index: number, field: "name" | "url", value: string) => {
    const newLinks = [...marketplaceLinks]
    newLinks[index][field] = value
    setMarketplaceLinks(newLinks)
  }

  const toggleBadge = (badge: string) => {
    setBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          address: formData.address,
          category: formData.category,
          latitude: Number.parseFloat(formData.latitude),
          longitude: Number.parseFloat(formData.longitude),
          thumbnail_url: formData.thumbnail_url,
          hero_image_url: formData.hero_image_url,
          model_url: formData.model_url,
          rating: Number.parseFloat(formData.rating),
          review_count: Number.parseInt(formData.review_count),
          online_visitors: Number.parseInt(formData.online_visitors),
          total_visitors: Number.parseInt(formData.total_visitors),
          virtual_tours: Number.parseInt(formData.virtual_tours),
          highlights: highlights.filter((h) => h.trim() !== ""),
          visitor_tips: visitorTips.filter((t) => t.trim() !== ""),
          marketplace_links: marketplaceLinks.filter((l) => l.name && l.url),
          badges: badges,
          is_published: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create project")
      }

      const { project } = await response.json()

      toast({
        title: "Success!",
        description: "Project created successfully",
      })

      router.push(`/destination/${project.id}`)
    } catch (error) {
      console.error("[v0] Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingThumbnail(true)
    try {
      console.log("[v0] Uploading thumbnail:", file.name, file.size, "bytes")

      const presignResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!presignResponse.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { uploadUrl, key } = await presignResponse.json()

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3")
      }

      const publicUrlResponse = await fetch(`/api/upload?key=${encodeURIComponent(key)}`)
      const { url } = await publicUrlResponse.json()

      console.log("[v0] Thumbnail uploaded:", url)
      handleInputChange("thumbnail_url", url)
      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully",
      })
    } catch (error) {
      console.error("[v0] Error uploading thumbnail:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload thumbnail",
        variant: "destructive",
      })
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHero(true)
    try {
      console.log("[v0] Uploading hero image:", file.name, file.size, "bytes")

      const presignResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!presignResponse.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { uploadUrl, key } = await presignResponse.json()

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3")
      }

      const publicUrlResponse = await fetch(`/api/upload?key=${encodeURIComponent(key)}`)
      const { url } = await publicUrlResponse.json()

      console.log("[v0] Hero image uploaded:", url)
      handleInputChange("hero_image_url", url)
      toast({
        title: "Success",
        description: "Hero image uploaded successfully",
      })
    } catch (error) {
      console.error("[v0] Error uploading hero image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload hero image",
        variant: "destructive",
      })
    } finally {
      setUploadingHero(false)
    }
  }

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size and warn user
    if (file.size > 4.5 * 1024 * 1024) {
      toast({
        title: "Large File Warning",
        description: "Files over 4.5MB may fail to upload. Consider compressing your 3D model.",
        variant: "destructive",
      })
    }

    setUploadingModel(true)
    try {
      console.log("[v0] Uploading 3D model:", file.name, file.size, "bytes")

      const presignResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      })

      if (!presignResponse.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { uploadUrl, key } = await presignResponse.json()

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3")
      }

      const publicUrlResponse = await fetch(`/api/upload?key=${encodeURIComponent(key)}`)
      const { url } = await publicUrlResponse.json()

      console.log("[v0] 3D model uploaded:", url)
      handleInputChange("model_url", url)
      toast({
        title: "Success",
        description: "3D model uploaded successfully",
      })
    } catch (error) {
      console.error("[v0] Error uploading 3D model:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload 3D model. File may be too large (max 4.5MB).",
        variant: "destructive",
      })
    } finally {
      setUploadingModel(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/30">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-white/60">Create and manage virtual tourism projects</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-xl">Add New Project</CardTitle>
            <CardDescription className="text-white/60">
              Fill in the details to create a new virtual tourism experience
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Basic Information</h3>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Taj Mahal Virtual Tour"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                    required
                  />
                </div>

                {/* Location and Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      Location Name
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Agra, India"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white text-sm">
                      Full Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/40 min-h-[100px] resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-white text-sm">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 27.1751"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-white text-sm">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 78.0421"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-purple-500" />
                    Category
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-md border-white/10">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()} className="text-white">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the location and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/40 min-h-[100px] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Statistics Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Statistics</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-white flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-purple-500" />
                      Rating
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review_count" className="text-white text-sm">
                      Reviews
                    </Label>
                    <Input
                      id="review_count"
                      type="number"
                      value={formData.review_count}
                      onChange={(e) => handleInputChange("review_count", e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="online_visitors" className="text-white flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-purple-500" />
                      Online Visitors
                    </Label>
                    <Input
                      id="online_visitors"
                      type="number"
                      value={formData.online_visitors}
                      onChange={(e) => handleInputChange("online_visitors", e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_visitors" className="text-white text-sm">
                      Total Visitors
                    </Label>
                    <Input
                      id="total_visitors"
                      type="number"
                      value={formData.total_visitors}
                      onChange={(e) => handleInputChange("total_visitors", e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="virtual_tours" className="text-white text-sm">
                      Virtual Tours
                    </Label>
                    <Input
                      id="virtual_tours"
                      type="number"
                      value={formData.virtual_tours}
                      onChange={(e) => handleInputChange("virtual_tours", e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-semibold text-white">Highlights</h3>
                  <Button
                    type="button"
                    onClick={addHighlight}
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Stunning architecture"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                    />
                    {highlights.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Visitor Tips Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-semibold text-white">Visitor Tips</h3>
                  <Button
                    type="button"
                    onClick={addVisitorTip}
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {visitorTips.map((tip, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      placeholder="e.g., Use headphones for immersive audio"
                      value={tip}
                      onChange={(e) => updateVisitorTip(index, e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[60px]"
                    />
                    {visitorTips.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeVisitorTip(index)}
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Marketplace Links Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-500" />
                    Marketplace Links
                  </h3>
                  <Button
                    type="button"
                    onClick={addMarketplaceLink}
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {marketplaceLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Shop name"
                        value={link.name}
                        onChange={(e) => updateMarketplaceLink(index, "name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                      />
                      <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateMarketplaceLink(index, "url", e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
                      />
                    </div>
                    {marketplaceLinks.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMarketplaceLink(index)}
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Badges Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {["Popular", "Trending", "New", "Featured", "Top Rated", "Hidden Gem"].map((badge) => (
                    <Button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      size="sm"
                      variant={badges.includes(badge) ? "default" : "outline"}
                      className={
                        badges.includes(badge)
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-white/10 text-white hover:bg-white/10"
                      }
                    >
                      {badge}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Media Files Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Media Files</h3>
                <p className="text-sm text-white/60">Upload images and 3D models directly from your computer</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thumbnail Upload Card */}
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2 text-sm">
                      <ImageIcon className="h-4 w-4 text-[#6341F2]" />
                      Thumbnail Image
                    </Label>
                    <div
                      onClick={() => document.getElementById("thumbnail")?.click()}
                      className={`relative aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                        formData.thumbnail_url
                          ? "border-[#6341F2]/50 bg-[#6341F2]/5"
                          : "border-white/20 bg-white/5 hover:border-[#6341F2]/50 hover:bg-white/10"
                      }`}
                    >
                      {uploadingThumbnail ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-[#6341F2]" />
                          <p className="text-sm text-white/60">Uploading...</p>
                        </div>
                      ) : formData.thumbnail_url ? (
                        <>
                          <img
                            src={formData.thumbnail_url || "/placeholder.svg"}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="h-6 w-6 text-white mx-auto mb-2" />
                              <p className="text-sm text-white font-medium">Click to change</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="p-3 rounded-full bg-white/5 border border-white/10">
                            <ImageIcon className="h-6 w-6 text-white/60" />
                          </div>
                          <p className="text-sm text-white/80 font-medium">Click to upload</p>
                          <p className="text-xs text-white/50">PNG, JPG, WEBP</p>
                        </div>
                      )}
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploadingThumbnail}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Hero Image Upload Card */}
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2 text-sm">
                      <ImageIcon className="h-4 w-4 text-[#6341F2]" />
                      Hero Image
                    </Label>
                    <div
                      onClick={() => document.getElementById("hero")?.click()}
                      className={`relative aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                        formData.hero_image_url
                          ? "border-[#6341F2]/50 bg-[#6341F2]/5"
                          : "border-white/20 bg-white/5 hover:border-[#6341F2]/50 hover:bg-white/10"
                      }`}
                    >
                      {uploadingHero ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-[#6341F2]" />
                          <p className="text-sm text-white/60">Uploading...</p>
                        </div>
                      ) : formData.hero_image_url ? (
                        <>
                          <img
                            src={formData.hero_image_url || "/placeholder.svg"}
                            alt="Hero preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="h-6 w-6 text-white mx-auto mb-2" />
                              <p className="text-sm text-white font-medium">Click to change</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="p-3 rounded-full bg-white/5 border border-white/10">
                            <ImageIcon className="h-6 w-6 text-white/60" />
                          </div>
                          <p className="text-sm text-white/80 font-medium">Click to upload</p>
                          <p className="text-xs text-white/50">PNG, JPG, WEBP</p>
                        </div>
                      )}
                      <input
                        id="hero"
                        type="file"
                        accept="image/*"
                        onChange={handleHeroUpload}
                        disabled={uploadingHero}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 3D Model Upload Card - Full Width */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white flex items-center gap-2 text-sm">
                      <Upload className="h-4 w-4 text-[#6341F2]" />
                      3D Model (.ply, .splat, .ksplat)
                    </Label>
                    <div
                      onClick={() => document.getElementById("model")?.click()}
                      className={`relative h-32 rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                        formData.model_url
                          ? "border-[#6341F2]/50 bg-[#6341F2]/5"
                          : "border-white/20 bg-white/5 hover:border-[#6341F2]/50 hover:bg-white/10"
                      }`}
                    >
                      {uploadingModel ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-[#6341F2]" />
                          <p className="text-sm text-white/60">Uploading 3D model...</p>
                          <p className="text-xs text-white/40">This may take a while for large files</p>
                        </div>
                      ) : formData.model_url ? (
                        <div className="absolute inset-0 flex items-center justify-between px-6 bg-gradient-to-r from-[#6341F2]/10 to-transparent">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#6341F2]/20 border border-[#6341F2]/30">
                              <Upload className="h-6 w-6 text-[#6341F2]" />
                            </div>
                            <div>
                              <p className="text-sm text-white/90 font-medium">3D Model Uploaded</p>
                              <p className="text-xs text-white/50 mt-1 max-w-md truncate">{formData.model_url}</p>
                            </div>
                          </div>
                          <div className="text-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-5 w-5 text-white/60 mx-auto mb-1" />
                            <p className="text-xs text-white/60">Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="p-3 rounded-full bg-white/5 border border-white/10">
                            <Upload className="h-6 w-6 text-white/60" />
                          </div>
                          <p className="text-sm text-white/80 font-medium">Click to upload 3D model</p>
                          <p className="text-xs text-white/50">.PLY, .SPLAT, .KSPLAT files supported</p>
                        </div>
                      )}
                      <input
                        id="model"
                        type="file"
                        accept=".ply,.splat,.ksplat"
                        onChange={handleModelUpload}
                        disabled={uploadingModel}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 bg-transparent h-10"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white h-10"
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.location ||
                    !formData.model_url ||
                    !formData.thumbnail_url
                  }
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
