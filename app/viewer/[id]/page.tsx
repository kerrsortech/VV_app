"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Glasses, Upload, FlipVertical2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Viewer } from "@/lib/gaussian-splats-viewer"
import { Input } from "@/components/ui/input"

export default function ViewerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isVRMode, setIsVRMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasScene, setHasScene] = useState(false)
  const [isViewerReady, setIsViewerReady] = useState(false)

  const keysPressed = useRef<Set<string>>(new Set())
  const mouseState = useRef({ isDown: false, lastX: 0, lastY: 0 })
  const cameraRotation = useRef({ yaw: 0, pitch: 0 })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"
    document.documentElement.style.height = "100vh"

    return () => {
      document.body.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.height = ""
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const initViewer = async () => {
      try {
        console.log("[v0] Creating viewer instance...")

        const container = containerRef.current!
        const rect = container.getBoundingClientRect()
        console.log("[v0] Container dimensions:", rect.width, "x", rect.height)

        const viewer = new Viewer({
          container: container,
          cameraUp: [0, 1, 0],
          initialCameraPosition: [0, 1.6, 5],
          initialCameraLookAt: [0, 1.6, 0],
        })

        viewerRef.current = viewer

        await viewer.waitForInitialization()
        setIsViewerReady(true)
        console.log("[v0] Viewer ready for use")
      } catch (error) {
        console.error("[v0] Failed to initialize viewer:", error)
      }
    }

    initViewer()

    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!isViewerReady || !hasScene) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) {
        keysPressed.current.add(key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.delete(key)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isViewerReady, hasScene])

  useEffect(() => {
    if (!isViewerReady || !hasScene || !containerRef.current) return

    const container = containerRef.current

    const handleMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true
      mouseState.current.lastX = e.clientX
      mouseState.current.lastY = e.clientY
      container.style.cursor = "grabbing"
    }

    const handleMouseUp = () => {
      mouseState.current.isDown = false
      container.style.cursor = "grab"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown || !viewerRef.current) return

      const deltaX = e.clientX - mouseState.current.lastX
      const deltaY = e.clientY - mouseState.current.lastY

      mouseState.current.lastX = e.clientX
      mouseState.current.lastY = e.clientY

      const sensitivity = 0.002
      cameraRotation.current.yaw -= deltaX * sensitivity
      cameraRotation.current.pitch -= deltaY * sensitivity

      cameraRotation.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.current.pitch))
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!viewerRef.current) return

      const camera = viewerRef.current.camera
      if (!camera) return

      const zoomSpeed = 0.01
      const forward = {
        x: Math.sin(cameraRotation.current.yaw),
        z: Math.cos(cameraRotation.current.yaw),
      }

      const zoomAmount = -e.deltaY * zoomSpeed

      camera.position.x += forward.x * zoomAmount
      camera.position.z += forward.z * zoomAmount
    }

    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseUp)
    container.addEventListener("wheel", handleWheel, { passive: false })
    container.style.cursor = "grab"

    return () => {
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseUp)
      container.removeEventListener("wheel", handleWheel)
      container.style.cursor = "default"
    }
  }, [isViewerReady, hasScene])

  useEffect(() => {
    if (!isViewerReady) return

    let animationFrameId: number

    const animate = () => {
      if (!viewerRef.current) return

      const camera = viewerRef.current.camera
      if (!camera) return

      if (hasScene) {
        const moveSpeed = 0.15
        const forward = {
          x: Math.sin(cameraRotation.current.yaw),
          z: Math.cos(cameraRotation.current.yaw),
        }
        const right = {
          x: Math.cos(cameraRotation.current.yaw),
          z: -Math.sin(cameraRotation.current.yaw),
        }

        if (keysPressed.current.has("w")) {
          camera.position.x += forward.x * moveSpeed
          camera.position.z += forward.z * moveSpeed
        }
        if (keysPressed.current.has("s")) {
          camera.position.x -= forward.x * moveSpeed
          camera.position.z -= forward.z * moveSpeed
        }
        if (keysPressed.current.has("a")) {
          camera.position.x += right.x * moveSpeed
          camera.position.z += right.z * moveSpeed
        }
        if (keysPressed.current.has("d")) {
          camera.position.x -= right.x * moveSpeed
          camera.position.z -= right.z * moveSpeed
        }

        const lookAtDistance = 10
        const lookAtX =
          camera.position.x +
          Math.sin(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch) * lookAtDistance
        const lookAtY = camera.position.y + Math.sin(cameraRotation.current.pitch) * lookAtDistance
        const lookAtZ =
          camera.position.z +
          Math.cos(cameraRotation.current.yaw) * Math.cos(cameraRotation.current.pitch) * lookAtDistance

        camera.lookAt(lookAtX, lookAtY, lookAtZ)
        camera.updateProjectionMatrix()
      }

      viewerRef.current.update()
      viewerRef.current.render()

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isViewerReady, hasScene])

  const toggleVR = async () => {
    if (!viewerRef.current || !isViewerReady) return

    const newVRMode = !isVRMode
    setIsVRMode(newVRMode)

    if (newVRMode) {
      try {
        await viewerRef.current.enableVRMode()
      } catch (error) {
        console.log("[v0] VR not supported, enabling preview mode")
        viewerRef.current.enableVRPreviewMode()
      }
    } else {
      viewerRef.current.disableVRMode()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !viewerRef.current || !isViewerReady) return

    const fileName = file.name.toLowerCase()
    const validExtensions = [".ply", ".splat", ".ksplat"]
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!hasValidExtension) {
      alert("Please upload a .ply, .splat, or .ksplat file")
      return
    }

    setIsLoading(true)

    try {
      console.log("[v0] Uploading file:", file.name)

      if (hasScene) {
        await viewerRef.current.clearScene()
        setHasScene(false)
      }

      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload-splat", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const { url } = await uploadResponse.json()
      console.log("[v0] File uploaded, loading from:", url)

      await viewerRef.current.addSplatScene(url)

      setHasScene(true)
      console.log("[v0] File loaded and visible")
    } catch (error) {
      console.error("[v0] Failed to load uploaded file:", error)
      alert("Failed to load the file. Please ensure it is a valid Gaussian splat file.")
    } finally {
      setIsLoading(false)
    }
  }

  const flipModelOrientation = () => {
    if (!viewerRef.current || !hasScene) return

    try {
      viewerRef.current.flipSceneOrientation()
      console.log("[v0] Model orientation flipped")
    } catch (error) {
      console.warn("[v0] Flip operation completed with warnings:", error)
    }
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 hover:text-white h-9 w-9"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        onClick={toggleVR}
        variant="ghost"
        size="icon"
        disabled={!isViewerReady}
        className={`absolute top-4 right-4 z-20 backdrop-blur-md border border-white/20 text-white hover:text-white h-9 w-9 transition-colors ${
          isVRMode ? "bg-purple-600/80 hover:bg-purple-700/80" : "bg-black/40 hover:bg-black/60"
        }`}
      >
        <Glasses className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="ghost"
        size="icon"
        disabled={!isViewerReady}
        className="absolute top-4 right-16 z-20 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 hover:text-white h-9 w-9"
      >
        <Upload className="h-4 w-4" />
      </Button>

      {hasScene && (
        <Button
          onClick={flipModelOrientation}
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 hover:text-white h-10 w-10"
          title="Flip model orientation"
        >
          <FlipVertical2 className="h-5 w-5" />
        </Button>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept=".ply,.splat,.ksplat"
        onChange={handleFileUpload}
        className="hidden"
      />

      {hasScene && (
        <div className="absolute bottom-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-2">
          <div className="flex flex-col items-center gap-1">
            <div className="grid grid-cols-3 gap-0.5">
              <div className="col-start-2">
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-medium">
                  W
                </div>
              </div>
              <div className="col-span-3 flex gap-0.5">
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-medium">
                  A
                </div>
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-medium">
                  S
                </div>
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-medium">
                  D
                </div>
              </div>
            </div>
            <p className="text-[9px] text-white/60 mt-0.5">Move</p>
          </div>
        </div>
      )}

      {hasScene && (
        <div className="absolute bottom-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5">
          <p className="text-[10px] text-white/80">Click and drag to look • Scroll to zoom</p>
        </div>
      )}

      {!hasScene && !isLoading && isViewerReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-md pointer-events-auto">
            <Upload className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Upload a 3D Model</h2>
            <p className="text-sm text-white/70 mb-4">
              Click the upload button in the top right to load a Gaussian splat file (.ply, .splat, or .ksplat)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      )}

      {(isLoading || !isViewerReady) && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-sm">{!isViewerReady ? "Initializing viewer..." : "Loading 3D model..."}</p>
          </div>
        </div>
      )}
    </div>
  )
}
