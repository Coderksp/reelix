import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => onSearch(query), 350)
    return () => clearTimeout(t)
  }, [query, onSearch])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem clamp(1rem, 4vw, 3rem)',
        background: scrolled ? 'rgba(10,6,18,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(168,85,247,0.18)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}
    >
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'conic-gradient(from 180deg, #ff2e93, #a855f7, #00e5ff, #ff2e93)',
          display: 'inline-block',
        }} />
        <span className="grad-text" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em',
        }}>
          Reelix
        </span>
      </a>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          style={{ position: 'absolute', left: 14, opacity: 0.6 }}>
          <circle cx="11" cy="11" r="7" stroke="#a99bc4" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="#a99bc4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search films…"
          aria-label="Search films"
          style={{
            background: 'rgba(26,16,41,0.7)',
            border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: 999,
            color: 'var(--text)',
            padding: '10px 16px 10px 40px',
            width: 'clamp(140px, 32vw, 280px)',
            fontSize: 14,
            outline: 'none',
          }}
        />
      </div>
    </motion.nav>
  )
}
