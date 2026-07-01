import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMG, fetchMovieDetails, letterboxdUrl } from '../api/tmdb'

export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch full details whenever a new movie is opened.
  useEffect(() => {
    if (!movie) return
    let cancelled = false
    setDetails(null)
    setLoading(true)
    fetchMovieDetails(movie.id)
      .then((d) => { if (!cancelled) setDetails(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [movie])

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!movie) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [movie, onClose])

  const data = details || movie || {}
  const year = data.release_date ? data.release_date.slice(0, 4) : ''
  const rating = data.vote_average ? data.vote_average.toFixed(1) : null
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : null
  const genres = data.genres || []
  const cast = details?.credits?.cast?.slice(0, 6) || []
  const reviews = details?.reviews?.results || []

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: 'clamp(1rem, 5vh, 4rem) 1rem',
            background: 'rgba(5,3,10,0.75)',
            backdropFilter: 'blur(8px)',
            overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(860px, 100%)',
              background: 'var(--bg-soft)',
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(168,85,247,0.25)',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8)',
            }}
          >
            {/* Backdrop header */}
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'var(--surface)' }}>
              {data.backdrop_path && (
                <img
                  src={IMG(data.backdrop_path, 'w780')}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, var(--bg-soft) 4%, rgba(20,11,34,0.2) 55%, transparent)',
              }} />
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(10,6,18,0.6)', backdropFilter: 'blur(8px)',
                  color: 'var(--text)', fontSize: 20, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', marginTop: '-3rem', position: 'relative' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.1, marginBottom: 12,
              }}>
                {data.title}
              </h2>

              {data.tagline && (
                <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: 14 }}>
                  {data.tagline}
                </p>
              )}

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center',
                fontSize: 14, marginBottom: 18,
              }}>
                {rating && <span style={{ color: 'var(--amber)', fontWeight: 700 }}>★ {rating}</span>}
                {year && <span style={{ color: 'var(--text-dim)' }}>{year}</span>}
                {runtime && <span style={{ color: 'var(--text-dim)' }}>{runtime}</span>}
                {genres.map((g) => (
                  <span key={g.id} style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 12.5,
                    border: '1px solid rgba(168,85,247,0.35)', color: 'var(--text)',
                  }}>
                    {g.name}
                  </span>
                ))}
              </div>

              {data.overview && (
                <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: 22, maxWidth: 680 }}>
                  {data.overview}
                </p>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div style={{ marginBottom: 26 }}>
                  <h3 style={sectionTitle}>Cast</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
                    {cast.map((c) => (
                      <span key={c.id} style={{ fontSize: 14 }}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        {c.character && (
                          <span style={{ color: 'var(--text-dim)' }}> as {c.character}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div style={{ marginBottom: 22 }}>
                <h3 style={sectionTitle}>Reviews</h3>
                {loading && (
                  <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Loading reviews…</p>
                )}
                {!loading && reviews.length === 0 && (
                  <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
                    No written reviews yet — try Letterboxd below.
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {reviews.slice(0, 3).map((r) => (
                    <Review key={r.id} review={r} />
                  ))}
                </div>
              </div>

              <a
                href={letterboxdUrl(data.id)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 20px', borderRadius: 999,
                  background: 'linear-gradient(100deg, var(--magenta), var(--violet))',
                  color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
                }}
              >
                View on Letterboxd ↗
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const sectionTitle = {
  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--text-dim)', marginBottom: 12,
}

function Review({ review }) {
  const [expanded, setExpanded] = useState(false)
  const long = review.content.length > 360
  const text = expanded || !long ? review.content : review.content.slice(0, 360) + '…'
  const stars = review.author_details?.rating

  return (
    <div style={{
      padding: 14, borderRadius: 12,
      background: 'rgba(26,16,41,0.6)', border: '1px solid rgba(168,85,247,0.15)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{review.author}</span>
        {stars != null && (
          <span style={{ color: 'var(--amber)', fontSize: 13, fontWeight: 600 }}>★ {stars}/10</span>
        )}
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-dim)', whiteSpace: 'pre-wrap' }}>
        {text}
      </p>
      {long && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--cyan)', fontSize: 13 }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
