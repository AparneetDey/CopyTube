import { createContext, useContext, useState } from "react"

const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const value = {
    searchQuery,
    setSearchQuery
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)

