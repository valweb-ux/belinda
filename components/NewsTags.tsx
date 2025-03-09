import Link from "next/link"
import type React from "react"

interface Tag {
  name: string
  count: number
}

interface NewsTagsProps {
  tags: Tag[]
}

const NewsTags: React.FC<NewsTagsProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null
  }

  const sortedTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 9)

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-700 border-b border-gray-200 pb-2">Популярні теги</h3>
      <div className="flex flex-col gap-2">
        {sortedTags.map((tag) => (
          <Link
            key={tag.name}
            href={`/news/tag/${tag.name}`}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors inline-block"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NewsTags

