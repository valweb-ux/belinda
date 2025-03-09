import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface NewsResponse {
  items: NewsItem[]
  total: number
  page: number
  pageSize: number
}

export interface NewsItem {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  date: string
  tags: string[]
  locale: string
}

export const newsApi = {
  getLatestNews: async (page = 1, pageSize = 9): Promise<NewsResponse> => {
    const response = await axios.get(`${API_URL}/news`, {
      params: {
        page,
        pageSize,
        sort: "-date",
      },
    })
    return response.data
  },

  getNewsByTag: async (tag: string, page = 1, pageSize = 9): Promise<NewsResponse> => {
    const response = await axios.get(`${API_URL}/news`, {
      params: {
        tag,
        page,
        pageSize,
        sort: "-date",
      },
    })
    return response.data
  },

  getNewsById: async (id: string): Promise<NewsItem> => {
    const response = await axios.get(`${API_URL}/news/${id}`)
    return response.data
  },
}

