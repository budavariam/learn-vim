export const goFile = `package utils

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
