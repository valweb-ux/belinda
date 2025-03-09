import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface HoroscopeSign {
  id: string
  name: string
  image: string
  prediction: string
  dates: string
}

export interface HoroscopeResponse {
  date: string
  signs: HoroscopeSign[]
}

export const horoscopeApi = {
  getDailyHoroscope: async (locale: string): Promise<HoroscopeResponse> => {
    const response = await axios.get(`${API_URL}/horoscope/daily`, {
      params: { locale },
    })
    return response.data
  },

  getSignHoroscope: async (signId: string, locale: string): Promise<HoroscopeSign> => {
    const response = await axios.get(`${API_URL}/horoscope/sign/${signId}`, {
      params: { locale },
    })
    return response.data
  },
}

