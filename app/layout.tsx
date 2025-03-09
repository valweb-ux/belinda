import "./global.css"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Шері ФМ Україна",
  description: "Відчуй гарну музику",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className={`${montserrat.variable}`}>
      <body className={`${montserrat.className} ${inter.className} antialiased`}>{children}</body>
    </html>
  )
}



import './globals.css'