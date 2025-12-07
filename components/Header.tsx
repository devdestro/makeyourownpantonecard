'use client'

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <a
            href="https://github.com/devdestro"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yunus-emre-kuru-a33341217/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            LinkedIn
          </a>
          <a
            href="https://www.behance.net/ynsemrekru"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            Behance
          </a>
          <a
            href="https://buymeacoffee.com/devdestro"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link"
          >
            Buy Me a Coffee
          </a>
        </nav>
      </div>
    </header>
  )
}

