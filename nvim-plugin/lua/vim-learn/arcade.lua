-- arcade.lua: Fully-implemented Arcade mode for vim-learn.
-- Mirrors the TypeScript engine from ui-arcade/src/engine/ so logic stays portable.

local M    = {}
local core = require('vim-learn')
local ns   = vim.api.nvim_create_namespace('vim_learn_arcade')

-- ── time helper ──────────────────────────────────────────────────────────────

local function now_ms() return math.floor(vim.loop.hrtime() / 1e6) end

-- ── embedded template files ───────────────────────────────────────────────────
-- ~60-line realistic code snippets, one per language.

local TEMPLATES = {}

TEMPLATES.go = [[package utils

import (
	"fmt"
	"math"
	"sort"
	"strings"
)

type Stack[T any] struct{ items []T }

func (s *Stack[T]) Push(v T)       { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() T         { n := len(s.items) - 1; v := s.items[n]; s.items = s.items[:n]; return v }
func (s *Stack[T]) Peek() T        { return s.items[len(s.items)-1] }
func (s *Stack[T]) Len() int       { return len(s.items) }
func (s *Stack[T]) IsEmpty() bool  { return len(s.items) == 0 }

func Clamp(v, lo, hi float64) float64 {
	return math.Max(lo, math.Min(v, hi))
}

func Lerp(a, b, t float64) float64 { return a + (b-a)*t }

func Contains(slice []string, s string) bool {
	for _, v := range slice {
		if v == s { return true }
	}
	return false
}

func UniqueStrings(slice []string) []string {
	seen := make(map[string]bool)
	out  := []string{}
	for _, s := range slice {
		if !seen[s] { seen[s] = true; out = append(out, s) }
	}
	return out
}

func ChunkSlice[T any](s []T, size int) [][]T {
	var chunks [][]T
	for size < len(s) {
		s, chunks = s[size:], append(chunks, s[:size])
	}
	return append(chunks, s)
}

func MapKeys[K comparable, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m { keys = append(keys, k) }
	sort.Slice(keys, func(i, j int) bool { return fmt.Sprint(keys[i]) < fmt.Sprint(keys[j]) })
	return keys
}

func TrimLines(s string) string {
	lines := strings.Split(s, "\n")
	for i, l := range lines { lines[i] = strings.TrimRight(l, " \t") }
	return strings.Join(lines, "\n")
}
]]

TEMPLATES.typescript = [[/**
 * utils.ts – General-purpose TypeScript utilities.
 */

export class Stack<T> {
  private items: T[] = []
  push(item: T): void  { this.items.push(item) }
  pop(): T             { return this.items.pop()! }
  peek(): T            { return this.items[this.items.length - 1] }
  get size(): number   { return this.items.length }
  isEmpty(): boolean   { return this.items.length === 0 }
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(v, hi))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    ;(acc[k] = acc[k] ?? []).push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function unique<T>(arr: T[], id?: (v: T) => unknown): T[] {
  const seen = new Set<unknown>()
  return arr.filter(v => {
    const k = id ? id(v) : v
    return seen.has(k) ? false : (seen.add(k), true)
  })
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let id: ReturnType<typeof setTimeout>
  return ((...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms) }) as T
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map(k => [k, obj[k]])) as Pick<T, K>
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const ks = new Set(keys as string[])
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !ks.has(k))) as Omit<T, K>
}
]]

TEMPLATES.python = [["""utils.py – General-purpose Python utilities."""

from __future__ import annotations
import math
import itertools
from collections import defaultdict
from typing import TypeVar, Callable, Iterable

T = TypeVar("T")


class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        return self._items[-1]

    def __len__(self):
        return len(self._items)

    def __bool__(self):
        return bool(self._items)


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(v, hi))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def chunk(lst: list, size: int) -> list[list]:
    return [lst[i : i + size] for i in range(0, len(lst), size)]


def unique(iterable: Iterable[T], key: Callable = None) -> list[T]:
    seen, out = set(), []
    for v in iterable:
        k = key(v) if key else v
        if k not in seen:
            seen.add(k)
            out.append(v)
    return out


def group_by(iterable: Iterable[T], key: Callable) -> dict[str, list[T]]:
    result: dict = defaultdict(list)
    for item in iterable:
        result[key(item)].append(item)
    return dict(result)


def flatten(nested: Iterable) -> list:
    return list(itertools.chain.from_iterable(nested))


def deep_get(d: dict, *keys, default=None):
    for k in keys:
        if not isinstance(d, dict):
            return default
        d = d.get(k, default)
    return d
]]

TEMPLATES.rust = [[//! utils.rs – General-purpose Rust utilities.

use std::collections::HashMap;

/// A simple LIFO stack.
pub struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    pub fn new() -> Self                { Self { items: Vec::new() } }
    pub fn push(&mut self, v: T)        { self.items.push(v); }
    pub fn pop(&mut self) -> Option<T>  { self.items.pop() }
    pub fn peek(&self) -> Option<&T>    { self.items.last() }
    pub fn len(&self) -> usize          { self.items.len() }
    pub fn is_empty(&self) -> bool      { self.items.is_empty() }
}

pub fn clamp<T: PartialOrd>(v: T, lo: T, hi: T) -> T {
    if v < lo { lo } else if v > hi { hi } else { v }
}

pub fn lerp(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * t
}

pub fn chunk<T: Clone>(v: &[T], size: usize) -> Vec<Vec<T>> {
    v.chunks(size).map(|c| c.to_vec()).collect()
}

pub fn unique<T: Eq + std::hash::Hash + Clone>(v: &[T]) -> Vec<T> {
    let mut seen = std::collections::HashSet::new();
    v.iter().filter(|x| seen.insert(*x)).cloned().collect()
}

pub fn group_by<T, K, F>(v: Vec<T>, key: F) -> HashMap<K, Vec<T>>
where
    K: Eq + std::hash::Hash,
    F: Fn(&T) -> K,
{
    let mut map: HashMap<K, Vec<T>> = HashMap::new();
    for item in v {
        map.entry(key(&item)).or_default().push(item);
    }
    map
}

pub fn flatten<T>(v: Vec<Vec<T>>) -> Vec<T> {
    v.into_iter().flatten().collect()
}

pub fn debounce_flag(last: &mut std::time::Instant, ms: u64) -> bool {
    let now = std::time::Instant::now();
    if now.duration_since(*last).as_millis() >= ms as u128 {
        *last = now;
        true
    } else {
        false
    }
}
]]

TEMPLATES.c = TEMPLATES.go    -- fallback; nvim C highlighting still works
TEMPLATES.cpp = TEMPLATES.rust -- fallback

-- ── score engine ─────────────────────────────────────────────────────────────

local GUIDED_FRACTION = 0.20
local SURVIVAL_MULT   = 1.5
local MIN_CATEGORIES  = 3

local DEFAULT_CATEGORY_NAMES = {
  'Cursor movement',
  'Editing',
  'Insert mode, inserting/appending text',
  'Cut and paste',
  'Search and replace',
  'Text objects',
}

local function get_time_rating(elapsed, limit)
  local f = elapsed / limit
  if f <= 0.25 then return { multiplier = 3.0, rating = 'lightning' } end
  if f <= 0.50 then return { multiplier = 2.0, rating = 'fast' }      end
  if f <= 0.75 then return { multiplier = 1.5, rating = 'good' }      end
  return { multiplier = 1.0, rating = 'completed' }
end

local function get_combo_multiplier(count)
  if count >= 12 then return 3.0 end
  if count >= 8  then return 2.5 end
  if count >= 5  then return 2.0 end
  if count >= 3  then return 1.5 end
  return 1.0
end

local function calculate_points(base, time_mult, combo_mult, guided)
  local raw = math.floor(base * time_mult * combo_mult)
  return guided and math.max(1, math.floor(raw * GUIDED_FRACTION)) or raw
end

local function get_base_points(level) return 100 + level * 50 end

local function get_time_limit(level, ceiling, mode)
  local base  = 10000
  local red   = math.max(0, ceiling - level) * 500
  local limit = math.max(3000, base - red)
  return (mode == 'survival') and math.floor(limit * SURVIVAL_MULT) or limit
end

-- ── level engine ─────────────────────────────────────────────────────────────

local CEILING_THRESHOLD = 0.75

local function get_level_completion(level, progress, commands, rep_target)
  local at_level, met = 0, 0
  for _, cmd in ipairs(commands) do
    if cmd.level == level then
      at_level = at_level + 1
      local cnt = (progress[level] and progress[level].completion_counts[cmd.id]) or 0
      if cnt >= rep_target then met = met + 1 end
    end
  end
  return at_level == 0 and 1.0 or (met / at_level)
end

local function try_advance_ceiling(ceiling, progress, commands, rep_target)
  if ceiling >= 9 then return 9 end
  local pct = get_level_completion(ceiling, progress, commands, rep_target)
  return pct >= CEILING_THRESHOLD and math.min(9, ceiling + 1) or ceiling
end

local function pick_challenge_level(ceiling, warmup_remaining)
  if warmup_remaining > 0 then return 0 end
  if ceiling == 0         then return 0 end
  if math.random() < 0.4  then return ceiling end
  return math.random(0, ceiling - 1)
end

local function get_warmup_count(starting_level)
  if starting_level <= 1 then return 3 end
  if starting_level <= 4 then return 2 end
  return 1
end

local function should_increase_concurrent(completed, current)
  if current >= 4  then return false end
  return completed > 0 and completed % 10 == 0
end

local function should_show_solution(guided_mode, occurrence_index, has_failure, is_verification)
  if is_verification                 then return false end
  if guided_mode == 'none'           then return false end
  if guided_mode == 'all'            then return true  end
  if guided_mode == 'first_only'     then return occurrence_index == 0 end
  if guided_mode == 'alternating'    then return occurrence_index % 2 == 0 end
  if guided_mode == 'after_failure'  then return has_failure end
  if guided_mode == 'first_then_failure' then return occurrence_index == 0 or has_failure end
  return false
end

local function pick_next_command(commands, target_level, active_ids, progress, rep_target, pending)
  -- Pending verification gets highest priority
  if #pending > 0 then
    local pid = pending[1]
    for _, cmd in ipairs(commands) do
      if cmd.id == pid and not active_ids[cmd.id] then return cmd, true end
    end
  end

  local not_active = {}
  for _, cmd in ipairs(commands) do
    if not active_ids[cmd.id] then table.insert(not_active, cmd) end
  end

  local function get_count(cmd)
    return (progress[cmd.level] and progress[cmd.level].completion_counts[cmd.id]) or 0
  end

  -- target level, below rep target → prefer least completed
  local at_target_below = {}
  for _, cmd in ipairs(not_active) do
    if cmd.level == target_level and get_count(cmd) < rep_target then
      table.insert(at_target_below, cmd)
    end
  end
  if #at_target_below > 0 then
    table.sort(at_target_below, function(a, b) return get_count(a) < get_count(b) end)
    local min_cnt = get_count(at_target_below[1])
    local least = {}
    for _, cmd in ipairs(at_target_below) do
      if get_count(cmd) == min_cnt then table.insert(least, cmd) end
    end
    return least[math.random(#least)], false
  end

  -- target level, any
  local at_target = {}
  for _, cmd in ipairs(not_active) do
    if cmd.level == target_level then table.insert(at_target, cmd) end
  end
  if #at_target > 0 then return at_target[math.random(#at_target)], false end

  -- any level, below rep target
  local any_below = {}
  for _, cmd in ipairs(not_active) do
    if get_count(cmd) < rep_target then table.insert(any_below, cmd) end
  end
  if #any_below > 0 then
    table.sort(any_below, function(a, b) return get_count(a) < get_count(b) end)
    local min_cnt = get_count(any_below[1])
    local least = {}
    for _, cmd in ipairs(any_below) do
      if get_count(cmd) == min_cnt then table.insert(least, cmd) end
    end
    return least[math.random(#least)], false
  end

  if #not_active > 0 then return not_active[math.random(#not_active)], false end
  return nil, false
end

-- ── high score file ───────────────────────────────────────────────────────────

local SCORE_FILE = vim.fn.stdpath('data') .. '/vim-learn-arcade-scores.json'
local MAX_SCORES = 10

local function load_high_scores()
  local empty = { general = {}, timed_challenge = {}, survival = {} }
  local ok_r, lines = pcall(vim.fn.readfile, SCORE_FILE)
  if not ok_r or not lines or #lines == 0 then return empty end
  local ok_j, parsed = pcall(vim.json.decode, table.concat(lines, '\n'))
  if not ok_j or type(parsed) ~= 'table' then return empty end
  parsed.general         = parsed.general         or {}
  parsed.timed_challenge = parsed.timed_challenge or {}
  parsed.survival        = parsed.survival        or {}
  return parsed
end

local function save_high_score(entry)
  local scores = load_high_scores()
  local list   = scores[entry.mode] or {}
  table.insert(list, entry)
  if entry.mode == 'survival' then
    table.sort(list, function(a, b) return (a.achieved_time_ms or 0) > (b.achieved_time_ms or 0) end)
  else
    table.sort(list, function(a, b) return (a.score or 0) > (b.score or 0) end)
  end
  while #list > MAX_SCORES do table.remove(list) end
  scores[entry.mode] = list
  vim.fn.mkdir(vim.fn.fnamemodify(SCORE_FILE, ':h'), 'p')
  pcall(vim.fn.writefile, { vim.json.encode(scores) }, SCORE_FILE)
end

-- ── game state ────────────────────────────────────────────────────────────────

local gs = {
  -- status: 'idle' | 'setup' | 'warmup' | 'playing' | 'results'
  status         = 'idle',
  config         = nil,
  challenges     = {},
  max_concurrent = 1,
  ceiling        = 0,
  score          = 0,
  combo          = { count = 0, multiplier = 1.0 },
  level_progress = {},
  session_stats  = {},
  level_pct      = 0,
  elapsed_ms     = 0,
  pending_verifications = {},
  -- data
  commands       = {},
  solution_set   = {},
  prefix_set     = {},
  -- UI
  tab_nr         = nil,
  editor_win     = nil,  editor_buf  = nil,
  panel_win      = nil,  panel_buf   = nil,
  -- internals
  timer          = nil,
  key_ns         = nil,
  key_buffer     = '',
  last_cmdline   = '',
  start_ms       = 0,
  autogrp        = nil,
}

local function reset_gs()
  if gs.timer then gs.timer:stop(); gs.timer:close(); gs.timer = nil end
  if gs.key_ns then pcall(vim.on_key, nil, gs.key_ns); gs.key_ns = nil end
  if gs.autogrp then pcall(vim.api.nvim_del_augroup_by_id, gs.autogrp); gs.autogrp = nil end
  gs.challenges             = {}
  gs.max_concurrent         = 1
  gs.ceiling                = 0
  gs.score                  = 0
  gs.combo                  = { count = 0, multiplier = 1.0 }
  gs.level_progress         = {}
  gs.level_pct              = 0
  gs.elapsed_ms             = 0
  gs.pending_verifications  = {}
  gs.key_buffer             = ''
  gs.last_cmdline           = ''
end

local function ensure_level_progress(level)
  if not gs.level_progress[level] then
    gs.level_progress[level] = { seen = {}, completion_counts = {}, failure_counts = {} }
  end
end

-- ── build solution sets ───────────────────────────────────────────────────────

local function build_solution_sets()
  gs.solution_set = {}
  gs.prefix_set   = {}
  for _, cmd in ipairs(gs.commands) do
    for _, sol in ipairs(cmd.solution or {}) do
      if sol and sol ~= '' then
        gs.solution_set[sol] = true
        for i = 1, #sol do
          gs.prefix_set[sol:sub(1, i)] = true
        end
      end
    end
  end
end

-- ── challenge creation ────────────────────────────────────────────────────────

local function create_challenge(cmd, is_verification)
  local prog     = gs.level_progress[cmd.level]
  local seen_ct  = prog and (prog.seen[cmd.id] and 1 or 0) or 0
  local comp_ct  = prog and (prog.completion_counts[cmd.id] or 0) or 0
  local occ_idx  = seen_ct + comp_ct
  local has_fail = prog and (prog.failure_counts[cmd.id] or 0) > 0 or false

  local show_sol = should_show_solution(
    gs.config.guided_mode, occ_idx, has_fail, is_verification
  )
  local limit = get_time_limit(cmd.level, gs.ceiling, gs.config.mode)

  return {
    id             = tostring(math.random(1e9)),
    command_id     = cmd.id,
    level          = cmd.level,
    category       = cmd.category or '',
    question       = cmd.question or '',
    solution       = cmd.solution or {},
    started_at     = now_ms(),
    time_limit     = limit,
    status         = 'active',
    points_earned  = 0,
    show_solution  = show_sol,
    is_verification = is_verification,
  }
end

-- ── challenge slot filling ─────────────────────────────────────────────────────

local function fill_slots()
  local active_ids  = {}
  local active_count = 0
  for _, ch in ipairs(gs.challenges) do
    if ch.status == 'active' then
      active_ids[ch.command_id] = true
      active_count = active_count + 1
    end
  end
  local to_fill = gs.max_concurrent - active_count
  if to_fill <= 0 then return end

  local warmup_target = get_warmup_count(gs.config.starting_level)
  local warmup_remaining = gs.status == 'warmup'
    and math.max(0, warmup_target - gs.session_stats.completed) or 0

  for i = 1, to_fill do
    local wi = warmup_remaining - (i - 1)
    local target_level = pick_challenge_level(gs.ceiling, wi)
    local cmd, is_ver = pick_next_command(
      gs.commands, target_level, active_ids,
      gs.level_progress, gs.config.repetition_target,
      gs.pending_verifications
    )
    if cmd then
      if is_ver then
        table.remove(gs.pending_verifications, 1)
      end
      ensure_level_progress(cmd.level)
      gs.level_progress[cmd.level].seen[cmd.id] = true
      local ch = create_challenge(cmd, is_ver)
      table.insert(gs.challenges, ch)
      gs.session_stats.expected_time_ms = gs.session_stats.expected_time_ms + ch.time_limit
      active_ids[cmd.id] = true
    end
  end
end

-- ── tick ─────────────────────────────────────────────────────────────────────

local render_panel  -- forward declaration
local end_game      -- forward declaration

local function tick()
  if gs.status ~= 'playing' and gs.status ~= 'warmup' then return end

  local now     = now_ms()
  gs.elapsed_ms = now - gs.start_ms

  -- Timed challenge: end when session time up
  if gs.config.mode == 'timed_challenge' and gs.config.timed_duration_ms then
    if gs.elapsed_ms >= gs.config.timed_duration_ms then
      end_game()
      return
    end
  end

  -- Dynamic assist: auto-reveal solution at the configured % of the time limit.
  -- In survival mode it is capped at 100% (config already stores the capped value).
  if gs.config.dynamic_assist then
    local pct = gs.config.dynamic_assist
    for _, ch in ipairs(gs.challenges) do
      if ch.status == 'active' and not ch.show_solution then
        local elapsed = now - ch.started_at
        if elapsed >= ch.time_limit * (pct / 100) then
          ch.show_solution = true
        end
      end
    end
  end

  -- Expire timed-out active challenges
  local failed_this_tick = 0
  for _, ch in ipairs(gs.challenges) do
    if ch.status == 'active' and (now - ch.started_at) > ch.time_limit then
      ch.status = 'failed'
      failed_this_tick = failed_this_tick + 1
      ensure_level_progress(ch.level)
      local fc = gs.level_progress[ch.level].failure_counts
      fc[ch.command_id] = (fc[ch.command_id] or 0) + 1
    end
  end

  if failed_this_tick > 0 then
    gs.combo = { count = 0, multiplier = 1.0 }
    gs.session_stats.failed = gs.session_stats.failed + failed_this_tick
    gs.session_stats.total  = gs.session_stats.total  + failed_this_tick
    -- Survival: first failure ends the game
    if gs.config.mode == 'survival' then
      gs.session_stats.achieved_time_ms = gs.elapsed_ms
      end_game()
      return
    end
  end

  -- Trim settled challenges (keep 600ms display window)
  local keep = {}
  for _, ch in ipairs(gs.challenges) do
    if ch.status == 'active' then
      table.insert(keep, ch)
    else
      local done_at = ch.started_at + (ch.status == 'failed' and ch.time_limit or 0)
      if (now - done_at) < 600 then
        table.insert(keep, ch)
      end
    end
  end
  gs.challenges = keep

  -- Advance warmup → playing
  if gs.status == 'warmup' then
    local wt = get_warmup_count(gs.config.starting_level)
    if gs.session_stats.completed >= wt then gs.status = 'playing' end
  end

  -- Fill empty slots
  fill_slots()

  -- Recompute level progress %
  gs.level_pct = get_level_completion(
    gs.ceiling, gs.level_progress, gs.commands, gs.config.repetition_target
  ) * 100

  render_panel()
end

-- ── command execution ─────────────────────────────────────────────────────────

local function check_and_complete_challenge(cmd_str)
  for _, ch in ipairs(gs.challenges) do
    if ch.status == 'active' then
      for _, sol in ipairs(ch.solution) do
        if sol == cmd_str then
          -- Found a match
          local now     = now_ms()
          local elapsed = now - ch.started_at
          local rating  = get_time_rating(elapsed, ch.time_limit)
          local new_cnt = gs.combo.count + 1
          local cmb     = get_combo_multiplier(new_cnt)
          local pts     = calculate_points(
            get_base_points(ch.level), rating.multiplier, cmb, ch.show_solution
          )

          ch.status        = 'completed'
          ch.points_earned = pts

          gs.score          = gs.score + pts
          gs.combo          = { count = new_cnt, multiplier = cmb }
          gs.session_stats.completed = gs.session_stats.completed + 1
          gs.session_stats.total     = gs.session_stats.total     + 1
          gs.session_stats.total_pts = gs.session_stats.total_pts + pts
          gs.session_stats.best_combo = math.max(gs.session_stats.best_combo, new_cnt)

          ensure_level_progress(ch.level)
          local lp = gs.level_progress[ch.level]
          lp.completion_counts[ch.command_id] =
            (lp.completion_counts[ch.command_id] or 0) + 1

          -- Schedule blind verification for first_only / first_then_failure
          if ch.show_solution and not ch.is_verification and
             (gs.config.guided_mode == 'first_only' or
              gs.config.guided_mode == 'first_then_failure') then
            table.insert(gs.pending_verifications, ch.command_id)
          end

          -- Try ceiling advance
          local new_ceil = try_advance_ceiling(
            gs.ceiling, gs.level_progress, gs.commands, gs.config.repetition_target
          )
          if new_ceil > gs.ceiling then
            gs.ceiling = new_ceil
            vim.notify(
              string.format('vim-learn arcade: ▲ Level %d unlocked!', gs.ceiling),
              vim.log.levels.INFO
            )
          end

          -- Grow concurrent slot
          if should_increase_concurrent(gs.session_stats.completed, gs.max_concurrent) then
            gs.max_concurrent = gs.max_concurrent + 1
          end

          -- Combo notification
          if new_cnt >= 3 then
            vim.notify(
              string.format('vim-learn arcade: 🔥 %d× COMBO! +%d pts', new_cnt, pts),
              vim.log.levels.INFO
            )
          else
            local icons = { lightning = '⚡', fast = '🚀', good = '✓', completed = '✓' }
            local icon  = icons[rating.rating] or '✓'
            vim.notify(
              string.format('vim-learn arcade: %s %s  +%d pts', icon, rating.rating:upper(), pts),
              vim.log.levels.INFO
            )
          end

          fill_slots()
          gs.level_pct = get_level_completion(
            gs.ceiling, gs.level_progress, gs.commands, gs.config.repetition_target
          ) * 100
          render_panel()
          return
        end
      end
    end
  end
end

-- ── key interception ─────────────────────────────────────────────────────────

local function process_normal_key(key)
  local candidate = gs.key_buffer .. key

  if gs.solution_set[candidate] then
    check_and_complete_challenge(candidate)
    gs.key_buffer = ''
  elseif gs.prefix_set[candidate] then
    gs.key_buffer = candidate
  else
    -- dead end: retry with just this key
    gs.key_buffer = ''
    if gs.solution_set[key] then
      check_and_complete_challenge(key)
    elseif gs.prefix_set[key] then
      gs.key_buffer = key
    end
  end
end

local function setup_key_interceptor()
  gs.key_ns = vim.api.nvim_create_namespace('vim_arcade_keys_' .. tostring(math.random(1e9)))

  vim.on_key(function(raw_key)
    if not raw_key or raw_key == '' then return end
    vim.schedule(function()
      if gs.status ~= 'playing' and gs.status ~= 'warmup' then return end
      if not gs.editor_buf then return end
      if vim.api.nvim_get_current_buf() ~= gs.editor_buf then return end

      local key = vim.fn.keytrans(raw_key)
      if not key or key == '' then return end

      if key == '<Esc>' then
        gs.key_buffer = ''
        return
      end

      local mode = vim.fn.mode()
      if mode ~= 'n' then
        gs.key_buffer = ''
        return
      end

      process_normal_key(key)
    end)
  end, gs.key_ns)

  -- Ex command detection via autocmds
  gs.autogrp = vim.api.nvim_create_augroup('VimLearnArcadeKeys', { clear = true })
  vim.api.nvim_create_autocmd('CmdlineChanged', {
    group    = gs.autogrp,
    callback = function() gs.last_cmdline = vim.fn.getcmdline() end,
  })
  vim.api.nvim_create_autocmd('CmdlineLeave', {
    group    = gs.autogrp,
    callback = function()
      local line = gs.last_cmdline
      gs.last_cmdline = ''
      if line and line ~= '' then
        vim.schedule(function()
          check_and_complete_challenge(':' .. line)
        end)
      end
    end,
  })
end

-- ── panel rendering ───────────────────────────────────────────────────────────

render_panel = function()
  if not gs.panel_buf or not vim.api.nvim_buf_is_valid(gs.panel_buf) then return end

  local lines, hls = {}, {}
  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end
  local function push(s)
    s = s or ''
    local lnum = #lines
    table.insert(lines, s)
    return lnum
  end

  local w = gs.panel_buf and vim.api.nvim_win_is_valid(gs.panel_win or -1)
    and vim.api.nvim_win_get_width(gs.panel_win) or 40
  local sep = string.rep('─', w - 1)

  -- Header
  local title_lnum = push(' VIM ARCADE')
  hl(title_lnum, 1, 11, 'Title')

  -- Mode badge
  local mode_badges = {
    general         = 'General',
    timed_challenge = 'Timed',
    survival        = '⚠ SURVIVAL',
  }
  local mode_str = (mode_badges[gs.config.mode] or gs.config.mode) ..
    '  ' .. (gs.config.language or '')
  local mode_lnum = push(' ' .. mode_str)
  hl(mode_lnum, 0, -1, gs.config.mode == 'survival' and 'WarningMsg' or 'Comment')

  push(sep)

  -- Score
  local score_lnum = push(string.format(' Score: %s', gs.score))
  hl(score_lnum, 1, 7, 'Keyword')
  hl(score_lnum, 8, -1, 'Number')

  -- Combo
  if gs.combo.count >= 2 then
    local combo_lnum = push(string.format(' Combo: %d×  ×%.1f', gs.combo.count, gs.combo.multiplier))
    hl(combo_lnum, 1, 7, 'Keyword')
    hl(combo_lnum, 8, -1, 'Special')
  else
    push('')
  end

  -- Level
  local lv_lnum = push(string.format(' Level: %d  %d%%→%d', gs.ceiling, math.floor(gs.level_pct), gs.ceiling + 1))
  hl(lv_lnum, 1, 7, 'Keyword')
  hl(lv_lnum, 8, -1, 'String')

  -- Timed countdown
  if gs.config.mode == 'timed_challenge' and gs.config.timed_duration_ms then
    local rem = math.max(0, math.ceil((gs.config.timed_duration_ms - gs.elapsed_ms) / 1000))
    local bar_total = w - 3
    local bar_fill  = math.floor(bar_total * (1 - gs.elapsed_ms / gs.config.timed_duration_ms))
    bar_fill = math.max(0, math.min(bar_total, bar_fill))
    local bar = '[' .. string.rep('█', bar_fill) .. string.rep('░', bar_total - bar_fill) .. ']'
    local t_lnum = push(string.format(' Time: %ds', rem))
    hl(t_lnum, 1, 6, 'Keyword')
    local bar_lnum = push(' ' .. bar)
    hl(bar_lnum, 0, -1, rem < 30 and 'WarningMsg' or 'String')
  end

  push(sep)

  -- Challenges
  local active = {}
  for _, ch in ipairs(gs.challenges) do
    if ch.status == 'active' then table.insert(active, ch) end
  end

  local ch_hdr_lnum = push(string.format(' Challenges (%d)', #active))
  hl(ch_hdr_lnum, 1, -1, 'Title')

  if #active == 0 then
    local w_lnum = push('  loading…')
    hl(w_lnum, 0, -1, 'Comment')
  end

  for _, ch in ipairs(active) do
    push(sep)
    local elapsed    = now_ms() - ch.started_at
    local secs_left  = math.max(0, math.ceil((ch.time_limit - elapsed) / 1000))
    local timer_hl   = secs_left <= 3 and 'WarningMsg' or (secs_left <= 6 and 'Special' or 'String')

    local cat_lnum = push(string.format('  [%ds] %s  Lv%d%s',
      secs_left, ch.category, ch.level,
      ch.is_verification and '  🔍verify' or ''))
    hl(cat_lnum, 2, 6, timer_hl)
    hl(cat_lnum, 7, -1, core.get_category_hl(ch.category))

    -- Wrap question text
    local q = ch.question
    local max_w = w - 4
    while #q > 0 do
      local chunk = q:sub(1, max_w)
      local q_lnum = push('  ' .. chunk)
      hl(q_lnum, 0, -1, 'Normal')
      q = q:sub(max_w + 1)
    end

    -- Solution hint (guided mode)
    if ch.show_solution and #ch.solution > 0 then
      local sol_lnum = push('  → ' .. table.concat(ch.solution, '  '))
      hl(sol_lnum, 2, 4, 'NonText')
      hl(sol_lnum, 4, -1, 'Keyword')
    end
  end

  push(sep)
  local hint_lnum = push(' [q] quit  ⌘⇧P settings')
  hl(hint_lnum, 0, -1, 'Comment')

  vim.bo[gs.panel_buf].modifiable = true
  vim.api.nvim_buf_set_lines(gs.panel_buf, 0, -1, false, lines)
  vim.bo[gs.panel_buf].modifiable = false

  vim.api.nvim_buf_clear_namespace(gs.panel_buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(gs.panel_buf, ns, h[4], h[1], h[2], h[3])
  end
end

-- ── results rendering ─────────────────────────────────────────────────────────

local function render_results()
  if not gs.panel_buf or not vim.api.nvim_buf_is_valid(gs.panel_buf) then return end

  local st   = gs.session_stats
  local acc  = st.total > 0 and math.floor(st.completed / st.total * 100) or 0
  local dur_s = math.floor(gs.elapsed_ms / 1000)
  local lines, hls = {}, {}
  local function hl(lnum, cs, ce, grp) table.insert(hls, { lnum, cs, ce, grp }) end
  local function push(s)
    local lnum = #lines; table.insert(lines, s or ''); return lnum
  end

  local h_lnum = push(' GAME OVER')
  hl(h_lnum, 1, -1, 'Title')
  push('')

  local score_lnum = push(string.format('  %d pts', gs.score))
  hl(score_lnum, 2, -1, 'Number')

  push(string.format('  Completed : %d', st.completed))
  push(string.format('  Failed    : %d', st.failed))
  push(string.format('  Accuracy  : %d%%', acc))
  push(string.format('  Best combo: %d×', st.best_combo))
  push(string.format('  Duration  : %ds', dur_s))
  push(string.format('  Level     : %d', gs.ceiling))

  if gs.config.mode == 'survival' and st.achieved_time_ms and st.achieved_time_ms > 0 then
    push('')
    local surv_lnum = push(string.format('  Survived  : %ds / exp %ds',
      math.floor(st.achieved_time_ms / 1000),
      math.floor((st.expected_time_ms or 0) / 1000)))
    hl(surv_lnum, 2, -1, 'Special')
  end

  push('')
  local q_lnum = push('  [q] quit  [r] play again')
  hl(q_lnum, 0, -1, 'Comment')

  vim.bo[gs.panel_buf].modifiable = true
  vim.api.nvim_buf_set_lines(gs.panel_buf, 0, -1, false, lines)
  vim.bo[gs.panel_buf].modifiable = false
  vim.api.nvim_buf_clear_namespace(gs.panel_buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(gs.panel_buf, ns, h[4], h[1], h[2], h[3])
  end
end

-- ── end game ─────────────────────────────────────────────────────────────────

end_game = function()
  if gs.timer then gs.timer:stop() end
  if gs.key_ns then pcall(vim.on_key, nil, gs.key_ns); gs.key_ns = nil end
  if gs.autogrp then pcall(vim.api.nvim_del_augroup_by_id, gs.autogrp); gs.autogrp = nil end
  gs.status = 'results'

  -- Save high score
  local st  = gs.session_stats
  local acc = st.total > 0 and st.completed / st.total or 0
  save_high_score({
    id                  = tostring(math.random(1e9)),
    timestamp           = os.time(),
    score               = gs.score,
    mode                = gs.config.mode,
    language            = gs.config.language,
    starting_level      = gs.config.starting_level,
    repetition_target   = gs.config.repetition_target,
    guided_mode         = gs.config.guided_mode,
    challenges_completed = st.completed,
    challenges_failed   = st.failed,
    accuracy            = acc,
    session_duration_ms = gs.elapsed_ms,
    expected_time_ms    = st.expected_time_ms or 0,
    achieved_time_ms    = st.achieved_time_ms or 0,
  })

  render_results()

  -- Wire [r] to restart in results
  if gs.panel_buf and vim.api.nvim_buf_is_valid(gs.panel_buf) then
    local o = { buffer = gs.panel_buf, noremap = true, silent = true }
    vim.keymap.set('n', 'r', function()
      M.close()
      M.open_arcade()
    end, o)
  end
end

-- ── game start ────────────────────────────────────────────────────────────────

local function start_game(config)
  reset_gs()
  gs.config  = config
  gs.ceiling = math.min(config.starting_level, 9)
  gs.status  = get_warmup_count(config.starting_level) > 0 and 'warmup' or 'playing'
  gs.session_stats = {
    completed = 0, failed = 0, total = 0,
    total_pts = 0, best_combo = 0,
    expected_time_ms = 0, achieved_time_ms = 0,
  }
  gs.start_ms = now_ms()

  -- Load commands and filter by selected categories
  local all_cmds = core.get_data()
  if config.categories then
    local cat_set = {}
    for _, cat in ipairs(config.categories) do cat_set[cat] = true end
    gs.commands = vim.tbl_filter(function(c) return cat_set[c.category] end, all_cmds)
  else
    gs.commands = all_cmds
  end
  if #gs.commands == 0 then
    vim.notify('vim-learn arcade: no data loaded — check data_path in setup()', vim.log.levels.ERROR)
    -- Fix (Bug #10): reset status so open_arcade() is not permanently blocked
    reset_gs()
    gs.status = 'idle'
    return
  end

  math.randomseed(os.time())
  core.setup_category_highlights()
  build_solution_sets()

  -- ── Open UI ──────────────────────────────────────────────────────────────
  -- New tab keeps the user's workspace intact
  vim.cmd('tabnew')
  gs.tab_nr = vim.api.nvim_get_current_tabpage()

  -- Left: scratch editor buffer with template
  gs.editor_buf = vim.api.nvim_create_buf(true, true)
  vim.bo[gs.editor_buf].bufhidden  = 'wipe'
  vim.bo[gs.editor_buf].filetype   = config.language
  vim.bo[gs.editor_buf].modifiable = true
  local template = TEMPLATES[config.language] or TEMPLATES.go
  vim.api.nvim_buf_set_lines(gs.editor_buf, 0, -1, false, vim.split(template, '\n'))
  vim.api.nvim_set_current_buf(gs.editor_buf)
  gs.editor_win = vim.api.nvim_get_current_win()

  -- Right: panel (vertical split on the right, 44 cols wide)
  local panel_width = 44
  vim.cmd('botright ' .. panel_width .. 'vsplit')
  gs.panel_buf = vim.api.nvim_create_buf(false, true)
  vim.bo[gs.panel_buf].bufhidden  = 'wipe'
  vim.bo[gs.panel_buf].modifiable = false
  gs.panel_win = vim.api.nvim_get_current_win()
  vim.api.nvim_win_set_buf(gs.panel_win, gs.panel_buf)
  vim.wo[gs.panel_win].number      = false
  vim.wo[gs.panel_win].relativenumber = false
  vim.wo[gs.panel_win].wrap        = true
  vim.wo[gs.panel_win].cursorline  = false
  vim.wo[gs.panel_win].signcolumn  = 'no'

  -- Keymaps for panel: q=quit, [r]=restart (set after end_game)
  local po = { buffer = gs.panel_buf, noremap = true, silent = true }
  vim.keymap.set('n', 'q', M.close, po)

  -- Focus editor
  vim.api.nvim_set_current_win(gs.editor_win)

  -- Initial fill
  fill_slots()
  render_panel()

  -- Start key interceptor
  setup_key_interceptor()

  -- Start 100ms timer
  gs.timer = vim.loop.new_timer()
  gs.timer:start(100, 100, vim.schedule_wrap(tick))
end

-- ── category multi-select ─────────────────────────────────────────────────────

local function get_category_presets()
  return core.get_state().arcade_category_presets or {}
end

local function save_category_preset(name, categories)
  local s = core.get_state()
  if not s.arcade_category_presets then s.arcade_category_presets = {} end
  s.arcade_category_presets = vim.tbl_filter(
    function(p) return p.name ~= name end, s.arcade_category_presets
  )
  table.insert(s.arcade_category_presets, { name = name, categories = categories })
  core.save_state()
end

-- Opens a floating multi-select window.  Calls on_confirm(categories_or_nil) where
-- nil means "all categories selected".  Calls on_cancel() if the user exits without
-- confirming.  Requires at least MIN_CATEGORIES (3) to be selected.
local function open_category_selector(all_cats, initial_selected, on_confirm, on_cancel)
  local win_ns = vim.api.nvim_create_namespace('vim_arcade_catpick')
  local buf    = vim.api.nvim_create_buf(false, true)
  vim.bo[buf].bufhidden = 'wipe'

  local w   = math.min(62, vim.o.columns - 4)
  local h   = math.min(#all_cats + 8, vim.o.lines - 4)
  local col = math.floor((vim.o.columns - w) / 2)
  local row = math.floor((vim.o.lines   - h) / 2)

  local win = vim.api.nvim_open_win(buf, true, {
    relative  = 'editor', width = w, height = h, col = col, row = row,
    style     = 'minimal', border = 'rounded',
    title     = ' Focus Areas (≥3) ', title_pos = 'center',
  })
  vim.wo[win].cursorline = true
  vim.wo[win].scrolloff  = 2

  -- Mutable selection state
  local selected = {}
  for _, c in ipairs(initial_selected) do selected[c] = true end

  local line_to_cat = {}

  local function count_selected()
    local n = 0; for _ in pairs(selected) do n = n + 1 end; return n
  end

  local function render()
    local lines, hls = {}, {}
    local function hl(l, cs, ce, grp) table.insert(hls, { l, cs, ce, grp }) end
    local function push(s) local l = #lines; table.insert(lines, s or ''); return l end
    local sep = string.rep('─', w - 1)

    -- Controls row
    local ctrl_lnum = push(' [a]ll  [n]one  [d]efaults  [p]resets  [s] confirm')
    hl(ctrl_lnum, 0, -1, 'Comment')
    push(sep)

    line_to_cat = {}
    for _, cat in ipairs(all_cats) do
      local on   = selected[cat]
      local mark = on and '●' or '○'
      local lnum = push('  ' .. mark .. ' ' .. cat)
      line_to_cat[lnum] = cat
      hl(lnum, 2, 5, core.get_category_hl(cat))   -- colour the ● / ○
      if not on then hl(lnum, 0, -1, 'Comment') end
    end

    push(sep)
    local n  = count_selected()
    local ok = n >= MIN_CATEGORIES
    local fl = push(string.format(
      ' %d selected%s',
      n,
      ok and '  — press [s] to continue' or string.format('  (need %d more)', MIN_CATEGORIES - n)
    ))
    hl(fl, 0, -1, ok and 'Normal' or 'WarningMsg')

    vim.bo[buf].modifiable = true
    vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
    vim.bo[buf].modifiable = false
    vim.api.nvim_buf_clear_namespace(buf, win_ns, 0, -1)
    for _, h in ipairs(hls) do
      vim.api.nvim_buf_add_highlight(buf, win_ns, h[4], h[1], h[2], h[3])
    end
  end

  core.setup_category_highlights()
  render()
  -- Place cursor on first category item
  pcall(vim.api.nvim_win_set_cursor, win, { 3, 0 })

  local closed = false
  local function close(confirmed)
    if closed then return end
    closed = true
    if vim.api.nvim_win_is_valid(win) then
      vim.api.nvim_win_close(win, true)
    end
    if confirmed then
      local sel_list = {}
      for cat in pairs(selected) do table.insert(sel_list, cat) end
      table.sort(sel_list)
      on_confirm(#sel_list == #all_cats and nil or sel_list)
    else
      on_cancel()
    end
  end

  local function try_confirm()
    if count_selected() >= MIN_CATEGORIES then
      close(true)
    else
      vim.notify(
        string.format('vim-learn arcade: select at least %d categories', MIN_CATEGORIES),
        vim.log.levels.WARN
      )
    end
  end

  local function toggle_cursor()
    local lnum = vim.api.nvim_win_get_cursor(win)[1] - 1
    local cat  = line_to_cat[lnum]
    if cat then
      selected[cat] = selected[cat] and nil or true
      render()
    end
  end

  local o = { buffer = buf, noremap = true, silent = true }

  vim.keymap.set('n', '<Space>', toggle_cursor, o)
  vim.keymap.set('n', '<CR>',   function()
    local lnum = vim.api.nvim_win_get_cursor(win)[1] - 1
    if line_to_cat[lnum] then toggle_cursor() else try_confirm() end
  end, o)
  vim.keymap.set('n', 's',      try_confirm, o)

  vim.keymap.set('n', 'a', function()
    for _, cat in ipairs(all_cats) do selected[cat] = true end; render()
  end, o)
  vim.keymap.set('n', 'n', function()
    selected = {}; render()
  end, o)
  vim.keymap.set('n', 'd', function()
    selected = {}
    for _, cat in ipairs(DEFAULT_CATEGORY_NAMES) do
      if vim.tbl_contains(all_cats, cat) then selected[cat] = true end
    end
    render()
  end, o)

  -- Preset save / load
  vim.keymap.set('n', 'p', function()
    local presets = get_category_presets()
    local names   = vim.tbl_map(function(p) return p.name end, presets)
    table.insert(names, '[+ Save current as preset]')
    vim.ui.select(names, { prompt = 'Presets:' }, function(choice)
      if not choice then return end
      if choice == '[+ Save current as preset]' then
        vim.ui.input({ prompt = 'Preset name: ' }, function(name)
          if not name or name == '' then return end
          local sel_list = {}
          for cat in pairs(selected) do table.insert(sel_list, cat) end
          table.sort(sel_list)
          save_category_preset(name, sel_list)
          vim.notify('vim-learn arcade: preset "' .. name .. '" saved', vim.log.levels.INFO)
        end)
      else
        for _, p in ipairs(presets) do
          if p.name == choice then
            selected = {}
            for _, cat in ipairs(p.categories or {}) do
              if vim.tbl_contains(all_cats, cat) then selected[cat] = true end
            end
            render(); break
          end
        end
      end
    end)
  end, o)

  vim.keymap.set('n', 'q',     function() close(false) end, o)
  vim.keymap.set('n', '<Esc>', function() close(false) end, o)

  vim.api.nvim_create_autocmd('WinLeave', {
    buffer = buf,
    callback = function()
      vim.schedule(function()
        if not closed and vim.api.nvim_get_current_win() ~= win then close(false) end
      end)
    end,
  })
end

-- ── setup wizard ─────────────────────────────────────────────────────────────

local function wizard_step(config, steps, idx, done_cb)
  if idx > #steps then done_cb(config); return end
  local step = steps[idx]
  step(config, function(updated_config)
    wizard_step(updated_config, steps, idx + 1, done_cb)
  end)
end

local function open_setup_wizard()
  local steps = {}

  -- Mode
  table.insert(steps, function(cfg, next)
    vim.ui.select(
      { 'general', 'timed_challenge', 'survival' },
      { prompt = 'Game mode:',
        format_item = function(m)
          local labels = { general='General', timed_challenge='Timed Challenge', survival='Survival ⚠' }
          return labels[m] or m
        end },
      function(choice)
        if not choice then return end
        cfg.mode = choice
        next(cfg)
      end
    )
  end)

  -- Timed duration (only for timed_challenge)
  table.insert(steps, function(cfg, next)
    if cfg.mode ~= 'timed_challenge' then next(cfg); return end
    vim.ui.select(
      { '1', '2', '5', '10', '15' },
      { prompt = 'Duration (minutes):' },
      function(choice)
        if not choice then return end
        cfg.timed_duration_ms = tonumber(choice) * 60000
        next(cfg)
      end
    )
  end)

  -- Language
  table.insert(steps, function(cfg, next)
    vim.ui.select(
      { 'go', 'typescript', 'rust', 'python', 'c', 'cpp' },
      { prompt = 'Language:',
        format_item = function(l)
          local icons = { go='🐹 Go', typescript='🟦 TypeScript', rust='🦀 Rust', python='🐍 Python', c='🔷 C', cpp='🔶 C++' }
          return icons[l] or l
        end },
      function(choice)
        if not choice then return end
        cfg.language = choice
        next(cfg)
      end
    )
  end)

  -- Starting level
  table.insert(steps, function(cfg, next)
    vim.ui.input(
      { prompt = 'Starting level (0–9, 0=beginner): ', default = '0' },
      function(input)
        local level = tonumber(input)
        if not level then return end
        cfg.starting_level = math.max(0, math.min(9, math.floor(level)))
        next(cfg)
      end
    )
  end)

  -- Repetition
  table.insert(steps, function(cfg, next)
    vim.ui.select(
      { '1', '2', '3', '5' },
      { prompt = 'Repetitions per command:',
        format_item = function(v)
          local labels = { ['1']='1× once', ['2']='2× reinforce', ['3']='3× muscle memory', ['5']='5× mastery' }
          return labels[v] or v
        end },
      function(choice)
        if not choice then return end
        cfg.repetition_target = tonumber(choice)
        next(cfg)
      end
    )
  end)

  -- Guided mode
  table.insert(steps, function(cfg, next)
    vim.ui.select(
      { 'none', 'first_only', 'after_failure', 'first_then_failure', 'alternating', 'all' },
      { prompt = 'Guided mode (show solution?):',
        format_item = function(g)
          local labels = {
            none               = 'None — blind',
            first_only         = 'First only, then verify',
            after_failure      = 'After failure',
            first_then_failure = 'First + after failure',
            alternating        = 'Alternating',
            all                = 'Always (minimal points)',
          }
          return labels[g] or g
        end },
      function(choice)
        if not choice then return end
        cfg.guided_mode = choice
        next(cfg)
      end
    )
  end)

  -- Dynamic assist (optional: auto-reveal solution at X% of time limit)
  table.insert(steps, function(cfg, next)
    vim.ui.select(
      { 'off', '30%', '50%', '75%', '100%', '125%', '150%' },
      { prompt = 'Dynamic assist (auto-show solution at % of time limit):',
        format_item = function(v)
          if v == 'off' then return 'Off — no automatic hint' end
          local pct = tonumber(v:match('%d+'))
          local example = string.format('%.1f s with a 10 s limit', 10 * pct / 100)
          local note = (cfg.mode == 'survival' and pct > 100)
            and '  ⚠ capped at 100% in Survival' or ''
          return string.format('%s  (e.g. %s)%s', v, example, note)
        end },
      function(choice)
        if not choice then next(cfg); return end
        if choice == 'off' then
          cfg.dynamic_assist = nil
        else
          local pct = tonumber(choice:match('%d+'))
          cfg.dynamic_assist = (cfg.mode == 'survival') and math.min(100, pct) or pct
        end
        next(cfg)
      end
    )
  end)

  -- Category selection (multi-select floating window)
  table.insert(steps, function(cfg, next)
    local data     = core.get_data()
    local all_cats = {}
    local seen     = {}
    for _, cmd in ipairs(data) do
      if cmd.category and not seen[cmd.category] then
        seen[cmd.category] = true
        table.insert(all_cats, cmd.category)
      end
    end
    table.sort(all_cats)

    -- Default selection: the same 6 essentials as the browser
    local defaults = {}
    for _, cat in ipairs(DEFAULT_CATEGORY_NAMES) do
      if vim.tbl_contains(all_cats, cat) then table.insert(defaults, cat) end
    end

    if #all_cats == 0 then
      -- No data loaded yet; skip the step and use nil (all)
      cfg.categories = nil
      next(cfg)
      return
    end

    open_category_selector(all_cats, defaults, function(cats)
      cfg.categories = cats  -- nil = all
      next(cfg)
    end, function()
      -- User cancelled the whole wizard
    end)
  end)

  local initial_config = {
    mode               = 'general',
    language           = 'go',
    starting_level     = 0,
    repetition_target  = 2,
    guided_mode        = 'none',
    timed_duration_ms  = nil,
    categories         = nil,
    dynamic_assist     = nil,
  }

  wizard_step(initial_config, steps, 1, function(config)
    start_game(config)
  end)
end

-- ── public API ────────────────────────────────────────────────────────────────

function M.open_arcade()
  if gs.status ~= 'idle' then
    vim.notify('vim-learn arcade: game already running', vim.log.levels.WARN)
    return
  end
  open_setup_wizard()
end

function M.close()
  if gs.timer then gs.timer:stop(); gs.timer:close(); gs.timer = nil end
  if gs.key_ns then pcall(vim.on_key, nil, gs.key_ns); gs.key_ns = nil end
  if gs.autogrp then pcall(vim.api.nvim_del_augroup_by_id, gs.autogrp); gs.autogrp = nil end
  -- Close the tab if we opened one.
  -- Fix (Bug #11): tabclose silently fails on the last tab, leaving the arcade
  -- UI visible but the engine idle. If this is the only tab, wipe the buffers instead.
  if gs.tab_nr and vim.api.nvim_tabpage_is_valid(gs.tab_nr) then
    if #vim.api.nvim_list_tabpages() > 1 then
      pcall(vim.cmd, 'tabclose')
    else
      if gs.editor_buf and vim.api.nvim_buf_is_valid(gs.editor_buf) then
        pcall(vim.api.nvim_buf_delete, gs.editor_buf, { force = true })
      end
      if gs.panel_buf and vim.api.nvim_buf_is_valid(gs.panel_buf) then
        pcall(vim.api.nvim_buf_delete, gs.panel_buf, { force = true })
      end
    end
  end
  reset_gs()
  gs.status = 'idle'
end

function M.get_high_scores() return load_high_scores() end

-- Exposed for unit tests
M._test_api = {
  score = {
    get_time_rating      = get_time_rating,
    get_combo_multiplier = get_combo_multiplier,
    calculate_points     = calculate_points,
    get_base_points      = get_base_points,
    get_time_limit       = get_time_limit,
  },
  level = {
    should_show_solution    = should_show_solution,
    pick_challenge_level    = pick_challenge_level,
    get_warmup_count        = get_warmup_count,
    get_level_completion    = get_level_completion,
    try_advance_ceiling     = try_advance_ceiling,
    should_increase_concurrent = should_increase_concurrent,
    pick_next_command       = pick_next_command,
  },
  save_high_score  = save_high_score,
  load_high_scores = load_high_scores,
}

return M
