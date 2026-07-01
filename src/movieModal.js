import { createContext, useContext } from 'react'

// Provides the "open this movie in the detail modal" callback to any MovieCard,
// wherever it lives in the tree (home rails or search results).
export const MovieModalContext = createContext(() => {})
export const useOpenMovie = () => useContext(MovieModalContext)
