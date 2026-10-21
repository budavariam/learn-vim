var e=`package utils

import (
	"errors"
	"sync"
)

// ErrEmpty is returned when operating on an empty collection.
var ErrEmpty = errors.New("empty")

// Stack is a generic thread-safe LIFO data structure.
type Stack[T any] struct {
	mu    sync.Mutex
	items []T
}

// Push adds an element to the top of the stack.
func (s *Stack[T]) Push(item T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = append(s.items, item)
}

// Pop removes and returns the top element of the stack.
func (s *Stack[T]) Pop() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrEmpty
	}
	top := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return top, nil
}

// Len returns the current number of items.
func (s *Stack[T]) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.items)
}
`,t=`package utils

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"
)

// ErrNotFound is returned when a requested item is not found.
var ErrNotFound = errors.New("not found")

// Stack is a generic LIFO data structure.
type Stack[T any] struct {
	mu    sync.Mutex
	items []T
}

// Push adds an element to the top of the stack.
func (s *Stack[T]) Push(item T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = append(s.items, item)
}

// Pop removes and returns the top element of the stack.
func (s *Stack[T]) Pop() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrNotFound
	}
	top := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return top, nil
}

// Peek returns the top element without removing it.
func (s *Stack[T]) Peek() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrNotFound
	}
	return s.items[len(s.items)-1], nil
}

// Len returns the number of items in the stack.
func (s *Stack[T]) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.items)
}

// HashFile computes the SHA-256 hash of a file at the given path.
func HashFile(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", fmt.Errorf("open %s: %w", path, err)
	}
	defer f.Close()

	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return "", fmt.Errorf("hash %s: %w", path, err)
	}
	return hex.EncodeToString(h.Sum(nil)), nil
}

// WalkFiles calls fn for each regular file under root.
func WalkFiles(root string, fn func(path string, info os.FileInfo) error) error {
	return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			return fn(path, info)
		}
		return nil
	})
}

// WordCount counts the frequency of each word in the reader.
func WordCount(r io.Reader) (map[string]int, error) {
	counts := make(map[string]int)
	scanner := bufio.NewScanner(r)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		word := strings.ToLower(strings.TrimFunc(scanner.Text(), unicode.IsPunct))
		if word != "" {
			counts[word]++
		}
	}
	return counts, scanner.Err()
}

// TopN returns the n most frequent words from the count map.
func TopN(counts map[string]int, n int) []string {
	type pair struct {
		word  string
		count int
	}
	pairs := make([]pair, 0, len(counts))
	for w, c := range counts {
		pairs = append(pairs, pair{w, c})
	}
	sort.Slice(pairs, func(i, j int) bool {
		if pairs[i].count != pairs[j].count {
			return pairs[i].count > pairs[j].count
		}
		return pairs[i].word < pairs[j].word
	})
	result := make([]string, 0, n)
	for i := 0; i < n && i < len(pairs); i++ {
		result = append(result, pairs[i].word)
	}
	return result
}

// Retry calls fn up to maxAttempts times with exponential backoff.
func Retry(maxAttempts int, initial time.Duration, fn func() error) error {
	delay := initial
	var lastErr error
	for i := 0; i < maxAttempts; i++ {
		if err := fn(); err != nil {
			lastErr = err
			time.Sleep(delay)
			delay = time.Duration(float64(delay) * 1.5)
			continue
		}
		return nil
	}
	return fmt.Errorf("after %d attempts: %w", maxAttempts, lastErr)
}

// ParseCSVLine parses a single CSV line respecting quoted fields.
func ParseCSVLine(line string) []string {
	var fields []string
	var buf strings.Builder
	inQuote := false
	for i := 0; i < len(line); i++ {
		ch := line[i]
		switch {
		case ch == '"':
			if inQuote && i+1 < len(line) && line[i+1] == '"' {
				buf.WriteByte('"')
				i++
			} else {
				inQuote = !inQuote
			}
		case ch == ',' && !inQuote:
			fields = append(fields, buf.String())
			buf.Reset()
		default:
			buf.WriteByte(ch)
		}
	}
	fields = append(fields, buf.String())
	return fields
}

// Clamp restricts v to the range [lo, hi].
func Clamp(v, lo, hi float64) float64 {
	return math.Min(math.Max(v, lo), hi)
}

// FormatDuration formats a duration as a human-readable string.
func FormatDuration(d time.Duration) string {
	if d < time.Minute {
		return strconv.FormatFloat(d.Seconds(), 'f', 1, 64) + "s"
	}
	if d < time.Hour {
		return fmt.Sprintf("%dm%02ds", int(d.Minutes()), int(d.Seconds())%60)
	}
	return fmt.Sprintf("%dh%02dm", int(d.Hours()), int(d.Minutes())%60)
}

// Must panics if err is non-nil, otherwise returns v.
func Must[T any](v T, err error) T {
	if err != nil {
		panic(err)
	}
	return v
}
`,n=t,r=`package utils

import (
	"context"
	"sync"
	"sync/atomic"
)

// Set is a generic unordered collection of unique elements.
type Set[T comparable] struct {
	mu    sync.RWMutex
	items map[T]struct{}
}

// NewSet creates an empty Set.
func NewSet[T comparable]() *Set[T] {
	return &Set[T]{items: make(map[T]struct{})}
}

// Add inserts v into the set.
func (s *Set[T]) Add(v T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items[v] = struct{}{}
}

// Has reports whether v is in the set.
func (s *Set[T]) Has(v T) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, ok := s.items[v]
	return ok
}

// Remove deletes v from the set.
func (s *Set[T]) Remove(v T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.items, v)
}

// Len returns the number of elements in the set.
func (s *Set[T]) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.items)
}

// Slice returns the set elements as an unsorted slice.
func (s *Set[T]) Slice() []T {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]T, 0, len(s.items))
	for v := range s.items {
		out = append(out, v)
	}
	return out
}

// WorkerPool runs tasks concurrently with a bounded number of goroutines.
type WorkerPool struct {
	workers int
	tasks   chan func()
	wg      sync.WaitGroup
	once    sync.Once
	quit    chan struct{}
	active  atomic.Int64
}

// NewWorkerPool creates and starts a pool with the given number of workers.
func NewWorkerPool(workers int) *WorkerPool {
	p := &WorkerPool{
		workers: workers,
		tasks:   make(chan func(), workers*2),
		quit:    make(chan struct{}),
	}
	p.start()
	return p
}

func (p *WorkerPool) start() {
	for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go func() {
			defer p.wg.Done()
			for {
				select {
				case task, ok := <-p.tasks:
					if !ok {
						return
					}
					p.active.Add(1)
					task()
					p.active.Add(-1)
				case <-p.quit:
					return
				}
			}
		}()
	}
}

// Submit enqueues a task. Blocks if the pool queue is full.
func (p *WorkerPool) Submit(task func()) {
	p.tasks <- task
}

// TrySubmit enqueues a task without blocking. Returns false if the queue is full.
func (p *WorkerPool) TrySubmit(task func()) bool {
	select {
	case p.tasks <- task:
		return true
	default:
		return false
	}
}

// Stop signals the pool to stop after pending tasks complete.
// Returns ctx.Err() if the context is cancelled before all tasks finish.
func (p *WorkerPool) Stop(ctx context.Context) error {
	p.once.Do(func() { close(p.tasks) })
	done := make(chan struct{})
	go func() {
		p.wg.Wait()
		close(done)
	}()
	select {
	case <-done:
		return nil
	case <-ctx.Done():
		close(p.quit)
		return ctx.Err()
	}
}

// Active returns the number of currently executing tasks.
func (p *WorkerPool) Active() int64 {
	return p.active.Load()
}

// MapConcurrent applies fn to each element concurrently and returns the results.
func MapConcurrent[T, R any](items []T, workers int, fn func(T) R) []R {
	results := make([]R, len(items))
	var wg sync.WaitGroup
	sem := make(chan struct{}, workers)
	for i, item := range items {
		wg.Add(1)
		go func(idx int, v T) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			results[idx] = fn(v)
		}(i, item)
	}
	wg.Wait()
	return results
}

// Keys returns the keys of a map as a slice.
func Keys[K comparable, V any](m map[K]V) []K {
	out := make([]K, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}

// Values returns the values of a map as a slice.
func Values[K comparable, V any](m map[K]V) []V {
	out := make([]V, 0, len(m))
	for _, v := range m {
		out = append(out, v)
	}
	return out
}

// Filter returns the elements of items for which fn returns true.
func Filter[T any](items []T, fn func(T) bool) []T {
	out := make([]T, 0)
	for _, v := range items {
		if fn(v) {
			out = append(out, v)
		}
	}
	return out
}

// Map transforms each element of items using fn and returns the results.
func Map[T, R any](items []T, fn func(T) R) []R {
	out := make([]R, len(items))
	for i, v := range items {
		out[i] = fn(v)
	}
	return out
}
`,i=`/// Clamp a value between lo and hi (inclusive).
pub fn clamp<T: PartialOrd>(value: T, lo: T, hi: T) -> T {
    if value < lo {
        lo
    } else if value > hi {
        hi
    } else {
        value
    }
}

/// Retry a fallible closure up to \`attempts\` times, returning the last error.
pub fn retry<T, E, F>(attempts: usize, mut f: F) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
{
    let mut last_err = None;
    for _ in 0..attempts {
        match f() {
            Ok(v) => return Ok(v),
            Err(e) => last_err = Some(e),
        }
    }
    Err(last_err.unwrap())
}

/// Return the Levenshtein edit distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; }
    for j in 0..=n { dp[0][j] = j; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]
            } else {
                1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1])
            };
        }
    }
    dp[m][n]
}
`,a=`use std::collections::HashMap;
use std::fmt;
use std::fs::File;
use std::io::{self, BufRead, BufReader, Write};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// A simple in-memory key-value store with optional TTL.
pub struct Cache<K, V> {
    inner: Arc<Mutex<CacheInner<K, V>>>,
}

struct CacheEntry<V> {
    value: V,
    expires_at: Option<Instant>,
}

struct CacheInner<K, V> {
    store: HashMap<K, CacheEntry<V>>,
    max_size: usize,
}

impl<K: std::hash::Hash + Eq + Clone, V: Clone> Cache<K, V> {
    pub fn new(max_size: usize) -> Self {
        Cache {
            inner: Arc::new(Mutex::new(CacheInner {
                store: HashMap::new(),
                max_size,
            })),
        }
    }

    pub fn insert(&self, key: K, value: V, ttl: Option<Duration>) {
        let mut inner = self.inner.lock().unwrap();
        if inner.store.len() >= inner.max_size {
            // Evict first expired entry or oldest
            let expired_key = inner
                .store
                .iter()
                .find(|(_, e)| e.expires_at.map_or(false, |t| t < Instant::now()))
                .map(|(k, _)| k.clone());
            if let Some(k) = expired_key {
                inner.store.remove(&k);
            }
        }
        inner.store.insert(
            key,
            CacheEntry {
                value,
                expires_at: ttl.map(|d| Instant::now() + d),
            },
        );
    }

    pub fn get(&self, key: &K) -> Option<V> {
        let inner = self.inner.lock().unwrap();
        inner.store.get(key).and_then(|e| {
            if e.expires_at.map_or(false, |t| t < Instant::now()) {
                None
            } else {
                Some(e.value.clone())
            }
        })
    }

    pub fn remove(&self, key: &K) -> bool {
        let mut inner = self.inner.lock().unwrap();
        inner.store.remove(key).is_some()
    }

    pub fn len(&self) -> usize {
        self.inner.lock().unwrap().store.len()
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

/// Read all lines from a file, returning them as a Vec<String>.
pub fn read_lines<P: AsRef<Path>>(path: P) -> io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    reader.lines().collect()
}

/// Write lines to a file, one per line.
pub fn write_lines<P: AsRef<Path>>(path: P, lines: &[String]) -> io::Result<()> {
    let mut file = File::create(path)?;
    for line in lines {
        writeln!(file, "{}", line)?;
    }
    Ok(())
}

/// A retry helper that retries a fallible closure up to n times.
pub fn retry<T, E, F>(attempts: usize, mut f: F) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
{
    let mut last_err = None;
    for _ in 0..attempts {
        match f() {
            Ok(v) => return Ok(v),
            Err(e) => last_err = Some(e),
        }
    }
    Err(last_err.unwrap())
}

/// Clamp a value between lo and hi.
pub fn clamp<T: PartialOrd>(value: T, lo: T, hi: T) -> T {
    if value < lo {
        lo
    } else if value > hi {
        hi
    } else {
        value
    }
}

/// Levenshtein edit distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; }
    for j in 0..=n { dp[0][j] = j; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]
            } else {
                1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1])
            };
        }
    }
    dp[m][n]
}

/// A word-frequency counter.
#[derive(Debug, Default)]
pub struct WordCounter {
    counts: HashMap<String, usize>,
}

impl WordCounter {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn add_text(&mut self, text: &str) {
        for word in text.split_whitespace() {
            let word = word.to_lowercase();
            let word = word.trim_matches(|c: char| !c.is_alphanumeric());
            if !word.is_empty() {
                *self.counts.entry(word.to_string()).or_insert(0) += 1;
            }
        }
    }

    pub fn top_n(&self, n: usize) -> Vec<(&str, usize)> {
        let mut pairs: Vec<_> = self.counts.iter().map(|(k, v)| (k.as_str(), *v)).collect();
        pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));
        pairs.into_iter().take(n).collect()
    }
}

impl fmt::Display for WordCounter {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for (word, count) in self.top_n(10) {
            writeln!(f, "{}: {}", word, count)?;
        }
        Ok(())
    }
}
`,o=a,s=`use std::collections::HashMap;
use std::sync::{Arc, Mutex};

/// A fixed-capacity ring buffer (FIFO queue).
pub struct RingBuffer<T> {
    data: Vec<Option<T>>,
    head: usize,
    tail: usize,
    len: usize,
    cap: usize,
}

impl<T> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity > 0, "capacity must be positive");
        let mut data = Vec::with_capacity(capacity);
        for _ in 0..capacity {
            data.push(None);
        }
        RingBuffer { data, head: 0, tail: 0, len: 0, cap: capacity }
    }

    /// Push an item. Returns false if the buffer is full.
    pub fn push(&mut self, item: T) -> bool {
        if self.len == self.cap {
            return false;
        }
        self.data[self.head] = Some(item);
        self.head = (self.head + 1) % self.cap;
        self.len += 1;
        true
    }

    /// Pop the oldest item from the front.
    pub fn pop(&mut self) -> Option<T> {
        if self.len == 0 {
            return None;
        }
        let item = self.data[self.tail].take();
        self.tail = (self.tail + 1) % self.cap;
        self.len -= 1;
        item
    }

    /// Peek at the front item without removing it.
    pub fn peek(&self) -> Option<&T> {
        if self.len == 0 { None } else { self.data[self.tail].as_ref() }
    }

    pub fn len(&self) -> usize    { self.len }
    pub fn is_empty(&self) -> bool { self.len == 0 }
    pub fn is_full(&self) -> bool  { self.len == self.cap }
}

/// An event bus for decoupled pub/sub messaging.
pub struct EventBus<E: Clone> {
    listeners: Arc<Mutex<HashMap<String, Vec<Box<dyn Fn(E) + Send + Sync>>>>>,
}

impl<E: Clone + 'static> EventBus<E> {
    pub fn new() -> Self {
        EventBus { listeners: Arc::new(Mutex::new(HashMap::new())) }
    }

    /// Register a handler for the named event.
    pub fn subscribe<F>(&self, event: &str, handler: F)
    where
        F: Fn(E) + Send + Sync + 'static,
    {
        self.listeners
            .lock()
            .unwrap()
            .entry(event.to_string())
            .or_default()
            .push(Box::new(handler));
    }

    /// Dispatch an event to all registered handlers.
    pub fn publish(&self, event: &str, payload: E) {
        let listeners = self.listeners.lock().unwrap();
        if let Some(handlers) = listeners.get(event) {
            for handler in handlers {
                handler(payload.clone());
            }
        }
    }

    pub fn listener_count(&self, event: &str) -> usize {
        self.listeners.lock().unwrap().get(event).map_or(0, |v| v.len())
    }
}

impl<E: Clone + 'static> Default for EventBus<E> {
    fn default() -> Self { Self::new() }
}

/// A prefix-tree for efficient string prefix queries.
#[derive(Default)]
pub struct Trie {
    children: HashMap<char, Trie>,
    is_end: bool,
}

impl Trie {
    pub fn new() -> Self { Default::default() }

    /// Insert a word into the trie.
    pub fn insert(&mut self, word: &str) {
        let mut node = self;
        for ch in word.chars() {
            node = node.children.entry(ch).or_default();
        }
        node.is_end = true;
    }

    /// Return true if the trie contains exactly this word.
    pub fn contains(&self, word: &str) -> bool {
        self.find(word).map_or(false, |n| n.is_end)
    }

    /// Return true if any inserted word begins with \`prefix\`.
    pub fn starts_with(&self, prefix: &str) -> bool {
        self.find(prefix).is_some()
    }

    fn find(&self, s: &str) -> Option<&Trie> {
        let mut node = self;
        for ch in s.chars() {
            node = node.children.get(&ch)?;
        }
        Some(node)
    }
}

/// Truncate \`s\` to at most \`max_chars\` Unicode scalar values.
pub fn truncate(s: &str, max_chars: usize) -> &str {
    match s.char_indices().nth(max_chars) {
        Some((idx, _)) => &s[..idx],
        None => s,
    }
}

/// Left-pad \`s\` with \`fill\` to at least \`width\` characters.
pub fn pad_left(s: &str, width: usize, fill: char) -> String {
    let len = s.chars().count();
    if len >= width {
        return s.to_owned();
    }
    let padding: String = std::iter::repeat(fill).take(width - len).collect();
    padding + s
}

/// Return the number of leading ASCII space characters in \`s\`.
pub fn indent_level(s: &str) -> usize {
    s.len() - s.trim_start_matches(' ').len()
}
`,c=`"""stack.py - A generic LIFO stack."""
from __future__ import annotations

from typing import Generic, TypeVar

T = TypeVar("T")


class Stack(Generic[T]):
    """A simple LIFO stack."""

    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T:
        if not self._items:
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

    def __bool__(self) -> bool:
        return bool(self._items)

    def __repr__(self) -> str:
        return f"Stack({self._items!r})"
`,l=`"""
utils.py - A collection of general-purpose Python utilities.
"""
from __future__ import annotations

import hashlib
import heapq
import itertools
import json
import math
import os
import re
import time
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Generator, Generic, Iterable, Iterator, TypeVar

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

class Stack(Generic[T]):
    """A thread-safe LIFO stack."""

    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T:
        if not self._items:
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

    def __bool__(self) -> bool:
        return bool(self._items)


@dataclass(order=True)
class PrioritizedItem(Generic[T]):
    priority: float
    item: T = field(compare=False)


class PriorityQueue(Generic[T]):
    """Min-heap priority queue."""

    def __init__(self) -> None:
        self._heap: list[PrioritizedItem[T]] = []

    def push(self, item: T, priority: float) -> None:
        heapq.heappush(self._heap, PrioritizedItem(priority, item))

    def pop(self) -> T:
        return heapq.heappop(self._heap).item

    def __len__(self) -> int:
        return len(self._heap)


# ---------------------------------------------------------------------------
# File utilities
# ---------------------------------------------------------------------------

def hash_file(path: str | Path, algorithm: str = "sha256") -> str:
    """Return the hex digest of a file."""
    h = hashlib.new(algorithm)
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def walk_files(root: str | Path) -> Generator[Path, None, None]:
    """Yield all regular files under *root* recursively."""
    for dirpath, _dirs, files in os.walk(root):
        for name in files:
            yield Path(dirpath) / name


def read_json(path: str | Path) -> Any:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path: str | Path, data: Any, *, indent: int = 2) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Text utilities
# ---------------------------------------------------------------------------

def word_count(text: str) -> Counter[str]:
    """Return a frequency counter of words (lowercased, punctuation stripped)."""
    words = re.findall(r"[a-zA-Z']+", text.lower())
    return Counter(words)


def camel_to_snake(name: str) -> str:
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\\1_\\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\\1_\\2", s1).lower()


def snake_to_camel(name: str) -> str:
    components = name.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


def truncate(text: str, max_len: int, suffix: str = "...") -> str:
    if len(text) <= max_len:
        return text
    return text[: max_len - len(suffix)] + suffix


# ---------------------------------------------------------------------------
# Numeric utilities
# ---------------------------------------------------------------------------

def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(value, hi))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * clamp(t, 0.0, 1.0)


def chunk(iterable: Iterable[T], size: int) -> Iterator[list[T]]:
    it = iter(iterable)
    while True:
        batch = list(itertools.islice(it, size))
        if not batch:
            break
        yield batch


# ---------------------------------------------------------------------------
# Retry helper
# ---------------------------------------------------------------------------

def retry(
    fn: Callable[[], T],
    attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple[type[Exception], ...] = (Exception,),
) -> T:
    last_exc: Exception | None = None
    current_delay = delay
    for _ in range(attempts):
        try:
            return fn()
        except exceptions as exc:
            last_exc = exc
            time.sleep(current_delay)
            current_delay *= backoff
    raise RuntimeError(f"All {attempts} attempts failed") from last_exc


# ---------------------------------------------------------------------------
# Levenshtein distance
# ---------------------------------------------------------------------------

def levenshtein(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            temp = dp[j]
            if a[i - 1] == b[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = temp
    return dp[n]
`,u=l,d=`"""
extras.py - Extended Python utilities: caching, configuration, rate limiting.
"""
from __future__ import annotations

import functools
import json
import os
import time
from collections import OrderedDict
from pathlib import Path
from typing import Any, Callable, Generic, Iterator, TypeVar

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


# ---------------------------------------------------------------------------
# Memoize decorator
# ---------------------------------------------------------------------------

def memoize(fn: Callable[..., T]) -> Callable[..., T]:
    """Cache results of a function call keyed by positional arguments."""
    cache: dict[Any, T] = {}

    @functools.wraps(fn)
    def wrapper(*args: Any) -> T:
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    wrapper.cache = cache  # type: ignore[attr-defined]
    return wrapper


# ---------------------------------------------------------------------------
# LRU cache
# ---------------------------------------------------------------------------

class LRUCache(Generic[K, V]):
    """An LRU cache with a fixed maximum capacity."""

    def __init__(self, maxsize: int = 128) -> None:
        self._maxsize = maxsize
        self._cache: OrderedDict[K, V] = OrderedDict()

    def get(self, key: K, default: V | None = None) -> V | None:
        if key not in self._cache:
            return default
        self._cache.move_to_end(key)
        return self._cache[key]

    def put(self, key: K, value: V) -> None:
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self._maxsize:
            self._cache.popitem(last=False)

    def __contains__(self, key: object) -> bool:
        return key in self._cache

    def __len__(self) -> int:
        return len(self._cache)


# ---------------------------------------------------------------------------
# Configuration loader
# ---------------------------------------------------------------------------

class Config:
    """Load configuration from a JSON file with environment-variable overrides."""

    def __init__(self, path: str | Path | None = None) -> None:
        self._data: dict[str, Any] = {}
        if path is not None:
            self.load(path)

    def load(self, path: str | Path) -> None:
        with open(path, encoding="utf-8") as f:
            self._data.update(json.load(f))

    def get(self, key: str, default: Any = None) -> Any:
        """Return the value for *key*, checking env vars first (uppercased, dots to underscores)."""
        env_key = key.upper().replace(".", "_")
        if env_key in os.environ:
            return os.environ[env_key]
        keys = key.split(".")
        node: Any = self._data
        for k in keys:
            if not isinstance(node, dict) or k not in node:
                return default
            node = node[k]
        return node

    def require(self, key: str) -> Any:
        value = self.get(key)
        if value is None:
            raise KeyError(f"Required config key missing: {key!r}")
        return value

    def __repr__(self) -> str:
        return f"Config({self._data!r})"


# ---------------------------------------------------------------------------
# Token-bucket rate limiter
# ---------------------------------------------------------------------------

class RateLimiter:
    """A token-bucket rate limiter.

    Args:
        rate:  tokens replenished per second.
        burst: maximum token capacity (burst size).
    """

    def __init__(self, rate: float, burst: float) -> None:
        self._rate = rate
        self._burst = burst
        self._tokens = burst
        self._last = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self._last
        self._tokens = min(self._burst, self._tokens + elapsed * self._rate)
        self._last = now

    def allow(self) -> bool:
        """Return True and consume one token if available, else False."""
        self._refill()
        if self._tokens >= 1.0:
            self._tokens -= 1.0
            return True
        return False

    def wait(self) -> None:
        """Block until one token is available, then consume it."""
        self._refill()
        if self._tokens < 1.0:
            deficit = 1.0 - self._tokens
            time.sleep(deficit / self._rate)
            self._tokens = 0.0
        else:
            self._tokens -= 1.0


# ---------------------------------------------------------------------------
# Sequence utilities
# ---------------------------------------------------------------------------

def windows(seq: list[T], size: int) -> Iterator[list[T]]:
    """Yield overlapping sliding windows of *size* over *seq*."""
    for i in range(len(seq) - size + 1):
        yield seq[i : i + size]


def pairwise(seq: list[T]) -> Iterator[tuple[T, T]]:
    """Yield consecutive (a, b) pairs from *seq*."""
    for a, b in zip(seq, seq[1:]):
        yield a, b


def flatten(nested: list[Any]) -> list[Any]:
    """Recursively flatten a nested list into a single list."""
    result: list[Any] = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result
`,f=`/**
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
`,p=`/**
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
`,m=p,h=`/**
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
`,g=`/*
 * vec.c - A minimal growable pointer array.
 */
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    void  **data;
    size_t  size;
    size_t  capacity;
} Vec;

Vec *vec_new(void) {
    Vec *v = malloc(sizeof(Vec));
    if (!v) return NULL;
    v->data = malloc(8 * sizeof(void *));
    v->size = 0;
    v->capacity = 8;
    return v;
}

bool vec_push(Vec *v, void *item) {
    if (v->size == v->capacity) {
        size_t  cap = v->capacity * 2;
        void  **d   = realloc(v->data, cap * sizeof(void *));
        if (!d) return false;
        v->data     = d;
        v->capacity = cap;
    }
    v->data[v->size++] = item;
    return true;
}

void *vec_get(const Vec *v, size_t i) {
    return i < v->size ? v->data[i] : NULL;
}

void vec_free(Vec *v) {
    free(v->data);
    free(v);
}
`,_=`/*
 * utils.c - General-purpose C utility library.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <assert.h>

/* -------------------------------------------------------------------------
 * Dynamic array
 * ---------------------------------------------------------------------- */

typedef struct {
    void   **data;
    size_t   size;
    size_t   capacity;
} Vec;

Vec *vec_new(void) {
    Vec *v = malloc(sizeof(Vec));
    if (!v) return NULL;
    v->data     = malloc(8 * sizeof(void *));
    v->size     = 0;
    v->capacity = 8;
    return v;
}

bool vec_push(Vec *v, void *item) {
    if (v->size == v->capacity) {
        size_t new_cap = v->capacity * 2;
        void **d = realloc(v->data, new_cap * sizeof(void *));
        if (!d) return false;
        v->data     = d;
        v->capacity = new_cap;
    }
    v->data[v->size++] = item;
    return true;
}

void *vec_get(const Vec *v, size_t i) {
    if (i >= v->size) return NULL;
    return v->data[i];
}

void vec_free(Vec *v) {
    free(v->data);
    free(v);
}

/* -------------------------------------------------------------------------
 * Hash map (open-addressing, FNV-1a hash)
 * ---------------------------------------------------------------------- */

#define MAP_INIT_CAP 16
#define MAP_LOAD     0.75

typedef struct {
    char   *key;
    void   *value;
    bool    occupied;
    bool    deleted;
} MapEntry;

typedef struct {
    MapEntry *entries;
    size_t    size;
    size_t    capacity;
} HashMap;

static uint64_t fnv1a(const char *s) {
    uint64_t h = 14695981039346656037ULL;
    for (; *s; ++s) h = (h ^ (uint8_t)*s) * 1099511628211ULL;
    return h;
}

HashMap *map_new(void) {
    HashMap *m = calloc(1, sizeof(HashMap));
    if (!m) return NULL;
    m->entries  = calloc(MAP_INIT_CAP, sizeof(MapEntry));
    m->capacity = MAP_INIT_CAP;
    return m;
}

static bool map_insert_raw(MapEntry *entries, size_t cap,
                            const char *key, void *value) {
    uint64_t idx = fnv1a(key) % cap;
    for (size_t i = 0; i < cap; ++i) {
        MapEntry *e = &entries[(idx + i) % cap];
        if (!e->occupied || e->deleted) {
            e->key      = (char *)key;
            e->value    = value;
            e->occupied = true;
            e->deleted  = false;
            return true;
        }
        if (strcmp(e->key, key) == 0) {
            e->value = value;
            return true;
        }
    }
    return false;
}

bool map_put(HashMap *m, const char *key, void *value) {
    if ((double)m->size / m->capacity >= MAP_LOAD) {
        size_t    new_cap = m->capacity * 2;
        MapEntry *new_e   = calloc(new_cap, sizeof(MapEntry));
        if (!new_e) return false;
        for (size_t i = 0; i < m->capacity; ++i) {
            if (m->entries[i].occupied && !m->entries[i].deleted)
                map_insert_raw(new_e, new_cap,
                               m->entries[i].key, m->entries[i].value);
        }
        free(m->entries);
        m->entries  = new_e;
        m->capacity = new_cap;
    }
    if (map_insert_raw(m->entries, m->capacity, key, value))
        ++m->size;
    return true;
}

void *map_get(const HashMap *m, const char *key) {
    uint64_t idx = fnv1a(key) % m->capacity;
    for (size_t i = 0; i < m->capacity; ++i) {
        MapEntry *e = &m->entries[(idx + i) % m->capacity];
        if (!e->occupied) return NULL;
        if (!e->deleted && strcmp(e->key, key) == 0) return e->value;
    }
    return NULL;
}

void map_free(HashMap *m) {
    free(m->entries);
    free(m);
}

/* -------------------------------------------------------------------------
 * String helpers
 * ---------------------------------------------------------------------- */

char *str_dup(const char *s) {
    size_t n = strlen(s) + 1;
    char  *d = malloc(n);
    if (d) memcpy(d, s, n);
    return d;
}

char *str_trim(char *s) {
    while (*s == ' ' || *s == '\\t') ++s;
    char *end = s + strlen(s) - 1;
    while (end > s && (*end == ' ' || *end == '\\t' || *end == '\\n')) --end;
    *(end + 1) = '\\0';
    return s;
}

int str_starts_with(const char *s, const char *prefix) {
    return strncmp(s, prefix, strlen(prefix)) == 0;
}

/* -------------------------------------------------------------------------
 * Simple linked list
 * ---------------------------------------------------------------------- */

typedef struct Node {
    void        *data;
    struct Node *next;
} Node;

Node *node_new(void *data) {
    Node *n = malloc(sizeof(Node));
    if (!n) return NULL;
    n->data = data;
    n->next = NULL;
    return n;
}

void list_prepend(Node **head, void *data) {
    Node *n = node_new(data);
    if (!n) return;
    n->next = *head;
    *head   = n;
}

void list_free(Node *head, void (*free_data)(void *)) {
    while (head) {
        Node *next = head->next;
        if (free_data) free_data(head->data);
        free(head);
        head = next;
    }
}

/* -------------------------------------------------------------------------
 * Math helpers
 * ---------------------------------------------------------------------- */

int clamp_i(int v, int lo, int hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
}

double lerp(double a, double b, double t) {
    return a + (b - a) * t;
}

uint32_t next_power_of_two(uint32_t n) {
    --n;
    n |= n >> 1;  n |= n >> 2;
    n |= n >> 4;  n |= n >> 8;
    n |= n >> 16;
    return n + 1;
}
`,v=_,y=`/*
 * alloc.c - Arena allocator, string builder, and binary search utilities.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

/* -------------------------------------------------------------------------
 * Arena allocator — bump-pointer allocator; free everything at once.
 * ---------------------------------------------------------------------- */

typedef struct {
    uint8_t *buf;
    size_t   pos;
    size_t   cap;
} Arena;

Arena *arena_new(size_t cap) {
    Arena *a = malloc(sizeof(Arena));
    if (!a) return NULL;
    a->buf = malloc(cap);
    a->pos = 0;
    a->cap = cap;
    return a;
}

void *arena_alloc(Arena *a, size_t size) {
    size = (size + 7) & ~(size_t)7;   /* align to 8 bytes */
    if (a->pos + size > a->cap) return NULL;
    void *p = a->buf + a->pos;
    a->pos += size;
    return p;
}

void arena_reset(Arena *a) { a->pos = 0; }

void arena_free(Arena *a) {
    free(a->buf);
    free(a);
}

/* -------------------------------------------------------------------------
 * String builder — growable byte buffer with a null terminator.
 * ---------------------------------------------------------------------- */

typedef struct {
    char  *buf;
    size_t len;
    size_t cap;
} StrBuf;

StrBuf *strbuf_new(void) {
    StrBuf *sb = malloc(sizeof(StrBuf));
    if (!sb) return NULL;
    sb->buf    = malloc(64);
    sb->len    = 0;
    sb->cap    = 64;
    sb->buf[0] = '\\0';
    return sb;
}

static bool strbuf_grow(StrBuf *sb, size_t need) {
    if (sb->len + need < sb->cap) return true;
    size_t new_cap = sb->cap * 2;
    while (new_cap < sb->len + need + 1) new_cap *= 2;
    char *nb = realloc(sb->buf, new_cap);
    if (!nb) return false;
    sb->buf = nb;
    sb->cap = new_cap;
    return true;
}

bool strbuf_append(StrBuf *sb, const char *s) {
    size_t n = strlen(s);
    if (!strbuf_grow(sb, n)) return false;
    memcpy(sb->buf + sb->len, s, n + 1);
    sb->len += n;
    return true;
}

bool strbuf_append_char(StrBuf *sb, char c) {
    if (!strbuf_grow(sb, 1)) return false;
    sb->buf[sb->len++] = c;
    sb->buf[sb->len]   = '\\0';
    return true;
}

const char *strbuf_str(const StrBuf *sb) { return sb->buf; }
size_t      strbuf_len(const StrBuf *sb) { return sb->len; }

void strbuf_reset(StrBuf *sb) {
    sb->len    = 0;
    sb->buf[0] = '\\0';
}

void strbuf_free(StrBuf *sb) {
    free(sb->buf);
    free(sb);
}

/* -------------------------------------------------------------------------
 * Binary search helpers (operate on sorted int arrays).
 * ---------------------------------------------------------------------- */

/* Return the leftmost index where target could be inserted to keep order. */
int bisect_left(const int *arr, int n, int target) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else                   hi = mid;
    }
    return lo;
}

/* Return the rightmost index where target could be inserted to keep order. */
int bisect_right(const int *arr, int n, int target) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] <= target) lo = mid + 1;
        else                    hi = mid;
    }
    return lo;
}

/* Reverse n bytes in-place. */
void reverse_bytes(uint8_t *buf, size_t n) {
    for (size_t i = 0, j = n - 1; i < j; ++i, --j) {
        uint8_t tmp = buf[i];
        buf[i] = buf[j];
        buf[j] = tmp;
    }
}

/* Count Unicode scalar values (not bytes) in a UTF-8 string. */
size_t count_utf8_chars(const char *s) {
    size_t n = 0;
    while (*s) {
        if ((*s & 0xC0) != 0x80) ++n;
        ++s;
    }
    return n;
}

/* Return a non-negative hash of a null-terminated string (FNV-1a). */
uint32_t str_hash32(const char *s) {
    uint32_t h = 2166136261u;
    for (; *s; ++s) h = (h ^ (uint8_t)*s) * 16777619u;
    return h;
}
`,b=`/**
 * result.hpp - Lightweight error-or-value type.
 */
#pragma once
#include <optional>
#include <stdexcept>
#include <string>

namespace utils {

template <typename T, typename E = std::string>
class Result {
public:
    static Result Ok(T v)  { return Result(std::move(v), std::nullopt); }
    static Result Err(E e) { return Result(std::nullopt, std::move(e)); }

    bool      ok()    const { return val_.has_value(); }
    bool      err()   const { return !ok(); }
    const T&  value() const { return val_.value(); }
    const E&  error() const { return err_.value(); }

    T unwrap() {
        if (!ok()) throw std::runtime_error("called unwrap on Err result");
        return std::move(*val_);
    }

private:
    Result(std::optional<T> v, std::optional<E> e)
        : val_(std::move(v)), err_(std::move(e)) {}
    std::optional<T> val_;
    std::optional<E> err_;
};

} // namespace utils
`,x=`/**
 * utils.cpp - General-purpose C++ utility library.
 */

#include <algorithm>
#include <cassert>
#include <cstdint>
#include <functional>
#include <memory>
#include <optional>
#include <span>
#include <stdexcept>
#include <string>
#include <string_view>
#include <unordered_map>
#include <vector>

namespace utils {

// ---------------------------------------------------------------------------
// Result<T, E> — lightweight error-or-value type
// ---------------------------------------------------------------------------

template <typename T, typename E = std::string>
class Result {
public:
    static Result Ok(T v)  { return Result(std::move(v), std::nullopt); }
    static Result Err(E e) { return Result(std::nullopt, std::move(e)); }

    bool      ok()    const { return val_.has_value(); }
    bool      err()   const { return !ok(); }
    const T&  value() const { return val_.value(); }
    const E&  error() const { return err_.value(); }
    T         unwrap()      { if (!ok()) throw std::runtime_error(error()); return std::move(*val_); }

private:
    Result(std::optional<T> v, std::optional<E> e)
        : val_(std::move(v)), err_(std::move(e)) {}
    std::optional<T> val_;
    std::optional<E> err_;
};

// ---------------------------------------------------------------------------
// RingBuffer<T, N> — fixed-capacity circular buffer
// ---------------------------------------------------------------------------

template <typename T, std::size_t N>
class RingBuffer {
    static_assert(N > 0, "RingBuffer size must be positive");
public:
    void push(T item) {
        data_[head_] = std::move(item);
        head_ = (head_ + 1) % N;
        if (full_) tail_ = head_;
        else       full_ = head_ == tail_;
    }

    std::optional<T> pop() {
        if (empty()) return std::nullopt;
        T item = std::move(data_[tail_]);
        tail_ = (tail_ + 1) % N;
        full_ = false;
        return item;
    }

    bool   empty() const { return !full_ && head_ == tail_; }
    bool   full()  const { return full_; }
    size_t size()  const {
        if (full_) return N;
        return head_ >= tail_ ? head_ - tail_ : N + head_ - tail_;
    }

private:
    std::array<T, N> data_{};
    std::size_t      head_ = 0, tail_ = 0;
    bool             full_ = false;
};

// ---------------------------------------------------------------------------
// LRU cache
// ---------------------------------------------------------------------------

template <typename K, typename V>
class LRUCache {
public:
    explicit LRUCache(size_t cap) : cap_(cap) { assert(cap > 0); }

    std::optional<V> get(const K& key) {
        auto it = map_.find(key);
        if (it == map_.end()) return std::nullopt;
        // move to front of order list
        order_.erase(it->second.second);
        order_.push_front(key);
        it->second.second = order_.begin();
        return it->second.first;
    }

    void put(const K& key, V value) {
        auto it = map_.find(key);
        if (it != map_.end()) {
            order_.erase(it->second.second);
            map_.erase(it);
        } else if (map_.size() == cap_) {
            map_.erase(order_.back());
            order_.pop_back();
        }
        order_.push_front(key);
        map_[key] = { std::move(value), order_.begin() };
    }

    size_t size()     const { return map_.size(); }
    bool   contains(const K& k) const { return map_.count(k) > 0; }

private:
    using OrderIt = typename std::list<K>::iterator;
    size_t                                           cap_;
    std::list<K>                                     order_;
    std::unordered_map<K, std::pair<V, OrderIt>>     map_;
};

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

std::string trim(std::string_view sv) {
    const char* ws = " \\t\\n\\r";
    auto s = sv.find_first_not_of(ws);
    auto e = sv.find_last_not_of(ws);
    if (s == std::string_view::npos) return {};
    return std::string(sv.substr(s, e - s + 1));
}

std::vector<std::string> split(std::string_view sv, char delim) {
    std::vector<std::string> out;
    size_t start = 0;
    for (size_t i = 0; i <= sv.size(); ++i) {
        if (i == sv.size() || sv[i] == delim) {
            out.emplace_back(sv.substr(start, i - start));
            start = i + 1;
        }
    }
    return out;
}

std::string join(std::span<const std::string> parts, std::string_view sep) {
    if (parts.empty()) return {};
    std::string r = parts[0];
    for (size_t i = 1; i < parts.size(); ++i) { r += sep; r += parts[i]; }
    return r;
}

bool starts_with(std::string_view s, std::string_view p) { return s.substr(0, p.size()) == p; }
bool ends_with  (std::string_view s, std::string_view p) {
    return s.size() >= p.size() && s.substr(s.size() - p.size()) == p;
}

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

template <typename T>
T clamp(T v, T lo, T hi) { return std::max(lo, std::min(v, hi)); }

template <typename T>
T lerp(T a, T b, double t) { return static_cast<T>(a + (b - a) * t); }

uint32_t next_pow2(uint32_t n) {
    --n;
    n |= n >> 1;  n |= n >> 2;
    n |= n >> 4;  n |= n >> 8;
    n |= n >> 16;
    return ++n;
}

// ---------------------------------------------------------------------------
// Defer — RAII cleanup guard
// ---------------------------------------------------------------------------

template <typename F>
struct Defer {
    F fn;
    explicit Defer(F f) : fn(std::move(f)) {}
    ~Defer() { fn(); }
};
template <typename F>
Defer<F> defer(F f) { return Defer<F>(std::move(f)); }

} // namespace utils
`,S=x,C=`/**
 * concurrency.cpp - Thread pool, observable values, and scope guards.
 */

#include <condition_variable>
#include <functional>
#include <future>
#include <mutex>
#include <queue>
#include <stdexcept>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

namespace utils {

// ---------------------------------------------------------------------------
// ThreadPool — submit tasks and receive std::future results
// ---------------------------------------------------------------------------

class ThreadPool {
public:
    explicit ThreadPool(size_t threads) : stop_(false) {
        for (size_t i = 0; i < threads; ++i) {
            workers_.emplace_back([this] {
                for (;;) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mutex_);
                        cv_.wait(lock, [this] { return stop_ || !tasks_.empty(); });
                        if (stop_ && tasks_.empty()) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();
                }
            });
        }
    }

    template <typename F, typename... Args>
    auto submit(F&& f, Args&&... args)
        -> std::future<typename std::invoke_result<F, Args...>::type>
    {
        using R = typename std::invoke_result<F, Args...>::type;
        auto bound = std::bind(std::forward<F>(f), std::forward<Args>(args)...);
        auto task  = std::make_shared<std::packaged_task<R()>>(std::move(bound));
        std::future<R> fut = task->get_future();
        {
            std::lock_guard<std::mutex> lock(mutex_);
            if (stop_) throw std::runtime_error("ThreadPool is stopped");
            tasks_.emplace([task] { (*task)(); });
        }
        cv_.notify_one();
        return fut;
    }

    size_t pending() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return tasks_.size();
    }

    ~ThreadPool() {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            stop_ = true;
        }
        cv_.notify_all();
        for (auto& w : workers_) w.join();
    }

    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;

private:
    std::vector<std::thread>          workers_;
    std::queue<std::function<void()>> tasks_;
    mutable std::mutex                mutex_;
    std::condition_variable           cv_;
    bool                              stop_;
};

// ---------------------------------------------------------------------------
// Observable<T> — a value that notifies subscribers on change
// ---------------------------------------------------------------------------

template <typename T>
class Observable {
public:
    using Callback = std::function<void(const T&)>;

    explicit Observable(T initial) : value_(std::move(initial)) {}

    const T& get() const { return value_; }

    void set(T value) {
        value_ = std::move(value);
        for (auto& [id, cb] : subscribers_) {
            cb(value_);
        }
    }

    size_t subscribe(Callback cb) {
        size_t id = next_id_++;
        subscribers_.emplace(id, std::move(cb));
        return id;
    }

    void unsubscribe(size_t id) {
        subscribers_.erase(id);
    }

    size_t subscriber_count() const { return subscribers_.size(); }

private:
    T                                    value_;
    std::unordered_map<size_t, Callback> subscribers_;
    size_t                               next_id_ = 0;
};

// ---------------------------------------------------------------------------
// ScopeGuard — run a cleanup function on scope exit (dismissable)
// ---------------------------------------------------------------------------

template <typename F>
class ScopeGuard {
public:
    explicit ScopeGuard(F fn) : fn_(std::move(fn)), active_(true) {}
    ~ScopeGuard() { if (active_) fn_(); }
    void dismiss() noexcept { active_ = false; }

    ScopeGuard(const ScopeGuard&) = delete;
    ScopeGuard& operator=(const ScopeGuard&) = delete;
    ScopeGuard(ScopeGuard&&) = default;

private:
    F    fn_;
    bool active_;
};

template <typename F>
ScopeGuard<F> make_scope_guard(F f) {
    return ScopeGuard<F>(std::move(f));
}

} // namespace utils
`,w=`Lorem Ipsum — De Finibus Bonorum et Malorum

  I. The Nature of Pleasure and Pain

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  II. On the Pursuit of Virtue

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
sequi nesciunt.

  — Cicero, 45 BC
`,T=`Lorem Ipsum — De Finibus Bonorum et Malorum
Translated excerpt, formatted for practice.

══════════════════════════════════════════════════════════════════

  Part I. Introduction to Philosophy

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur.

  1.1 On the Nature of Good

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
veritatis et quasi architecto beatae vitae dicta sunt explicabo.

  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
  fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
  sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
  sit amet, consectetur, adipisci velit.

  1.2 On the Nature of Evil

Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
nisi ut aliquid ex ea commodi consequatur?

══════════════════════════════════════════════════════════════════

  Part II. The Virtuous Life

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus
qui blanditiis praesentium voluptatum deleniti atque corrupti.

  2.1 Courage and Wisdom

Quos dolores et quas molestias excepturi sint occaecati cupiditate non
provident, similique sunt in culpa qui officia deserunt mollitia animi, id
est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
distinctio.

  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
  impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
  assumenda est, omnis dolor repellendus.

  2.2 Justice and Temperance

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus
saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis.

══════════════════════════════════════════════════════════════════

  — Cicero, De Finibus Bonorum et Malorum, 45 BC
`,E=`Lorem Ipsum — De Finibus Bonorum et Malorum
A comprehensive excerpt for advanced practice sessions.

══════════════════════════════════════════════════════════════════════════

  BOOK I — The Nature of Pleasure

  Chapter 1. The Foundations of Epicurean Thought

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
est laborum et dolorum fuga.

  Chapter 2. On the Pursuit of Happiness

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
  consectetur, adipisci velit, sed quia non numquam eius modi tempora
  incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

  Chapter 3. The Role of the Senses

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
pariatur?

──────────────────────────────────────────────────────────────────────────

  BOOK II — Stoic Philosophy and Virtue

  Chapter 4. On Courage

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
praesentium voluptatum deleniti atque corrupti quos dolores et quas
molestias excepturi sint occaecati cupiditate non provident, similique sunt
in culpa qui officia deserunt mollitia animi, id est laborum et dolorum.

  Fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
  libero tempore, cum soluta nobis est eligendi optio cumque nihil
  impedit quo minus id quod maxime placeat facere possimus.

  Chapter 5. On Wisdom and Knowledge

Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus
maiores alias consequatur aut perferendis doloribus asperiores repellat.

  Chapter 6. The Examined Life

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel sapien
non lectus dignissim vehicula. Vestibulum ante ipsum primis in faucibus orci
luctus et ultrices posuere cubilia curae. Aenean commodo ligula eget dolor.

  Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
  montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
  pellentesque eu, pretium quis, sem.

──────────────────────────────────────────────────────────────────────────

  BOOK III — Justice and Society

  Chapter 7. The Social Contract

Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet
nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.

  Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
  vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat
  vitae, eleifend ac, enim.

  Chapter 8. Rights and Obligations

Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.

  Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum
  rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed.

  Chapter 9. The Common Good

Ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero
venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros.

──────────────────────────────────────────────────────────────────────────

  BOOK IV — Conclusions and Reflections

  Chapter 10. Synthesis

Faucibus fermentum. Pellentesque ut neque. Pellentesque habitant morbi
tristique senectus et netus et malesuada fames ac turpis egestas. In dui
magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis
tortor malesuada pretium. Pellentesque auctor neque.

  Nulla vulputate aliquam lectus. Sed augue ipsum, egestas nec, vestibulum
  et, malesuada adipiscing, dui. Vestibulum ante ipsum primis in faucibus
  orci luctus et ultrices posuere cubilia curae.

  Chapter 11. Final Meditations

Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In
porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque
at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem
venenatis eleifend. Ut nonummy.

══════════════════════════════════════════════════════════════════════════

  — Cicero, De Finibus Bonorum et Malorum, 45 BC
  Translated and formatted for educational use.
`,D={go:n,rust:o,python:u,typescript:m,c:v,cpp:S,lorem:T},O={go:{short:e,medium:t,long:r},rust:{short:i,medium:a,long:s},python:{short:c,medium:l,long:d},typescript:{short:f,medium:p,long:h},c:{short:g,medium:_,long:y},cpp:{short:b,medium:x,long:C},lorem:{short:w,medium:T,long:E}};function k(e){return D[e]}function A(e,t){return O[e][t]}export{A as n,k as t};