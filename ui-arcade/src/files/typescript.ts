export const typescriptFile = `/**
 * utils.ts – General-purpose TypeScript utilities.
 */

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

export class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items.pop()!
  }

  peek(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }

  get size(): number {
    return this.cache.size
  }
}

// ---------------------------------------------------------------------------
// Functional helpers
// ---------------------------------------------------------------------------

export function groupBy<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!keyFn) return [...new Set(arr)]
  const seen = new Set<unknown>()
  return arr.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function sortBy<T>(arr: T[], ...fns: Array<(item: T) => unknown>): T[] {
  return [...arr].sort((a, b) => {
    for (const fn of fns) {
      const va = fn(a)
      const vb = fn(b)
      if (va < vb) return -1
      if (va > vb) return 1
    }
    return 0
  })
}

// ---------------------------------------------------------------------------
// Async helpers
// ---------------------------------------------------------------------------

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500,
  backoff = 2
): Promise<T> {
  let lastError: unknown
  let delay = delayMs
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < maxAttempts - 1) {
        await sleep(delay)
        delay *= backoff
      }
    }
  }
  throw lastError
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: T) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}

export function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number
): (...args: T) => void {
  let last = 0
  return (...args: T) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

export function truncate(str: string, maxLen: number, suffix = '...'): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - suffix.length) + suffix
}

export function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}

// ---------------------------------------------------------------------------
// Number utilities
// ---------------------------------------------------------------------------

export function clamp(value: number, lo: number, hi: number): number {
  return Math.min(Math.max(value, lo), hi)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}
`
