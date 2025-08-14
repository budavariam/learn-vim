import data from './data.json'
import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'
import parse from 'html-react-parser'

const options = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.15,
  keys: [
    { name: 'solution', weight: 0.4 },
    { name: 'question', weight: 0.4 },
    { name: 'category', weight: 0.2 }
  ]
}

const fuzzy = (search, fuse) => {
  const result = fuse.search(search)
  return result
    .filter(item => (1 - item.score) >= 0.85)
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
  const [knownItems, setKnownItems] = useState(new Set());
  const [showUnknownOnly, setShowUnknownOnly] = useState(false);

  const [collapsedCategories, setCollapsedCategories] = useState(new Set())

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(saved ? JSON.parse(saved) : prefersDark)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('knownItems') || '[]');
    setKnownItems(new Set(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('knownItems', JSON.stringify([...knownItems]));
  }, [knownItems]);


  const result = search === "" ? preparedData : fuzzy(search, fuse)
  let filteredData = result;
  if (showUnknownOnly) {
    filteredData = result.filter((item) =>
      !knownItems.has(item.id)
    );
  }

  const groupedData = groupByCategory(filteredData)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

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

  useEffect(() => {
    if (search) {
      setCollapsedCategories(new Set())
    }
  }, [search])

  const toggleAllCategories = () => {
    const allCategories = Object.keys(groupedData)
    if (collapsedCategories.size === allCategories.length) {
      setCollapsedCategories(new Set())
    } else {
      setCollapsedCategories(new Set(allCategories))
    }
  }

  const toggleKnown = (id) => {
    setKnownItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-3 py-4 max-w-7xl relative">
        <a
          href="https://github.com/budavariam/learn-vim"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          title="View on GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Vim Cheat Sheet
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Type to search commands..."
                className="w-full px-3 py-2 pl-9 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              {!search && Object.keys(groupedData).length > 0 && (
                <button
                  onClick={toggleAllCategories}
                  className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  title={collapsedCategories.size === Object.keys(groupedData).length ? "Expand all categories" : "Collapse all categories"}
                >
                  {collapsedCategories.size === Object.keys(groupedData).length ? (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowUnknownOnly(v => !v)}
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                title={showUnknownOnly ? "Show all commands" : "Show only unknown"}
              >
                <svg className={`w-4 h-4 ${showUnknownOnly ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 2a7 7 0 00-7 7c0 2.485 1.355 4.66 3.367 5.828L8 20h8l-.367-5.172A7.002 7.002 0 0019 9a7 7 0 00-7-7z" />
                </svg>
              </button>

              <button
                onClick={() => {
                  const allItemIds = new Set(preparedData.map(item => item.id));
                  const allKnown = [...allItemIds].every(id => knownItems.has(id));

                  if (allKnown) {
                    setKnownItems(new Set()); // Reset - mark all as unknown
                  } else {
                    setKnownItems(allItemIds); // Mark all as known
                  }
                }}
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                title={(() => {
                  const allItemIds = new Set(preparedData.map(item => item.id));
                  const allKnown = [...allItemIds].every(id => knownItems.has(id));
                  return allKnown ? "Reset - mark all as unknown" : "Mark all as known";
                })()}
              >
                {(() => {
                  const allItemIds = new Set(preparedData.map(item => item.id));
                  const allKnown = [...allItemIds].every(id => knownItems.has(id));
                  return allKnown ? "🔄" : "✅";
                })()}
              </button>

              <a
                href="/vimtutor"
                className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs uppercase tracking-wide"
              >
                Vimtutor
              </a>
              <a
                href="/learn-vim/game"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase tracking-wide"
              >
                Quiz
              </a>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
            {search && `${result.length} commands found`}
            {search && result.length === 0 && " (try adjusting your search)"}
            {!search && Object.keys(groupedData).length > 0 && `${Object.keys(groupedData).length} categories • ${result.length} total commands`}
          </p>
        </div>

        <div className="space-y-2">
          {Object.entries(groupedData).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category)

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-600 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-650 dark:hover:to-gray-750 transition-all duration-200"
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg
                      className={`w-4 h-4 mr-2 flex-shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {category}
                    <span className="ml-auto text-xs font-normal text-gray-500 dark:text-gray-400">
                      {items.length} command{items.length !== 1 ? 's' : ''}
                    </span>
                  </h2>
                </button>

                <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-none'}`}>
                  <div className="p-3">
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((item, index) => (
                        <div
                          onClick={() => toggleKnown(item.id)}
                          key={index}
                          // className="group p-2.5 rounded-md border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-800"
                          className={`group p-2.5 rounded-md border cursor-pointer transition-all duration-200 ${knownItems.has(item.id)
                            ? 'opacity-50 bg-gray-200 dark:bg-gray-700'
                            : 'bg-yellow-50 dark:bg-yellow-900 border-yellow-400'
                            }`}
                        >
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.solution.map((combo, comboIndex) => (
                              <code key={comboIndex} className="keycombo text-xs">
                                {combo}
                              </code>
                            ))}
                          </div>

                          <div className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            {parse(item.question)}
                          </div>

                          {item.score && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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

        {Object.keys(groupedData).length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No commands found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try adjusting your search terms or browse all categories above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
