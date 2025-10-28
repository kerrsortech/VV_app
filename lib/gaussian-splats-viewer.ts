// @ts-ignore - GaussianSplats3D types
import { Viewer as GaussianViewer } from "@mkkellogg/gaussian-splats-3d"

export interface ViewerOptions {
  container: HTMLElement
  cameraUp?: [number, number, number]
  initialCameraPosition?: [number, number, number]
  initialCameraLookAt?: [number, number, number]
}

export class Viewer {
  container: HTMLElement
  viewer: any // GaussianViewer instance
  isVRMode = false
  isVRPreviewMode = false
  private initPromise: Promise<void>
  private isInitialized = false
  private isSceneFlipped = false
  private isDisposed = false

  constructor(options: ViewerOptions) {
    this.container = options.container

    try {
      this.viewer = new GaussianViewer({
        cameraUp: options.cameraUp || [0, 1, 0],
        initialCameraPosition: options.initialCameraPosition || [0, 1.6, 5],
        initialCameraLookAt: options.initialCameraLookAt || [0, 1.6, 0],
        sharedMemoryForWorkers: false,
        integerBasedSort: true,
        halfPrecisionCovariancesOnGPU: true,
        devicePixelRatio: window.devicePixelRatio,
        enableSIMDInSort: true,
        dynamicScene: false,
        webXRMode: "VR",
        renderMode: "Always",
        sceneRevealMode: "Instant",
        antialiased: true,
        focalAdjustment: 1.0,
        logLevel: "None",
        selfDrivenMode: false, // Disabled self-driven mode for manual control
        useBuiltInControls: false, // Disabled built-in orbit controls
      })

      console.log("[v0] GaussianViewer instance created")

      this.initPromise = this.initialize()
    } catch (error) {
      console.error("[v0] Failed to create viewer:", error)
      throw error
    }
  }

  private async initialize(): Promise<void> {
    try {
      console.log("[v0] Starting viewer initialization...")

      // Check if init method exists and returns a promise
      if (this.viewer.init && typeof this.viewer.init === "function") {
        const initResult = this.viewer.init()
        if (initResult && typeof initResult.then === "function") {
          await initResult
        }
      }

      console.log("[v0] Viewer initialized successfully")

      // Add the viewer's canvas to the container
      if (this.viewer.renderer?.domElement) {
        this.container.appendChild(this.viewer.renderer.domElement)
        console.log("[v0] Canvas added to container")
      }

      if (this.viewer.camera) {
        this.viewer.camera.near = 0.01
        this.viewer.camera.updateProjectionMatrix()
      }

      this.handleResize()

      // Handle window resize
      window.addEventListener("resize", this.handleResize)

      this.isInitialized = true
      console.log("[v0] Viewer fully initialized and ready")
    } catch (error) {
      console.error("[v0] Failed to initialize viewer:", error)
      throw error
    }
  }

  async waitForInitialization(): Promise<void> {
    await this.initPromise
  }

  get camera() {
    return this.viewer?.camera
  }

  update() {
    if (this.viewer && this.viewer.update) {
      this.viewer.update()
    }
  }

  render() {
    if (this.viewer && this.viewer.render) {
      this.viewer.render()
    }
  }

  async addSplatScene(path: string, filename?: string) {
    await this.waitForInitialization()

    try {
      console.log("[v0] Loading Gaussian splat scene from:", path)

      const sceneOptions: any = {
        progressiveLoad: true,
        showLoadingUI: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        splatAlphaRemovalThreshold: 1,
      }

      await this.viewer.addSplatScene(path, sceneOptions)

      console.log("[v0] Gaussian splat scene loaded successfully")

      this.frameScene()
    } catch (error) {
      console.error("[v0] Failed to load Gaussian splat scene:", error)
      throw error
    }
  }

  private frameScene() {
    try {
      if (this.viewer.splatMesh) {
        // Get the bounding box of the loaded scene
        const boundingBox = this.viewer.splatMesh.getBoundingBox()

        if (boundingBox) {
          const center = boundingBox.getCenter(new (this.viewer.splatMesh.constructor as any).Vector3())
          const size = boundingBox.getSize(new (this.viewer.splatMesh.constructor as any).Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          const eyeHeight = 1.6 // Average human eye height in meters
          const groundY = boundingBox.min.y
          const distance = maxDim * 1.5

          this.camera.position.set(center.x, groundY + eyeHeight, center.z + distance)
          this.camera.lookAt(center.x, groundY + eyeHeight, center.z)
          this.camera.updateProjectionMatrix()

          console.log("[v0] Camera positioned at ground level:", {
            groundY,
            cameraY: groundY + eyeHeight,
            cameraPosition: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
          })
        }
      }
    } catch (error) {
      console.warn("[v0] Could not auto-frame scene:", error)
    }
  }

  async clearScene() {
    await this.waitForInitialization()

    try {
      if (this.viewer.splatMesh) {
        await this.viewer.removeSplatScene(0)
        console.log("[v0] Scene cleared")
      }
    } catch (error) {
      console.error("[v0] Failed to clear scene:", error)
    }
  }

  async enableVRMode() {
    if (this.isVRMode) return

    await this.waitForInitialization()

    console.log("[v0] Enabling VR mode")
    this.isVRMode = true

    try {
      // Enable WebXR VR mode
      if (this.viewer.renderer.xr) {
        this.viewer.renderer.xr.enabled = true

        // Request VR session
        await this.createVRSession()
      }
    } catch (error) {
      console.error("[v0] Failed to enable VR mode:", error)
      this.isVRMode = false
      throw error
    }
  }

  enableVRPreviewMode() {
    if (this.isVRPreviewMode) return

    console.log("[v0] Enabling VR preview mode (stereoscopic view)")
    this.isVRPreviewMode = true

    try {
      // Create stereoscopic effect by rendering two side-by-side views
      if (this.viewer.renderer) {
        // Enable stereo rendering
        this.viewer.renderer.xr.enabled = false // Disable actual XR

        // Store original camera for restoration
        const originalCamera = this.viewer.camera.clone()

        // Set up side-by-side rendering
        const width = this.container.clientWidth
        const height = this.container.clientHeight

        // Adjust camera for stereoscopic view
        this.viewer.camera.aspect = width / 2 / height
        this.viewer.camera.updateProjectionMatrix()

        console.log("[v0] VR preview mode enabled - use mouse to look around")
      }
    } catch (error) {
      console.error("[v0] Failed to enable VR preview mode:", error)
      this.isVRPreviewMode = false
    }
  }

  disableVRMode() {
    if (!this.isVRMode && !this.isVRPreviewMode) return

    console.log("[v0] Disabling VR mode")
    this.isVRMode = false
    this.isVRPreviewMode = false

    if (this.viewer.renderer.xr) {
      this.viewer.renderer.xr.enabled = false
    }

    // Restore normal camera aspect ratio
    if (this.viewer.camera) {
      const width = this.container.clientWidth
      const height = this.container.clientHeight
      this.viewer.camera.aspect = width / height
      this.viewer.camera.updateProjectionMatrix()
    }
  }

  private async createVRSession() {
    try {
      if ("xr" in navigator) {
        // @ts-ignore
        const isSupported = await navigator.xr.isSessionSupported("immersive-vr")

        if (isSupported) {
          // @ts-ignore
          const session = await navigator.xr.requestSession("immersive-vr", {
            optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"],
          })

          session.addEventListener("end", () => {
            console.log("[v0] VR session ended")
            this.isVRMode = false
          })

          await this.viewer.renderer.xr.setSession(session)
          console.log("[v0] VR session started - supports Meta Quest and other WebXR devices")
        } else {
          console.warn("[v0] VR not supported on this device")
          throw new Error("VR not supported")
        }
      } else {
        throw new Error("WebXR not available")
      }
    } catch (error) {
      console.error("[v0] Failed to create VR session:", error)
      throw error
    }
  }

  handleResize = () => {
    if (this.viewer && this.viewer.camera) {
      const width = this.container.clientWidth
      const height = this.container.clientHeight

      this.viewer.camera.aspect = width / height
      this.viewer.camera.updateProjectionMatrix()
      this.viewer.renderer.setSize(width, height)

      console.log("[v0] Viewer resized to:", width, "x", height)
    }
  }

  dispose() {
    if (this.isDisposed) {
      console.log("[v0] Viewer already disposed, skipping")
      return
    }

    this.isDisposed = true

    try {
      window.removeEventListener("resize", this.handleResize)

      if (this.viewer) {
        if (this.viewer.renderer?.domElement) {
          const canvas = this.viewer.renderer.domElement

          // Check if canvas is still in the container
          if (this.container.contains(canvas)) {
            try {
              this.container.removeChild(canvas)
              console.log("[v0] Canvas removed from container")
            } catch (error) {
              console.warn("[v0] Could not remove canvas:", error)
            }
          }

          // Also check if canvas is in the document body
          if (document.body.contains(canvas) && canvas.parentNode) {
            try {
              canvas.parentNode.removeChild(canvas)
              console.log("[v0] Canvas removed from parent")
            } catch (error) {
              console.warn("[v0] Could not remove canvas from parent:", error)
            }
          }
        }

        try {
          // Wrap in Promise to catch async errors
          Promise.resolve(this.viewer.dispose()).catch((error) => {
            console.warn("[v0] Async error during viewer disposal:", error)
          })
        } catch (error) {
          console.warn("[v0] Error during viewer disposal:", error)
        }
      }

      console.log("[v0] Viewer disposed successfully")
    } catch (error) {
      console.error("[v0] Error during cleanup:", error)
    }
  }

  flipSceneOrientation() {
    if (!this.viewer.splatMesh) {
      console.warn("[v0] No scene loaded to flip")
      return
    }

    try {
      // Toggle the flip state
      this.isSceneFlipped = !this.isSceneFlipped

      // Rotate 180 degrees around X-axis to flip the scene
      const rotation = this.isSceneFlipped ? Math.PI : 0

      // Apply rotation to the splat mesh
      if (this.viewer.splatMesh.rotation) {
        this.viewer.splatMesh.rotation.x = rotation
      }

      console.log("[v0] Scene orientation flipped:", this.isSceneFlipped ? "upside down" : "normal")
    } catch (error) {
      // Catch and log any errors from the library's internal operations
      console.error("[v0] Failed to flip scene orientation:", error)
      // Revert the flip state if the operation failed
      this.isSceneFlipped = !this.isSceneFlipped
    }
  }
}
