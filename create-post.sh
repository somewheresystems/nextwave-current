#!/bin/bash

# Generate date and slug
DATE=$(date +%Y%m%d)
SLUG=$(openssl rand -hex 3)
FILENAME="${DATE}-${SLUG}.md"

# Generate random hex color
COLOR=$(openssl rand -hex 3)

# Create content
cat << EOF > "posts/${FILENAME}"
---
title: "Welcome to My Blog: Markdown Formatting Guide"
date: $(date +"%Y-%m-%d")
tags: ["markdown", "guide", "formatting"]
author: "Admin"
color: "#${COLOR}"
---

# Welcome to Next Wave

This post serves as a guide to demonstrate the various markdown formatting options available for blog posts.

## Basic Formatting

You can make text **bold** or *italic*. You can also combine them for ***bold and italic***.

## Headers

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Lists

### Unordered List
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links

[Visit OpenAI](https://www.openai.com)

## Images

![Alt text for the image](https://example.com/image.jpg)

## Blockquotes

> This is a blockquote. You can use it to emphasize a quote or important information.

## Code

Inline \`code\` can be added with backticks.

For code blocks, use triple backticks:

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

## Horizontal Rule

---

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |

## Task Lists

- [x] Completed task
- [ ] Incomplete task

Remember, the formatting options available may depend on the markdown parser used in your blog setup. Adjust as needed!

Happy blogging!
EOF

# Create posts directory if it doesn't exist
mkdir -p posts

echo "Default post created: ${FILENAME}"