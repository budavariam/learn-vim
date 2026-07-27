export const goFileShort = `package utils

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
`

export const goFileMedium = `package utils

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
`

// goFile is an alias for goFileMedium for backwards compatibility.
export const goFile = goFileMedium

export const goFileLong = `package utils

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
`
