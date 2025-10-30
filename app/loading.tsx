import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="text-center space-y-4">
        <Spinner className="size-8 text-purple-400 mx-auto" />
        <p className="text-white/60 text-sm animate-pulse [animation-duration:2s]">Loading...</p>
      </div>
    </div>
  )
}
