interface LocationCardProps {
  name: string
  image: string
}

export function LocationCard({ name, image }: LocationCardProps) {
  return (
    <div className="group relative h-[140px] w-[220px] flex-shrink-0 overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-base font-semibold text-white">{name}</h3>
      </div>
    </div>
  )
}
