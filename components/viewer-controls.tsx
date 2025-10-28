import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

export function ViewerControls() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
        <p className="text-white/80 text-sm mb-3 text-center font-medium">W,A,S,D controls icons</p>
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
            <ArrowUp className="h-5 w-5 text-white" />
            <span className="sr-only">W - Move forward</span>
          </button>
          <div />
          <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="sr-only">A - Move left</span>
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
            <ArrowDown className="h-5 w-5 text-white" />
            <span className="sr-only">S - Move backward</span>
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
            <ArrowRight className="h-5 w-5 text-white" />
            <span className="sr-only">D - Move right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
