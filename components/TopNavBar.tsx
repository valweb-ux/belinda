"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Youtube, Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SearchModal from "@/components/SearchModal"

const TopNavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2 text-sm">
          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/cherieukraine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.youtube.com/@cheriefm.ukraine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/sitemap" className="hover:text-secondary transition-colors hover-underline">
              Мапа сайту
            </Link>
            <Link href="/contacts" className="hover:text-secondary transition-colors hover-underline">
              Контакти
            </Link>
            <button
              aria-label="Пошук"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-secondary transition-colors">
                <Globe className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Українська</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex md:hidden items-center space-x-4">
            <Button
              size="sm"
              variant="secondary"
              className="text-xs px-2 py-1 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            >
              Підтримати
            </Button>
            <button
              aria-label="Пошук"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-secondary transition-colors">
                <Globe className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Українська</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}

export default TopNavBar

