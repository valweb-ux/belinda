import { NextResponse } from "next/server"

// Імітація даних виконавців
const artistsData = [
  { id: 1, name: "Антитіла" },
  { id: 2, name: "Арсен Мірзоян" },
  { id: 3, name: "Бумбокс" },
  { id: 4, name: "Вакарчук Святослав" },
  { id: 5, name: "Винник Олег" },
  { id: 6, name: "Гайтана" },
  { id: 7, name: "Джамала" },
  { id: 8, name: "Дорофєєва Надя" },
  { id: 9, name: "Дзідзьо" },
  { id: 10, name: "Еліна Іващенко" },
  { id: 11, name: "Єгор Крід" },
  { id: 12, name: "Жадан Сергій" },
  { id: 13, name: "Заліско Христина" },
  { id: 14, name: "Іванчукова Юлія" },
  { id: 15, name: "Їжак Сашко" },
  { id: 16, name: "Тіна Кароль" }, // Додано Тіну Кароль
]

export async function GET() {
  const availableLetters = new Set(artistsData.map((artist) => artist.name[0].toUpperCase()))
  return NextResponse.json({ availableLetters: Array.from(availableLetters).sort() })
}

