"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import { Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function ContactsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your server
    console.log("Form submitted", { name, email, message })
    // Reset form fields
    setName("")
    setEmail("")
    setMessage("")
    // Show a success message to the user
    alert("Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.")
  }

  const iconLinkStyle = "inline-block hover-underline text-primary"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar />
        <MainMenu />
      </header>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-32">
        <AdBlock />
        <section className="my-12">
          <h1 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Контакти
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Зв'яжіться з нами</h2>
              <p className="mb-4">Ми завжди раді почути від наших слухачів. Ось як ви можете з нами зв'язатися:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-primary" />
                  <span>+380 44 123 4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  <a href="mailto:info@cherifm.ua" className="hover-underline text-primary">
                    info@cherifm.ua
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span>вул. Радіо, 1, м. Буча, Київська область, 08292</span>
                </li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-2">Слідкуйте за нами</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/cherieukraine"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={iconLinkStyle}
                >
                  <Facebook className="h-6 w-6 hover:opacity-80" />
                </a>
                <a
                  href="https://www.youtube.com/@cheriefm.ukraine"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className={iconLinkStyle}
                >
                  <Youtube className="h-6 w-6 hover:opacity-80" />
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Напишіть нам</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ім'я</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Повідомлення</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Надіслати
                </Button>
              </form>
            </div>
          </div>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

