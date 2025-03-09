import { NextResponse } from "next/server"

const horoscopeData = [
  {
    name: "Овен",
    latinName: "aries",
    date: "21 березня - 19 квітня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Сьогодні ваша енергія на піку. Використайте це для досягнення цілей.",
  },
  {
    name: "Телець",
    latinName: "taurus",
    date: "20 квітня - 20 травня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Зосередьтеся на фінансових питаннях. Можливі несподівані прибутки.",
  },
  {
    name: "Близнюки",
    latinName: "gemini",
    date: "21 травня - 20 червня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Ваша комунікабельність допоможе вирішити важливі питання.",
  },
  {
    name: "Рак",
    latinName: "cancer",
    date: "21 червня - 22 липня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Приділіть увагу родині. Можливі важливі розмови з близькими.",
  },
  {
    name: "Лев",
    latinName: "leo",
    date: "23 липня - 22 серпня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Ваша креативність на висоті. Використайте це для нових проектів.",
  },
  {
    name: "Діва",
    latinName: "virgo",
    date: "23 серпня - 22 вересня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Зверніть увагу на деталі. Вони можуть виявитися ключовими.",
  },
  {
    name: "Терези",
    latinName: "libra",
    date: "23 вересня - 22 жовтня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Гарний час для налагодження партнерських відносин.",
  },
  {
    name: "Скорпіон",
    latinName: "scorpio",
    date: "23 жовтня - 21 листопада",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Ваша інтуїція особливо гостра. Довіряйте своїм відчуттям.",
  },
  {
    name: "Стрілець",
    latinName: "sagittarius",
    date: "22 листопада - 21 грудня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Чудовий день для подорожей та нових знайомств.",
  },
  {
    name: "Козеріг",
    latinName: "capricorn",
    date: "22 грудня - 19 січня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Зосередьтеся на кар'єрних цілях. Можливі важливі зустрічі.",
  },
  {
    name: "Водолій",
    latinName: "aquarius",
    date: "20 січня - 18 лютого",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Ваші інноваційні ідеї можуть принести успіх. Не бійтеся експериментувати.",
  },
  {
    name: "Риби",
    latinName: "pisces",
    date: "19 лютого - 20 березня",
    image: "/placeholder.svg?height=222&width=395",
    prediction: "Прислухайтеся до свого внутрішнього голосу. Він підкаже правильний шлях.",
  },
]

export async function GET(request: Request, { params }: { params: { sign: string } }) {
  const sign = params.sign.toLowerCase()
  const horoscopeSign = horoscopeData.find((item) => item.latinName === sign)

  if (!horoscopeSign) {
    return NextResponse.json({ error: "Sign not found" }, { status: 404 })
  }

  return NextResponse.json({ sign: horoscopeSign })
}

