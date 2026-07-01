import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMG, fetchTrailerKey } from '../api/tmdb'
import { useOpenMovie } from '../movieModal'

export default function MovieCard({ movie, index }) {
  const [hovered, setHovered] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [showFrame, setShowFrame] = useState(false)
  const hoverTimer = useRef(null)
  const openMovie = useOpenMovie()

  const year = movie.release_date ? movie.release_date.slice(0, 4) : ''
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

  const onEnter = useCallback(() => {
    setHovered(true)
    // Small delay so quickly scanning the mouse across cards doesn't fire trailers.
    hoverTimer.current = setTimeout(async () => {
      try {
        const key = await fetchTrailerKey(movie.id)
        if (key) {
          setTrailerKey(key)
          setShowFrame(true)
        }
      } catch (_) {
        /* no trailer — poster stays */
      }
    }, 600)
  }, [movie.id])

  const onLeave = useCallback(() => {
    clearTimeout(hoverTimer.current)
    setHovered(false)
    setShowFrame(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.04 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => openMovie(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openMovie(movie) }}
      animate={{ scale: hovered ? 1.08 : 1, zIndex: hovered ? 20 : 1 }}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: 'clamp(150px, 18vw, 230px)',
        aspectRatio: '2 / 3',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--surface)',
        boxShadow: hovered
          ? '0 18px 50px -12px rgba(255,46,147,0.45), 0 0 0 1px rgba(168,85,247,0.5)'
          : '0 6px 20px -8px rgba(0,0,0,0.6)',
      }}
    >
      <img
        src={IMG(movie.poster_path || movie.backdrop_path, 'w500')}
        alt={movie.title}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Inline trailer that fades in on hover */}
      <AnimatePresence>
        {showFrame && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: '#000' }}
          >
            <iframe
              title={`${movie.title} trailer`}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '180%',
                height: '180%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient + info overlay, brighter on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 14,
          background:
            'linear-gradient(to top, rgba(10,6,18,0.95) 8%, rgba(10,6,18,0.4) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      >
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
          lineHeight: 1.2, marginBottom: 6,
        }}>
          {movie.title}
        </h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
          {rating && <span style={{ color: 'var(--amber)', fontWeight: 600 }}>★ {rating}</span>}
          {year && <span style={{ color: 'var(--text-dim)' }}>{year}</span>}
        </div>
      </motion.div>

      {/* Colorful top accent line that animates in */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          transformOrigin: 'left',
          background: 'linear-gradient(90deg, var(--magenta), var(--violet), var(--cyan))',
        }}
      />
    </motion.div>
  )
}
