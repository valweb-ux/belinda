import type React from "react"
import { Facebook, Twitter } from "lucide-react"
import { WhatsappIcon } from "react-share"

interface SocialShareButtonsProps {
  title: string
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ title }) => {
  const encodedTitle = encodeURIComponent(title)
  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="flex space-x-4 items-center mb-6">
      <span className="text-sm font-medium">Поділитися:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&t=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label="Поділитися у Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label="Поділитися у Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label="Поділитися у WhatsApp"
      >
        <WhatsappIcon size={20} round />
      </a>
    </div>
  )
}

export default SocialShareButtons

