import data from './data.json'
import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'
import parse from 'html-react-parser'

const options = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.15, // Changed to 0.15 for 85% match (1 - 0.85 = 0.15)
  keys: [
    { name: 'solution', weight: 0.4 },    // Highest priority for key combos
    { name: 'question', weight: 0.4 },    // High priority for descriptions  
    { name: 'category', weight: 0.2 }     // Lower priority for categories
  ]
}

const fuzzy = (search, fuse) => {
  const result = fuse.search(search)
  return result
    .filter(item => (1 - item.score) >= 0.85) // Filter for 85% or higher match
    .map(line => ({ ...line.item, score: line.score }))
}

const prepareData = (data) => {
  return data.map(elem => {
    const q = elem.question.replace(/`(.*?)`/g, `<span class="reference">$1</span>`)
    return { ...elem, question: q }
  })
}

const preparedData = prepareData(data)
const fuse = new Fuse(preparedData, options)

// Group data by category
const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})
}

function App() {
  const [search, setSearch] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState(new Set())

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(saved ? JSON.parse(saved) : prefersDark)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const result = search === "" ? preparedData : fuzzy(search, fuse)
  const groupedData = groupByCategory(result)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Toggle category collapse state
  const toggleCategory = (category) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Expand all categories when searching
  useEffect(() => {
    if (search) {
      setCollapsedCategories(new Set())
    }
  }, [search])

  // Collapse/Expand all categories
  const toggleAllCategories = () => {
    const allCategories = Object.keys(groupedData)
    if (collapsedCategories.size === allCategories.length) {
      // All collapsed, expand all
      setCollapsedCategories(new Set())
    } else {
      // Some or none collapsed, collapse all
      setCollapsedCategories(new Set(allCategories))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Vim Cheat Sheet
          </h1>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Type to search commands..."
                className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-3">
              {/* Expand/Collapse All Button */}
              {!search && Object.keys(groupedData).length > 0 && (
                <button
                  onClick={toggleAllCategories}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  title={collapsedCategories.size === Object.keys(groupedData).length ? "Expand all categories" : "Collapse all categories"}
                >
                  {collapsedCategories.size === Object.keys(groupedData).length ? (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <a
                href="/learn-vim/game"
                className="quiz-button inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm uppercase tracking-wide"
              >
                Quiz
              </a>
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {search && `${result.length} commands found`}
            {search && result.length === 0 && " (try adjusting your search)"}
            {!search && Object.keys(groupedData).length > 0 && `${Object.keys(groupedData).length} categories • ${result.length} total commands`}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          {Object.entries(groupedData).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category)

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Category Header - Clickable */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-650 dark:hover:to-gray-750 transition-all duration-200"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    {/* Collapse/Expand Icon */}
                    <svg
                      className={`w-5 h-5 mr-3 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {category}
                    <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                      {items.length} command{items.length !== 1 ? 's' : ''}
                    </span>
                  </h2>
                </button>

                {/* Commands Grid - Collapsible */}
                <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-none'}`}>
                  <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="group p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-800"
                        >
                          {/* Key combinations */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.solution.map((combo, comboIndex) => (
                              <code key={comboIndex} className="keycombo">
                                {combo}
                              </code>
                            ))}
                          </div>

                          {/* Description */}
                          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {parse(item.question)}
                          </div>

                          {/* Score (if searching) */}
                          {item.score && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Match: {Math.round((1 - item.score) * 100)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {Object.keys(groupedData).length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No commands found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or browse all categories above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
