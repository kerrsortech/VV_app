"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Trigger exit animation
    setIsAnimating(true)

    // Wait for exit animation to complete, then update children
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children)
      setIsAnimating(false)
    }, 150) // Half of the total transition time

    return () => clearTimeout(exitTimer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isAnimating ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
      }`}
    >
      {displayChildren}
    </div>
  )
}
