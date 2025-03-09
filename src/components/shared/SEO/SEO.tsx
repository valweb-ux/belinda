import type React from "react"
import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
}

export const SEO: React.FC<SEOProps> = ({
  title = "Шері ФМ - Відчуй гарну музику",
  description = "Шері ФМ - українське радіо для жінок. Гарна музика, цікаві новини, корисні поради.",
  image = "/images/og-image.jpg",
  article = false,
}) => {
  const router = useRouter()
  const canonicalUrl = `https://cheriefm.online${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://cheriefm.online${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://cheriefm.online${image}`} />

      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Alternate Language Versions */}
      <link rel="alternate" href="https://cheriefm.online" hrefLang="uk" />
      <link rel="alternate" href="https://cheriefm.online/en" hrefLang="en" />
      <link rel="alternate" href="https://cheriefm.online/fr" hrefLang="fr" />
    </Head>
  )
}

