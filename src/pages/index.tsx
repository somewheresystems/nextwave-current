import { useState, useMemo } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'
import { adjustColor } from '../utils/colorUtils'
import { GetStaticProps } from 'next'

type Post = {
  slug: string
  title: string
  date: string
  author: string
  tags: string[]
  color: string
}

type SortKey = 'date' | 'title' | 'author'

export default function Home({ posts }: { posts: Post[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(post =>
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (selectedTags.length === 0 || selectedTags.every(tag => post.tags.includes(tag)))
      )
      .sort((a, b) => {
        if (a[sortKey as keyof Post] < b[sortKey as keyof Post]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortKey as keyof Post] > b[sortKey as keyof Post]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [posts, searchTerm, sortKey, sortDirection, selectedTags])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearTags = () => setSelectedTags([])

  return (
    <div className="container">
      <h1>Next Wave</h1>
      <h2>free music production & creative arts school, fostering AI-human collaboration for unbounded creativity</h2>
      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search by title, author, or tag"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        {selectedTags.length > 0 && (
          <div className="tag-filter">
            <span>Filtered by tags:</span>
            {selectedTags.map(tag => (
              <span key={tag} className="selected-tag">
                {tag}
                <button onClick={() => handleTagClick(tag)} className="remove-tag">×</button>
              </span>
            ))}
            <button onClick={clearTags} className="clear-tags">Clear all</button>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('date')}>
              Date {sortKey === 'date' && (sortDirection === 'asc' ? '△' : '▽')}
            </th>
            <th onClick={() => handleSort('title')}>
              Title {sortKey === 'title' && (sortDirection === 'asc' ? '△' : '▽')}
            </th>
            <th onClick={() => handleSort('author')}>
              Author {sortKey === 'author' && (sortDirection === 'asc' ? '△' : '▽')}
            </th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedPosts.map((post) => (
            <tr key={post.slug}>
              <td>{post.date}</td>
              <td>
                <Link href={`/posts/${post.slug}`}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '1rem', 
                    height: '1rem', 
                    borderRadius: '50%', 
                    backgroundColor: post.color,
                    marginRight: '0.5rem' 
                  }}></span>
                  {post.title}
                </Link>
              </td>
              <td>{post.author}</td>
              <td>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    style={{
                      cursor: 'pointer',
                      marginRight: '0.5rem',
                      textDecoration: selectedTags.includes(tag) ? 'underline' : 'none'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    // Parse the filename to extract date
    const [dateStr, ...slugParts] = filename.replace('.md', '').split('-')
    const date = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`

    return {
      slug: filename.replace('.md', ''),
      title: data.title || slugParts.join('-'),
      date: date,
      author: data.author || 'Unknown', // Use the author from frontmatter
      tags: data.tags || [],
      color: data.color || '#000000', // Use the color from frontmatter, or default to black
    }
  })

  posts.sort((a, b) => b.date.localeCompare(a.date))

  return {
    props: {
      posts,
    },
  }
}