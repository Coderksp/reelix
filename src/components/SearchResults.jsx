import { motion } from 'framer-motion'
import MovieCard from './MovieCard'

export default function SearchResults({ query, results }) {
  return (
    <section style={{ padding: '6.5rem clamp(1rem, 4vw, 3rem) 3rem', minHeight: '80vh' }}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', marginBottom: 24,
        }}
      >
        Results for <span className="grad-text">“{query}”</span>
      </motion.h2>

      {results.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: 16 }}>
          No films found. Try another title.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 18,
          }}
        >
          {results.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
