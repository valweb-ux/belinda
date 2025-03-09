import { NextResponse } from "next/server"

const horoscopeData = [
  {
    name: "Овен",
    latinName: "Aries",
    date: "21 березня - 19 квітня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Телець",
    latinName: "Taurus",
    date: "20 квітня - 20 травня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Близнюки",
    latinName: "Gemini",
    date: "21 травня - 20 червня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Рак",
    latinName: "Cancer",
    date: "21 червня - 22 липня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Лев",
    latinName: "Leo",
    date: "23 липня - 22 серпня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Діва",
    latinName: "Virgo",
    date: "23 серпня - 22 вересня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Терези",
    latinName: "Libra",
    date: "23 вересня - 22 жовтня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Скорпіон",
    latinName: "Scorpio",
    date: "23 жовтня - 21 листопада",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Стрілець",
    latinName: "Sagittarius",
    date: "22 листопада - 21 грудня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Козеріг",
    latinName: "Capricorn",
    date: "22 грудня - 19 січня",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Водолій",
    latinName: "Aquarius",
    date: "20 січня - 18 лютого",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    name: "Риби",
    latinName: "Pisces",
    date: "19 лютого - 20 березня",
    image: "/placeholder.svg?height=222&width=395",
  },
]

export async function GET() {
  return NextResponse.json({ horoscope: horoscopeData })
}

