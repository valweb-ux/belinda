"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Головна" },
    { href: "/news", label: "Новини" },
    { href: "/programs", label: "Програми" },
    { href: "/artists", label: "Виконавці" },
    { href: "/music", label: "Музика" },
  ]

  return (
    <nav className="bg-secondary text-secondary-foreground py-4">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-lg font-medium hover:text-primary transition-colors hover-underline",
                  pathname === item.href && "text-primary font-bold",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation

