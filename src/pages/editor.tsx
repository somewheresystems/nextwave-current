import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function Editor() {
  const [value, setValue] = useState("# Hello, World!")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [color, setColor] = useState("#000000")
  const [tags, setTags] = useState<string[]>([])

  const generateFrontMatter = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `---
title: "${title}"
date: ${currentDate}
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
author: "${author}"
color: "${color}"
---

`;
  };

  const handleDownload = () => {
    const frontMatter = generateFrontMatter();
    const fullContent = frontMatter + value;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-container">
      <h1 className="editor-title">Markdown Editor</h1>
      <div className="editor-box">
        <div className="editor-metadata">
          <div className="editor-metadata-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
            />
          </div>
          <div className="editor-metadata-row">
            <input
              type="color"
              value={color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags.join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            />
          </div>
        </div>
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || '')}
          preview="edit"
          data-color-mode="light"
        />
      </div>
      <button onClick={handleDownload} className="download-button">
        Download Markdown
      </button>
    </div>
  )
}