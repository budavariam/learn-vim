import data from './data.json'
import { useEffect, useReducer, useRef } from 'react'
import Fuse from 'fuse.js'
import parse from 'html-react-parser'
import DualRangeSlider from './DualRangeSlider'
import TableOfContents from './components/TableOfContents'

const options = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.4,
  ignoreFieldNorm: true,
  keys: [
    { name: 'solution', weight: 0.4 },
    { name: 'question', weight: 0.4 },
    { name: 'category', weight: 0.2 }
  ]
}

const fuzzy = (search, fuse) => {
  const result = fuse.search(search)
  return result
    .filter(item => (1 - item.score) >= 0.6)
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

const slugify = (text) => {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

const MEMORY_ITEMS_KEY = 'memorizeItems'

const getMemoryItems = () => {
  try {
    if (typeof localStorage === 'undefined') return []
    return JSON.parse(localStorage.getItem(MEMORY_ITEMS_KEY) || '[]')
  } catch {
    return []
  }
}

/* ──────────────────── reducer ──────────────────── */

const initialState = {
  search: "",
  darkMode: false,
  knownItems: new Set(),
  memoryItemIds: getMemoryItems(),
  isMemoryModalOpen: false,
  showUnknownOnly: false,
  levelRange: [0, 9],
  isTocOpen: false,
  isSideTocCollapsed: false,
  collapsedCategories: new Set()
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, collapsedCategories: new Set() };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_KNOWN_ITEMS':
      return { ...state, knownItems: action.payload };
    case 'SET_MEMORY_ITEMS':
      return { ...state, memoryItemIds: action.payload };
    case 'ADD_MEMORY_ITEM': {
      if (state.memoryItemIds.includes(action.payload)) return state;
      return { ...state, memoryItemIds: [...state.memoryItemIds, action.payload] };
    }
    case 'REMOVE_MEMORY_ITEM':
      return {
        ...state,
        memoryItemIds: state.memoryItemIds.filter(id => id !== action.payload)
      };
    case 'MOVE_MEMORY_ITEM': {
      const items = [...state.memoryItemIds];
      const [movedItem] = items.splice(action.payload.from, 1);
      items.splice(action.payload.to, 0, movedItem);
      return { ...state, memoryItemIds: items };
    }
    case 'SET_MEMORY_MODAL_OPEN':
      return { ...state, isMemoryModalOpen: action.payload };
    case 'TOGGLE_KNOWN': {
      const newSet = new Set(state.knownItems);
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload);
      } else {
        newSet.add(action.payload);
      }
      return { ...state, knownItems: newSet };
    }
    case 'TOGGLE_SHOW_UNKNOWN':
      return { ...state, showUnknownOnly: !state.showUnknownOnly };
    case 'SET_LEVEL_RANGE':
      return { ...state, levelRange: action.payload };
    case 'SET_TOC_OPEN':
      return { ...state, isTocOpen: action.payload };
    case 'TOGGLE_SIDE_TOC':
      return { ...state, isSideTocCollapsed: !state.isSideTocCollapsed };
    case 'TOGGLE_CATEGORY': {
      const newSet = new Set(state.collapsedCategories);
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload);
      } else {
        newSet.add(action.payload);
      }
      return { ...state, collapsedCategories: newSet };
    }
    case 'SET_COLLAPSED_CATEGORIES':
      return { ...state, collapsedCategories: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    search, darkMode, knownItems, memoryItemIds, isMemoryModalOpen, showUnknownOnly,
    levelRange, isTocOpen, isSideTocCollapsed, collapsedCategories
  } = state;
  const searchInputRef = useRef(null)
  const draggedMemoryIndexRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    dispatch({ type: 'SET_DARK_MODE', payload: saved ? JSON.parse(saved) : prefersDark });
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
    dispatch({ type: 'SET_KNOWN_ITEMS', payload: new Set(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('knownItems', JSON.stringify([...knownItems]));
  }, [knownItems]);

  useEffect(() => {
    localStorage.setItem(MEMORY_ITEMS_KEY, JSON.stringify(memoryItemIds));
  }, [memoryItemIds]);

  useEffect(() => {
    const saved = localStorage.getItem('levelRange');
    if (saved) dispatch({ type: 'SET_LEVEL_RANGE', payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('levelRange', JSON.stringify(levelRange));
  }, [levelRange]);


  const result = search === "" ? preparedData : fuzzy(search, fuse)
  let filteredData = result;
  if (showUnknownOnly) {
    filteredData = filteredData.filter((item) =>
      !knownItems.has(item.id)
    );
  }
  filteredData = filteredData.filter(
    item => item.level >= levelRange[0] && item.level <= levelRange[1]
  );

  const groupedData = groupByCategory(filteredData)
  const categories = Object.keys(groupedData)
  const itemsById = new Map(preparedData.map(item => [item.id, item]))
  const memoryItems = memoryItemIds
    .map(id => itemsById.get(id))
    .filter(Boolean)

  const toggleDarkMode = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !darkMode });
  }

  const toggleCategory = (category) => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: category });
  }

  const toggleAllCategories = () => {
    const allCategories = Object.keys(groupedData)
    if (collapsedCategories.size === allCategories.length) {
      dispatch({ type: 'SET_COLLAPSED_CATEGORIES', payload: new Set() });
    } else {
      dispatch({ type: 'SET_COLLAPSED_CATEGORIES', payload: new Set(allCategories) });
    }
  }

  const toggleKnown = (id) => {
    dispatch({ type: 'TOGGLE_KNOWN', payload: id });
  };

  const removeMemoryItem = (id) => {
    dispatch({ type: 'REMOVE_MEMORY_ITEM', payload: id });
  }

  const toggleMemoryItem = (id) => {
    dispatch({
      type: memoryItemIds.includes(id) ? 'REMOVE_MEMORY_ITEM' : 'ADD_MEMORY_ITEM',
      payload: id
    })
  }

  const handleCardClick = (event, id) => {
    if (event.altKey) {
      event.preventDefault()
      toggleMemoryItem(id)
      return
    }
    toggleKnown(id)
  }

  const handleMemoryDragStart = (index) => {
    draggedMemoryIndexRef.current = index
  }

  const handleMemoryDrop = (index) => {
    const from = draggedMemoryIndexRef.current
    draggedMemoryIndexRef.current = null
    if (from === null || from === index) return
    dispatch({ type: 'MOVE_MEMORY_ITEM', payload: { from, to: index } })
  }

  const showDesktopToc = categories.length > 1
  const viewportGutters = showDesktopToc ? 'xl:px-60' : 'xl:px-3'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <TableOfContents
        categories={categories}
        getHref={(category) => `#${slugify(category)}`}
        getCount={(category) => groupedData[category]?.length ?? 0}
        mobileOpen={isTocOpen}
        setMobileOpen={(open) => dispatch({ type: 'SET_TOC_OPEN', payload: open })}
        desktopCollapsed={isSideTocCollapsed}
        toggleDesktopCollapsed={() => dispatch({ type: 'TOGGLE_SIDE_TOC' })}
      />

      <div className={`w-full px-3 py-4 ${viewportGutters}`}>
        <div className="mx-auto max-w-7xl relative">
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
                className={`w-full px-3 py-2 pl-9 ${search ? 'pr-9' : ''} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                value={search}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                autoFocus
                ref={searchInputRef}
              />
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_SEARCH', payload: '' })
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {categories.length > 0 && (
                <button
                  onClick={() => dispatch({ type: 'SET_TOC_OPEN', payload: !isTocOpen })}
                  className="xl:hidden p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                  title="Table of Contents"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              {Object.keys(groupedData).length > 0 && (
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
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_UNKNOWN' })}
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
                    dispatch({ type: 'SET_KNOWN_ITEMS', payload: new Set() });
                  } else {
                    dispatch({ type: 'SET_KNOWN_ITEMS', payload: allItemIds });
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
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_MEMORY_MODAL_OPEN', payload: true })}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-200 dark:bg-amber-700 hover:bg-amber-300 dark:hover:bg-amber-600 text-amber-900 dark:text-amber-50 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs uppercase tracking-wide"
                title="Open short-term memorize list"
                aria-label={`Open short-term memorize list with ${memoryItems.length} cards`}
              >
                <span>Memorize</span>
                <span className="rounded-full bg-white/70 dark:bg-gray-900/40 px-1.5 py-0.5 text-[10px] leading-none">
                  {memoryItems.length}
                </span>
              </button>
              <a
                href="/learn-vim/game"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase tracking-wide"
              >
                Quiz
              </a>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
            {search && (
              <>
                {result.length} commands found
                {filteredData.length < result.length && ` (${filteredData.length} shown, others hidden by filters)`}
                {result.length === 0 && " (try adjusting your search)"}
              </>
            )}
            {!search && Object.keys(groupedData).length > 0 && `${Object.keys(groupedData).length} categories • ${filteredData.length} commands shown`}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
            Option-click a command to add or remove it from Memorize.
          </p>

          {/* Level range slider */}
          <div className="max-w-md mx-auto mb-3 px-2">
            <DualRangeSlider
              min={0}
              max={9}
              value={levelRange}
              onChange={(range) => dispatch({ type: 'SET_LEVEL_RANGE', payload: range })}
            />
            {(levelRange[0] !== 0 || levelRange[1] !== 9) && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                Filtering to levels {levelRange[0]}–{levelRange[1]} •{' '}
                <button onClick={() => dispatch({ type: 'SET_LEVEL_RANGE', payload: [0, 9] })} className="underline hover:text-gray-700 dark:hover:text-gray-300">
                  show all
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(groupedData).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category)

            return (
              <div
                key={category}
                id={slugify(category)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-20"
              >
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
                          onClick={(event) => handleCardClick(event, item.id)}
                          key={index}
                          title="Click to toggle learned. Option-click to toggle memorize mark."
                          className={`group p-2.5 rounded-md border cursor-pointer transition-all duration-200 ${memoryItemIds.includes(item.id)
                            ? 'ring-2 ring-amber-400 dark:ring-amber-500'
                            : ''
                            } ${knownItems.has(item.id)
                            ? 'opacity-50 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-700/50 shadow-sm'
                            }`}
                        >
                          <div className="flex flex-wrap gap-1 mb-2 items-center">
                            {item.solution.map((combo, comboIndex) => (
                              <code key={comboIndex} className="keycombo text-xs">
                                {combo}
                              </code>
                            ))}
                            <span className="ml-auto text-xs font-mono text-gray-400 dark:text-gray-500 opacity-70">
                              {item.level}
                            </span>
                            {memoryItemIds.includes(item.id) && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                                Memo
                              </span>
                            )}
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

      {isMemoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-gray-950/40 px-3 py-8 backdrop-blur-sm sm:items-center"
          onClick={() => dispatch({ type: 'SET_MEMORY_MODAL_OPEN', payload: false })}
        >
          <section
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-modal-title"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div>
                <h2 id="memory-modal-title" className="text-base font-semibold text-gray-900 dark:text-white">
                  Memorize
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {memoryItems.length} short-term card{memoryItems.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_MEMORY_MODAL_OPEN', payload: false })}
                className="rounded-md p-1.5 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label="Close memorize list"
                title="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[calc(85vh-74px)] overflow-y-auto p-4">
              {memoryItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  Option-click commands to collect them here.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {memoryItems.map((item, index) => (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={() => handleMemoryDragStart(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleMemoryDrop(index)}
                      className="rounded-md border border-amber-300 bg-amber-50 p-3 shadow-sm transition-colors duration-200 hover:border-amber-400 dark:border-amber-700/70 dark:bg-amber-900/20"
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <span className="cursor-grab rounded bg-amber-100 px-1.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-800/60 dark:text-amber-100" title="Drag to reorder">
                          {index + 1}
                        </span>
                        <div className="flex flex-1 flex-wrap gap-1">
                          {item.solution.map((combo, comboIndex) => (
                            <code key={comboIndex} className="keycombo text-xs">
                              {combo}
                            </code>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMemoryItem(item.id)}
                          className="rounded p-1 text-gray-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900/40 dark:hover:text-red-300"
                          aria-label={`Remove ${item.solution.join(', ')} from memorize list`}
                          title="Remove mark"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                        {parse(item.question)}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.category} • Level {item.level}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
