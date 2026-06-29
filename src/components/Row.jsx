import { useRef } from 'react'
import { motion } from 'framer-motion'
import MovieCard from './MovieCard'

export default function Row({ title, movies, anchorId }) {
  const railRef = useRef(null)

  const scrollBy = (dir) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (!movies || movies.length === 0) return null

  return (
    <section id={anchorId} style={{ margin: '2.5rem 0', position: 'relative' }}>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)',
          letterSpacing: '-0.02em',
          margin: '0 clamp(1rem, 4vw, 3rem) 1rem',
        }}
      >
        {title}
      </motion.h2>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="rail-arrow"
          style={{ left: 8 }}
        >
          ‹
        </button>

        <div
          ref={railRef}
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '12px clamp(1rem, 4vw, 3rem) 28px',
            scrollSnapType: 'x proximity',
          }}
        >
          {movies.map((m, i) => (
            <div key={m.id} style={{ scrollSnapAlign: 'start' }}>
              <MovieCard movie={m} index={i} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="rail-arrow"
          style={{ right: 8 }}
        >
          ›
        </button>
      </div>

      <style>{`
        section div::-webkit-scrollbar { display: none; }
        .rail-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(168,85,247,0.4);
          background: rgba(10,6,18,0.7);
          backdrop-filter: blur(8px);
          color: var(--text);
          font-size: 26px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s, background 0.25s;
        }
        section:hover .rail-arrow { opacity: 1; }
        .rail-arrow:hover { background: rgba(168,85,247,0.35); }
        @media (hover: none) { .rail-arrow { display: none; } }
      `}</style>
    </section>
  )
}
