import { motion } from 'framer-motion'
import { IMG } from '../api/tmdb'

export default function Hero({ movie }) {
  if (!movie) {
    return <div style={{ height: '90vh' }} />
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : ''
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

  return (
    <header
      id="top"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 clamp(1rem, 4vw, 3rem) clamp(3rem, 8vh, 6rem)',
        overflow: 'hidden',
      }}
    >
      <motion.img
        key={movie.id}
        src={IMG(movie.backdrop_path, 'original')}
        alt=""
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background:
            'linear-gradient(to top, var(--bg) 6%, rgba(10,6,18,0.55) 45%, rgba(10,6,18,0.2) 100%), linear-gradient(to right, rgba(10,6,18,0.85), transparent 60%)',
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
        }}
        style={{ maxWidth: 640 }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(255,46,147,0.15)', color: 'var(--magenta)',
            border: '1px solid rgba(255,46,147,0.35)',
          }}>
            Featured pick
          </span>
          {rating && (
            <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 14 }}>
              ★ {rating}
            </span>
          )}
          {year && <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{year}</span>}
        </motion.div>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            marginBottom: 18,
          }}
        >
          {movie.title}
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          style={{
            color: 'var(--text-dim)',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
            lineHeight: 1.6,
            marginBottom: 28,
            maxWidth: 540,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.overview}
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          style={{ display: 'flex', gap: 14 }}
        >
          <a
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
              padding: '13px 26px', borderRadius: 999, textDecoration: 'none',
              color: '#0a0612',
              background: 'linear-gradient(100deg, var(--magenta), var(--violet))',
            }}
          >
            ▶ Watch trailer
          </a>
          <a
            href="#trending"
            style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
              padding: '13px 26px', borderRadius: 999, textDecoration: 'none',
              color: 'var(--text)',
              background: 'rgba(244,238,251,0.1)',
              border: '1px solid rgba(244,238,251,0.2)',
            }}
          >
            Browse all
          </a>
        </motion.div>
      </motion.div>
    </header>
  )
}
