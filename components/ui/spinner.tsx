import type React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin [animation-duration:1.2s] [animation-timing-function:cubic-bezier(0.4,0,0.2,1)]",
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
