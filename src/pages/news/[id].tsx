import type React from "react"
import { SEO } from "../../components/shared/SEO/SEO"
import { Layout } from "../../components/layout/Layout"
import { useRouter } from "next/router"

const NewsArticlePage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  // Fetch article data here
  const article = {
    title: "Example Article Title",
    description: "This is an example article description.",
    image: "/images/article-image.jpg",
  }

  return (
    <Layout>
      <SEO
        title={`${article.title} - Шері ФМ Новини`}
        description={article.description}
        image={article.image}
        article={true}
      />
      {/* Rest of your article content */}
    </Layout>
  )
}

export default NewsArticlePage

