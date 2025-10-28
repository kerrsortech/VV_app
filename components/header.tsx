"use client"

import type React from "react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Bell = LucideIcons.Bell
const Sparkles = LucideIcons.Sparkles
const LogOut = LucideIcons.LogOut
const Shield = LucideIcons.Shield

interface HeaderProps {
  searchBar?: React.ReactNode
}

export function Header({ searchBar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-lg font-semibold text-white">Virtual Voyage</span>
        </Link>

        {searchBar && <div className="flex-1 max-w-3xl mx-4">{searchBar}</div>}

        {/* Right side actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="text-white/60 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-md border-white/10">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                <Link href="/admin" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
