export const cppFileShort = `/**
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
`

export const cppFileMedium = `/**
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
`

// cppFile is an alias for cppFileMedium for backwards compatibility.
export const cppFile = cppFileMedium

export const cppFileLong = `/**
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
`
