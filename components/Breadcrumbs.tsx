import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type React from "react" // Added import for React

interface BreadcrumbsProps {
  items: {
    label: string
    href: string
  }[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-primary">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-sm font-medium text-gray-500 hover:text-primary">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs

