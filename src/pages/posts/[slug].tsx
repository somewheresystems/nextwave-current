import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { GetStaticProps, GetStaticPaths } from 'next'
import { adjustColor } from '../../utils/colorUtils'

type PostProps = {
  title: string
  content: string
  date: string
  author: string
  tags: string[]
  color: string
}

export default function Post({ title, content, date, author, tags, color }: PostProps) {
  const adjustedColor = adjustColor(color)
  return (
    <div className="container">
      <h1 className="flex items-center">
        <span className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: adjustedColor }}></span>
        {title}
      </h1>
      <p>By {author} on {date}</p>
      <p>Tags: {tags.join(', ')}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const paths = filenames.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)
  const contentHtml = processedContent.toString()

  const [dateStr, ...titleParts] = slug.split('-')
  const title = data.title || titleParts.join(' ')
  const date = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`

  return {
    props: {
      title,
      content: contentHtml,
      date,
      author: data.author || 'Unknown',
      tags: data.tags || [],
      color: data.color || '#000000',
    },
  }
}