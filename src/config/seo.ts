import type { DefaultSeoProps } from "next-seo"

export const seoConfig: DefaultSeoProps = {
  titleTemplate: "%s | Адмін-панель",
  defaultTitle: "Адмін-панель",
  description: "Адміністративна панель для керування контентом сайту",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    site_name: "Адмін-панель",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Адмін-панель",
      },
    ],
  },
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#ffffff",
    },
  ],
  robotsProps: {
    nosnippet: true,
    notranslate: true,
    noimageindex: true,
    noarchive: true,
    maxSnippet: -1,
    maxImagePreview: "none",
    maxVideoPreview: -1,
  },
}

