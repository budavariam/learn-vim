export const pythonFileShort = `"""stack.py - A generic LIFO stack."""
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
`

export const pythonFileMedium = `"""
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
`

// pythonFile is an alias for pythonFileMedium for backwards compatibility.
export const pythonFile = pythonFileMedium

export const pythonFileLong = `"""
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
`
