"use client"

import type React from "react"

import { useState, useEffect } from "react"
import * as LucideIcons from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ArrowLeft = LucideIcons.ArrowLeft
const Upload = LucideIcons.Upload
const MapPin = LucideIcons.MapPin
const Tag = LucideIcons.Tag
const FileText = LucideIcons.FileText
const ImageIcon = LucideIcons.ImageIcon
const Save = LucideIcons.Save
const Sparkles = LucideIcons.Sparkles

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
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    category: "",
  })
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0])
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData, modelFile, imageFile)
    // TODO: Implement actual submission logic
    alert("Project created successfully! (This is a demo)")
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-10"
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

              {/* File Uploads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-white flex items-center gap-2 text-sm">
                    <ImageIcon className="h-4 w-4 text-purple-500" />
                    Thumbnail Image
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-600 file:text-white file:text-sm file:cursor-pointer hover:file:bg-purple-700"
                    />
                    {imagePreview && (
                      <div className="rounded-lg overflow-hidden border border-white/10 aspect-video">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3D Model Upload */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-white flex items-center gap-2 text-sm">
                    <Upload className="h-4 w-4 text-purple-500" />
                    3D Model File
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="model"
                      type="file"
                      accept=".ply,.splat,.ksplat"
                      onChange={handleModelFileChange}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-600 file:text-white file:text-sm file:cursor-pointer hover:file:bg-purple-700"
                    />
                    {modelFile && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-sm text-white/80 font-medium truncate">{modelFile.name}</p>
                        <p className="text-xs text-white/50 mt-1">{(modelFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}
                    <p className="text-xs text-white/40">Supported: .ply, .splat, .ksplat</p>
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
                  disabled={!formData.title || !formData.location || !modelFile}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
