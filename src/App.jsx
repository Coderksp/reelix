import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Row from './components/Row'
import SearchResults from './components/SearchResults'
import MovieModal from './components/MovieModal'
import { MovieModalContext } from './movieModal'
import {
  CATEGORIES,
  fetchCategory,
  fetchFeatured,
  searchMovies,
} from './api/tmdb'

export default function App() {
  const [featured, setFeatured] = useState(null)
  const [rows, setRows] = useState({})
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const feat = await fetchFeatured()
        if (!cancelled) setFeatured(feat)
        for (const cat of CATEGORIES) {
          const movies = await fetchCategory(cat)
          if (cancelled) return
          setRows((prev) => ({ ...prev, [cat.id]: movies }))
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSearch = useCallback(async (q) => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    try {
      const r = await searchMovies(q)
      setResults(r)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  return (
    <MovieModalContext.Provider value={setSelected}>
    <div className="app">
      <div className="aurora"><span /><span /><span /></div>
      <Navbar onSearch={handleSearch} />

      {error && (
        <div style={{
          margin: '6rem auto 0', maxWidth: 560, textAlign: 'center',
          padding: '1.5rem', borderRadius: 14,
          border: '1px solid rgba(255,46,147,0.4)', background: 'rgba(255,46,147,0.08)',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8 }}>
            Couldn’t load films
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {query.trim() ? (
          <motion.main key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchResults query={query} results={results} />
          </motion.main>
        ) : (
          <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero movie={featured} />
            <div style={{ marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
              {CATEGORIES.map((cat) => (
                <Row
                  key={cat.id}
                  title={cat.title}
                  movies={rows[cat.id]}
                  anchorId={cat.id}
                />
              ))}
            </div>
            {loading && (
              <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
                Loading more films…
              </p>
            )}
          </motion.main>
        )}
      </AnimatePresence>

      <footer style={{
        textAlign: 'center', padding: '3rem 1rem 2rem',
        color: 'var(--text-dim)', fontSize: 13, borderTop: '1px solid rgba(168,85,247,0.15)',
      }}>
        <p>Built with React, Vite & Framer Motion · Data by{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer"
            style={{ color: 'var(--cyan)' }}>TMDB</a>
        </p>
      </footer>

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </div>
    </MovieModalContext.Provider>
  )
}
