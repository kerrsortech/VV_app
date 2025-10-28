import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

const MapPin = LucideIcons.MapPin
const Eye = LucideIcons.Eye

interface DestinationCardProps {
  name: string
  location: string
  image: string
  isSelected?: boolean
  compact?: boolean
  category?: string
}

export function DestinationCard({
  name,
  location,
  image,
  isSelected,
  compact = false,
  category,
}: DestinationCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg transition-all duration-300",
        "bg-black/85 backdrop-blur-xl border border-white/20",
        "hover:bg-black/90 hover:border-[#6341F2]/40 hover:shadow-xl hover:shadow-[#6341F2]/20",
        "hover:-translate-y-0.5",
        isSelected && "border-[#6341F2]/60 ring-2 ring-[#6341F2]/40 bg-black/90",
      )}
    >
      <div className="flex gap-3 p-2.5">
        {/* Thumbnail */}
        <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {category && (
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wide border border-white/20">
              {category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#6341F2] transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-white/70 mb-1.5">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <p className="text-xs truncate">{location}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/60">
              <Eye className="h-3 w-3" />
              <span className="text-[10px] font-medium">View in 3D</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-6 w-6 rounded-full bg-[#6341F2]/30 backdrop-blur-sm flex items-center justify-center border border-[#6341F2]/30">
                <LucideIcons.ArrowRight className="h-3 w-3 text-[#6341F2]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
