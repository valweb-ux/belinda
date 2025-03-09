"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu } from "lucide-react" // Import the Menu component

const MainMenu = () => {
  const pathname = usePathname()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const navItems = [
    { href: "/", label: "Головна" },
    { href: "/news", label: "Новини" },
    { href: "/programs", label: "Програми" },
    { href: "/artists", label: "Виконавці" },
    { href: "/music", label: "Музика" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="relative overflow-hidden bg-secondary">
      <div className="menu-background">
        {[...Array(9)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-start">
              <Link
                href="/"
                className="text-3xl font-bold text-primary-foreground flex items-center"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  textShadow: "0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9)",
                }}
              >
                <span className="mr-2">Шері</span>
                <span>ФМ</span>
              </Link>
              <span
                className="text-sm text-primary-foreground block whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{ textShadow: "0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9)" }}
              >
                Відчуй гарну музику
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className={`text-primary-foreground hover:text-primary hover:bg-primary-foreground/10 w-10 h-10 ${
                  isPlaying ? "text-green-400" : ""
                }`}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Пауза" : "Грати"}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`text-primary-foreground hover:text-primary hover:bg-primary-foreground/10 w-8 h-8 ${
                    isMuted ? "text-red-400" : ""
                  }`}
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input type="range" className="w-24 hidden md:block" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4 text-primary-foreground">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:text-primary transition-colors hover-underline text-primary-foreground text-shadow",
                    isActive(item.href) && "text-primary font-bold",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Button
              asChild
              className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-2.5 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 hidden md:block font-bold"
            >
              <Link href="/support">Підтримати</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden text-primary-foreground">
                <Menu className="w-6 h-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link href="/support">Підтримати</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainMenu

