import data from './data.json'
import { useEffect, useReducer, useRef } from 'react'
import Fuse from 'fuse.js'
import parse from 'html-react-parser'
import DualRangeSlider from './DualRangeSlider'
import Navbar from './components/Navbar'
import TableOfContents from './components/TableOfContents'
import KeyboardModal from './components/KeyboardModal'
import InfoModal from './components/InfoModal'
import { getCategoryColor } from './constants'

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
  isKeyboardOpen: false,
  isInfoOpen: false,
  showUnknownOnly: false,
  levelRange: [0, 9],
  isTocOpen: false,
  isSideTocCollapsed: false,
  activeCategory: null,
  collapsedCategories: new Set(),
  activeSectionFilter: null,
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
    case 'SET_KEYBOARD_OPEN':
      return { ...state, isKeyboardOpen: action.payload };
    case 'SET_INFO_OPEN':
      return { ...state, isInfoOpen: action.payload };
    case 'SET_SECTION_FILTER':
      // payload: array of selected category strings, or null to clear
      if (!action.payload || action.payload.length === 0)
        return { ...state, activeSectionFilter: null }
      return { ...state, activeSectionFilter: new Set(action.payload) }
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
    case 'SET_ACTIVE_CATEGORY':
      if (state.activeCategory === action.payload) return state;
      return { ...state, activeCategory: action.payload };
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
    search, darkMode, knownItems, memoryItemIds, isMemoryModalOpen, isKeyboardOpen, isInfoOpen,
    showUnknownOnly, levelRange, isTocOpen, isSideTocCollapsed, activeCategory,
    collapsedCategories, activeSectionFilter
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
  if (activeSectionFilter) {
    filteredData = filteredData.filter(item => activeSectionFilter.has(item.category))
  }

  const groupedData = groupByCategory(filteredData)
  const categories = Object.keys(groupedData)
  const categoryKey = categories.join('|')
  const allCategories = [...new Set(preparedData.map(item => item.category))]
  const itemsById = new Map(preparedData.map(item => [item.id, item]))
  const memoryItems = memoryItemIds
    .map(id => itemsById.get(id))
    .filter(Boolean)

  useEffect(() => {
    const trackedCategories = categoryKey ? categoryKey.split('|') : []

    const updateActiveCategory = () => {
      if (trackedCategories.length === 0) {
        dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: null })
        return
      }

      const currentCategory = trackedCategories.reduce((active, category) => {
        const section = document.getElementById(slugify(category))
        if (!section) return active

        const top = section.getBoundingClientRect().top
        if (top <= 140) return category
        return active
      }, trackedCategories[0])

      dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: currentCategory })
    }

    updateActiveCategory()
    window.addEventListener('scroll', updateActiveCategory, { passive: true })
    window.addEventListener('resize', updateActiveCategory)

    return () => {
      window.removeEventListener('scroll', updateActiveCategory)
      window.removeEventListener('resize', updateActiveCategory)
    }
  }, [categoryKey])

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

      <Navbar
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
        memoryItemCount={memoryItems.length}
        onKeyboardOpen={() => dispatch({ type: 'SET_KEYBOARD_OPEN', payload: true })}
        onMemorizeOpen={() => dispatch({ type: 'SET_MEMORY_MODAL_OPEN', payload: true })}
        onInfoOpen={() => dispatch({ type: 'SET_INFO_OPEN', payload: true })}
        search={search}
        onSearchChange={(v) => dispatch({ type: 'SET_SEARCH', payload: v })}
        showUnknownOnly={showUnknownOnly}
        onToggleUnknown={() => dispatch({ type: 'TOGGLE_SHOW_UNKNOWN' })}
        allKnown={(() => { const ids = new Set(preparedData.map(i => i.id)); return [...ids].every(id => knownItems.has(id)) })()}
        onMarkAll={() => {
          const ids = new Set(preparedData.map(i => i.id))
          const allKnown = [...ids].every(id => knownItems.has(id))
          dispatch({ type: 'SET_KNOWN_ITEMS', payload: allKnown ? new Set() : ids })
        }}
        hasGroupedData={Object.keys(groupedData).length > 0}
        allCollapsed={collapsedCategories.size === Object.keys(groupedData).length}
        onToggleAll={toggleAllCategories}
      />

      <TableOfContents
        categories={categories}
        getHref={(category) => `#${slugify(category)}`}
        getCount={(category) => groupedData[category]?.length ?? 0}
        mobileOpen={isTocOpen}
        setMobileOpen={(open) => dispatch({ type: 'SET_TOC_OPEN', payload: open })}
        desktopCollapsed={isSideTocCollapsed}
        toggleDesktopCollapsed={() => dispatch({ type: 'TOGGLE_SIDE_TOC' })}
        activeCategory={activeCategory}
      />

      <div className={`w-full px-3 py-4 ${viewportGutters}`}>
        <div className="mx-auto max-w-7xl">

          {/* ── Filter bar ── */}
          {/* Search + utility buttons: mobile only (desktop has them in the navbar) */}
          <div className="flex sm:hidden items-center gap-1.5 mb-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search commands…"
                className={`w-full py-1.5 pl-8 ${search ? 'pr-8' : 'pr-3'} text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                value={search}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                ref={searchInputRef}
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => { dispatch({ type: 'SET_SEARCH', payload: '' }); searchInputRef.current?.focus() }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile TOC toggle */}
            {categories.length > 0 && (
              <button
                onClick={() => dispatch({ type: 'SET_TOC_OPEN', payload: !isTocOpen })}
                className="xl:hidden p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex-shrink-0"
                title="Table of Contents"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Unknown only */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SHOW_UNKNOWN' })}
              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${showUnknownOnly ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              title={showUnknownOnly ? 'Show all commands' : 'Show only unknown'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a7 7 0 00-7 7c0 2.485 1.355 4.66 3.367 5.828L8 20h8l-.367-5.172A7.002 7.002 0 0019 9a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Mark all / reset */}
            {(() => {
              const allItemIds = new Set(preparedData.map(item => item.id))
              const allKnown = [...allItemIds].every(id => knownItems.has(id))
              return (
                <button
                  onClick={() => dispatch({ type: 'SET_KNOWN_ITEMS', payload: allKnown ? new Set() : allItemIds })}
                  className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm flex-shrink-0"
                  title={allKnown ? 'Reset — mark all as unknown' : 'Mark all as known'}
                >
                  {allKnown ? '🔄' : '✅'}
                </button>
              )
            })()}

            {/* Collapse all */}
            {Object.keys(groupedData).length > 0 && (
              <button
                onClick={toggleAllCategories}
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                title={collapsedCategories.size === Object.keys(groupedData).length ? 'Expand all' : 'Collapse all'}
              >
                {collapsedCategories.size === Object.keys(groupedData).length
                  ? <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  : <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                }
              </button>
            )}
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

          {/* Category filter */}
          <div className="flex items-start gap-2 mb-3">
            <label htmlFor="category-filter" className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap pt-1.5">
              Category:
            </label>
            <select
              id="category-filter"
              multiple
              size={4}
              value={activeSectionFilter ? [...activeSectionFilter] : []}
              onChange={e => {
                const selected = [...e.target.selectedOptions].map(o => o.value)
                dispatch({ type: 'SET_SECTION_FILTER', payload: selected })
              }}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-24 min-w-[10rem]"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {activeSectionFilter && (
              <button
                onClick={() => dispatch({ type: 'SET_SECTION_FILTER', payload: null })}
                className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mt-0.5"
              >
                Clear
              </button>
            )}
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

                    <span
                      className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
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
                          style={{ borderLeftColor: getCategoryColor(category), borderLeftWidth: '3px' }}
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

      {isKeyboardOpen && (
        <KeyboardModal
          data={preparedData}
          knownItems={knownItems}
          memoryItemIds={memoryItemIds}
          onClose={() => dispatch({ type: 'SET_KEYBOARD_OPEN', payload: false })}
        />
      )}

      {isInfoOpen && (
        <InfoModal onClose={() => dispatch({ type: 'SET_INFO_OPEN', payload: false })} />
      )}

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
