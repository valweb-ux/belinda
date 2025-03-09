import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar />
        <MainMenu />
      </header>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-32">
        <section className="my-12">
          <h1 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Підтримати Шері ФМ
          </h1>
          <p className="text-lg mb-8">
            Ваша підтримка допомагає нам продовжувати створювати якісний контент та розвивати українське радіо. Ось як
            ви можете нам допомогти:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Фінансова підтримка</CardTitle>
                <CardDescription>Зробіть одноразовий або регулярний внесок</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Фінансова підтримка"
                  width={400}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <p>Ваша фінансова підтримка допоможе нам покрити витрати на обладнання та ліцензії.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Зробити внесок</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Волонтерство</CardTitle>
                <CardDescription>Станьте частиною нашої команди</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Волонтерство"
                  width={400}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <p>Ми завжди раді новим талантам. Допоможіть нам створювати контент або керувати спільнотою.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Стати волонтером</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Поширення інформації</CardTitle>
                <CardDescription>Розкажіть про нас друзям</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Поширення інформації"
                  width={400}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <p>Поділіться нашим контентом у соціальних мережах та розкажіть про нас своїм друзям та родині.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Поділитися</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

