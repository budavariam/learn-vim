import { useEffect } from 'react'

function TocList({ categories, getHref, getCount, onNavigate, variant }) {
  const linkClassName =
    variant === 'mobile'
      ? 'block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200'
      : 'block px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors duration-200'

  const countClassName = variant === 'mobile' ? 'ml-2 text-xs opacity-50' : 'ml-1 opacity-50 text-[10px]'

  return (
    <ul className={variant === 'mobile' ? 'space-y-2' : 'space-y-1'}>
      {categories.map((category) => (
        <li key={category}>
          <a
            href={getHref(category)}
            onClick={onNavigate}
            className={linkClassName}
          >
            {category}
            <span className={countClassName}>({getCount(category)})</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function TableOfContents({
  categories,
  getHref,
  getCount,
  mobileOpen,
  setMobileOpen,
  desktopCollapsed,
  toggleDesktopCollapsed,
}) {
  const hasItems = categories.length > 0

  useEffect(() => {
    if (!mobileOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen, setMobileOpen])

  const showDesktopToc = categories.length > 1

  const desktopHeaderBaseClass =
    'sticky top-0 w-full h-12 box-border flex items-center relative bg-white dark:bg-gray-800 z-10 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'

  const desktopHeaderExpandedClass =
    `${desktopHeaderBaseClass} focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 border-gray-100 dark:border-gray-700/50 rounded-t-lg px-6 justify-start`

  const desktopHeaderCollapsedClass =
    `${desktopHeaderBaseClass} focus-visible:ring-inset border-transparent rounded-lg px-0 justify-center`

  return (
    <>
      {/* Floating TOC (Large Screens) */}
      {showDesktopToc && (
        <nav
          className={
            `fixed right-2 top-24 hidden xl:flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 ` +
            `transition-all duration-300 ease-in-out overflow-hidden ` +
            (desktopCollapsed ? 'w-12 h-12' : 'w-56 max-h-[calc(100vh-8rem)]')
          }
        >
          <button
            onClick={toggleDesktopCollapsed}
            className={desktopCollapsed ? desktopHeaderCollapsedClass : desktopHeaderExpandedClass}
            title={desktopCollapsed ? 'Expand Contents' : 'Collapse Contents'}
          >
            {!desktopCollapsed && (
              <h3 className="text-sm leading-none font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pr-10">
                Contents
              </h3>
            )}
            <svg
              className={[
                desktopCollapsed ? 'w-5 h-5' : 'w-4 h-4',
                'text-gray-400 dark:text-gray-500 transition-transform duration-300',
                desktopCollapsed ? 'rotate-180' : '',
                'absolute top-1/2 -translate-y-1/2',
                desktopCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-5',
              ].join(' ')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={desktopCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
              />
            </svg>
          </button>

          {!desktopCollapsed && (
            <div className="space-y-1 p-4 pt-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <TocList
                categories={categories}
                getHref={getHref}
                getCount={getCount}
                onNavigate={undefined}
                variant="desktop"
              />
            </div>
          )}
        </nav>
      )}

      {/* Mobile TOC slide-over (kept mounted for smooth transitions) */}
      <div
        className={
          `fixed inset-0 z-[100] xl:hidden ${mobileOpen ? '' : 'pointer-events-none'}`
        }
        aria-hidden={!mobileOpen}
      >
        <div
          className={
            `absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ` +
            (mobileOpen ? 'opacity-100' : 'opacity-0')
          }
          onClick={() => setMobileOpen(false)}
        />

        <nav
          className={
            `absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 ` +
            `transform transition-transform duration-300 ease-out overflow-hidden ` +
            (mobileOpen ? 'translate-x-0' : 'translate-x-full')
          }
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Jump to Section</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {hasItems ? (
              <TocList
                categories={categories}
                getHref={getHref}
                getCount={getCount}
                onNavigate={() => setMobileOpen(false)}
                variant="mobile"
              />
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                No sections found.
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile floating button (easy reach while scrolling) */}
      {hasItems && (
        <button
          onClick={() => setMobileOpen(true)}
          className={
            `fixed bottom-4 right-4 z-[90] xl:hidden ` +
            `p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 ` +
            `bg-white/90 dark:bg-gray-800/90 backdrop-blur hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200`
          }
          title="Table of Contents"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  )
}
