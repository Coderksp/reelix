const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

export const IMG = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : ''

async function get(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'Missing TMDB API key. Copy .env.example to .env and add VITE_TMDB_API_KEY.'
    )
  }
  const url = new URL(BASE + path)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`)
  return res.json()
}

// The rails shown on the home page. Each is a TMDB endpoint.
export const CATEGORIES = [
  { id: 'trending', title: 'Trending now', path: '/trending/movie/week' },
  { id: 'top_rated', title: 'Critically acclaimed', path: '/movie/top_rated' },
  { id: 'popular', title: 'Popular this month', path: '/movie/popular' },
  { id: 'action', title: 'Adrenaline rush', path: '/discover/movie', params: { with_genres: 28, sort_by: 'popularity.desc' } },
  { id: 'comedy', title: 'Feel-good comedies', path: '/discover/movie', params: { with_genres: 35, sort_by: 'popularity.desc' } },
  { id: 'scifi', title: 'Worlds beyond', path: '/discover/movie', params: { with_genres: 878, sort_by: 'popularity.desc' } },
  { id: 'horror', title: 'After dark', path: '/discover/movie', params: { with_genres: 27, sort_by: 'popularity.desc' } },
]

export async function fetchCategory(cat) {
  const data = await get(cat.path, cat.params || {})
  return data.results.filter((m) => m.backdrop_path || m.poster_path)
}

export async function fetchFeatured() {
  const data = await get('/trending/movie/week')
  const withBackdrop = data.results.filter((m) => m.backdrop_path && m.overview)
  return withBackdrop[Math.floor(Math.random() * Math.min(5, withBackdrop.length))]
}

// Returns a YouTube key for the best available trailer, or null.
const trailerCache = new Map()
export async function fetchTrailerKey(movieId) {
  if (trailerCache.has(movieId)) return trailerCache.get(movieId)
  const data = await get(`/movie/${movieId}/videos`)
  const vids = data.results || []
  const pick =
    vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    vids.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
    vids.find((v) => v.site === 'YouTube')
  const key = pick ? pick.key : null
  trailerCache.set(movieId, key)
  return key
}

export async function searchMovies(query) {
  if (!query.trim()) return []
  const data = await get('/search/movie', { query, include_adult: false })
  return data.results.filter((m) => m.poster_path || m.backdrop_path)
}

// Full detail payload for the modal: overview, runtime, genres, cast and reviews
// all in one request via TMDB's append_to_response.
const detailsCache = new Map()
export async function fetchMovieDetails(movieId) {
  if (detailsCache.has(movieId)) return detailsCache.get(movieId)
  const data = await get(`/movie/${movieId}`, {
    append_to_response: 'credits,reviews',
  })
  detailsCache.set(movieId, data)
  return data
}

// Letterboxd has no public API, but this redirect resolves a TMDB id to the
// film's Letterboxd page. Handy for a "view reviews on Letterboxd" link.
export const letterboxdUrl = (tmdbId) => `https://letterboxd.com/tmdb/${tmdbId}/`
