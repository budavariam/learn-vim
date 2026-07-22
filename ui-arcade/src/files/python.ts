export const pythonFile = `"""
utils.py – A collection of general-purpose Python utilities.
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
