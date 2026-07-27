export const typescriptFileShort = `/**
 * stack.ts - A generic LIFO stack.
 */

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

  clear(): void {
    this.items = []
  }
}
`

export const typescriptFileMedium = `/**
 * utils.ts - General-purpose TypeScript utilities.
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

// typescriptFile is an alias for typescriptFileMedium for backwards compatibility.
export const typescriptFile = typescriptFileMedium

export const typescriptFileLong = `/**
 * extras.ts - Extended TypeScript utilities: events, deep merge, and validation.
 */

// ---------------------------------------------------------------------------
// EventEmitter
// ---------------------------------------------------------------------------

type Listener<T> = (payload: T) => void

export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>()

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>)
    return () => this.off(event, listener)
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>)
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach(fn => fn(payload))
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const wrapped: Listener<Events[K]> = payload => {
      listener(payload)
      this.off(event, wrapped)
    }
    this.on(event, wrapped)
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

// ---------------------------------------------------------------------------
// Deep merge
// ---------------------------------------------------------------------------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function deepMerge(
  base: Record<string, unknown>,
  ...overrides: Record<string, unknown>[]
): Record<string, unknown> {
  const result = { ...base }
  for (const override of overrides) {
    for (const key of Object.keys(override)) {
      const bv = result[key]
      const ov = override[key]
      if (isPlainObject(bv) && isPlainObject(ov)) {
        result[key] = deepMerge(bv, ov)
      } else if (ov !== undefined) {
        result[key] = ov
      }
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export type ValidationResult = { valid: true } | { valid: false; errors: string[] }

export type Validator<T> = (value: T) => ValidationResult

export function required<T>(value: T | null | undefined): ValidationResult {
  if (value === null || value === undefined) {
    return { valid: false, errors: ['Value is required'] }
  }
  if (typeof value === 'string' && value.length === 0) {
    return { valid: false, errors: ['Value is required'] }
  }
  return { valid: true }
}

export function minLength(min: number): Validator<string> {
  return value => value.length >= min
    ? { valid: true }
    : { valid: false, errors: ['Must be at least ' + min + ' characters'] }
}

export function maxLength(max: number): Validator<string> {
  return value => value.length <= max
    ? { valid: true }
    : { valid: false, errors: ['Must be at most ' + max + ' characters'] }
}

export function pattern(re: RegExp, message: string): Validator<string> {
  return value => re.test(value)
    ? { valid: true }
    : { valid: false, errors: [message] }
}

export function combine<T>(...validators: Validator<T>[]): Validator<T> {
  return value => {
    const errors: string[] = []
    for (const v of validators) {
      const r = v(value)
      if (!r.valid) errors.push(...r.errors)
    }
    return errors.length === 0 ? { valid: true } : { valid: false, errors }
  }
}

// ---------------------------------------------------------------------------
// Pipe and memoize
// ---------------------------------------------------------------------------

export function pipe<T>(value: T, ...fns: Array<(v: T) => T>): T {
  return fns.reduce((v, fn) => fn(v), value)
}

export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args)
): (...args: T) => R {
  const cache = new Map<string, R>()
  return (...args: T): R => {
    const key = keyFn(...args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}
`
