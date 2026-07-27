export const rustFileShort = `/// Clamp a value between lo and hi (inclusive).
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
`

export const rustFileMedium = `use std::collections::HashMap;
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
`

// rustFile is an alias for rustFileMedium for backwards compatibility.
export const rustFile = rustFileMedium

export const rustFileLong = `use std::collections::HashMap;
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
`
