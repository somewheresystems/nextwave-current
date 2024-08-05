import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type LayoutProps = {
  children: React.ReactNode
  fullWidth?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="layout">
      <header>
        <div className="header-image">
          <Image
            src="/nw-banner.png"
            alt="Next Wave Header"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/editor">Editor</Link>
        </nav>
      </header>
      <main className={fullWidth ? 'full-width' : ''}>{children}</main>
      <footer>
        A community project powered by Somewhere Systems
      </footer>
    </div>
  )
}

export default Layout