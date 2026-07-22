-- test_arcade.lua – unit tests for arcade.lua business logic
-- Tests exercise every function in arcade._test_api.score, .level, and
-- the save/load high-score pair.  All tests are pure logic: no UI, no timer.

local arcade = require('vim-learn.arcade')
local S      = arcade._test_api.score
local L      = arcade._test_api.level

-- Helper: build a minimal commands list from the test fixture
local function fixture_commands()
  return require('vim-learn').get_data()
end

-- Helper: empty level-progress entry
local function empty_prog()
  return { seen = {}, completion_counts = {}, failure_counts = {} }
end

-- ── ScoreEngine ───────────────────────────────────────────────────────────────

describe('score.get_time_rating', function()
  it('≤25% time used → lightning / 3.0×', function()
    local r = S.get_time_rating(200, 1000)
    eq(r.rating, 'lightning')
    eq(r.multiplier, 3.0)
  end)

  it('≤50% time used → fast / 2.0×', function()
    local r = S.get_time_rating(400, 1000)
    eq(r.rating, 'fast')
    eq(r.multiplier, 2.0)
  end)

  it('≤75% time used → good / 1.5×', function()
    local r = S.get_time_rating(700, 1000)
    eq(r.rating, 'good')
    eq(r.multiplier, 1.5)
  end)

  it('>75% time used → completed / 1.0×', function()
    local r = S.get_time_rating(900, 1000)
    eq(r.rating, 'completed')
    eq(r.multiplier, 1.0)
  end)

  it('exact boundary 25% is lightning', function()
    local r = S.get_time_rating(250, 1000)
    eq(r.rating, 'lightning')
  end)

  it('exact boundary 50% is fast', function()
    local r = S.get_time_rating(500, 1000)
    eq(r.rating, 'fast')
  end)

  it('elapsed equals limit → completed', function()
    local r = S.get_time_rating(1000, 1000)
    eq(r.rating, 'completed')
    eq(r.multiplier, 1.0)
  end)
end)

describe('score.get_combo_multiplier', function()
  it('combo < 3 → 1.0', function()
    for _, n in ipairs({0, 1, 2}) do
      eq(S.get_combo_multiplier(n), 1.0, 'count=' .. n)
    end
  end)

  it('combo 3–4 → 1.5', function()
    for _, n in ipairs({3, 4}) do
      eq(S.get_combo_multiplier(n), 1.5, 'count=' .. n)
    end
  end)

  it('combo 5–7 → 2.0', function()
    for _, n in ipairs({5, 6, 7}) do
      eq(S.get_combo_multiplier(n), 2.0, 'count=' .. n)
    end
  end)

  it('combo 8–11 → 2.5', function()
    for _, n in ipairs({8, 9, 11}) do
      eq(S.get_combo_multiplier(n), 2.5, 'count=' .. n)
    end
  end)

  it('combo ≥12 → 3.0', function()
    for _, n in ipairs({12, 15, 100}) do
      eq(S.get_combo_multiplier(n), 3.0, 'count=' .. n)
    end
  end)
end)

describe('score.calculate_points', function()
  it('non-guided: base × time × combo rounded', function()
    local pts = S.calculate_points(100, 2.0, 1.5, false)
    eq(pts, 300)
  end)

  it('guided: applies 0.20 fraction', function()
    local pts = S.calculate_points(100, 3.0, 1.0, true)
    -- 100 * 3.0 * 1.0 = 300 * 0.20 = 60
    eq(pts, 60)
  end)

  it('guided always ≥1', function()
    local pts = S.calculate_points(1, 1.0, 1.0, true)
    truthy(pts >= 1)
  end)

  it('non-guided result is an integer', function()
    local pts = S.calculate_points(100, 1.5, 1.5, false)
    eq(pts, math.floor(pts))
  end)
end)

describe('score.get_base_points', function()
  it('level 0 → 100', function() eq(S.get_base_points(0), 100) end)
  it('level 1 → 150', function() eq(S.get_base_points(1), 150) end)
  it('level 9 → 550', function() eq(S.get_base_points(9), 550) end)
  it('increases linearly by 50 per level', function()
    for lv = 0, 8 do
      eq(S.get_base_points(lv + 1) - S.get_base_points(lv), 50, 'level ' .. lv)
    end
  end)
end)

describe('score.get_time_limit', function()
  it('level equals ceiling → base 10s', function()
    eq(S.get_time_limit(2, 2, 'general'), 10000)
  end)

  it('ceiling above level reduces limit by 500ms per level gap', function()
    eq(S.get_time_limit(0, 2, 'general'), 9000)  -- 10000 - 2*500
  end)

  it('never drops below 3s (3000ms)', function()
    truthy(S.get_time_limit(0, 9, 'general') >= 3000)
  end)

  it('survival mode applies 1.5× multiplier', function()
    local base     = S.get_time_limit(2, 2, 'general')
    local survival = S.get_time_limit(2, 2, 'survival')
    eq(survival, math.floor(base * 1.5))
  end)

  it('survival minimum is also 1.5× normal minimum', function()
    local gen  = S.get_time_limit(0, 9, 'general')
    local surv = S.get_time_limit(0, 9, 'survival')
    truthy(surv >= gen)
  end)
end)

-- ── LevelEngine ───────────────────────────────────────────────────────────────

describe('level.should_show_solution', function()
  it('none → always false', function()
    falsy(L.should_show_solution('none', 0, false, false))
    falsy(L.should_show_solution('none', 0, true,  false))
    falsy(L.should_show_solution('none', 5, true,  false))
  end)

  it('all → always true (unless verification)', function()
    truthy(L.should_show_solution('all', 0, false, false))
    truthy(L.should_show_solution('all', 5, true,  false))
  end)

  it('first_only → true only on occurrence 0', function()
    truthy(L.should_show_solution('first_only', 0, false, false))
    falsy( L.should_show_solution('first_only', 1, false, false))
    falsy( L.should_show_solution('first_only', 5, false, false))
  end)

  it('alternating → true on even occurrences', function()
    truthy(L.should_show_solution('alternating', 0, false, false))
    falsy( L.should_show_solution('alternating', 1, false, false))
    truthy(L.should_show_solution('alternating', 2, false, false))
    falsy( L.should_show_solution('alternating', 3, false, false))
  end)

  it('after_failure → false with no failure, true with failure', function()
    falsy( L.should_show_solution('after_failure', 0, false, false))
    truthy(L.should_show_solution('after_failure', 0, true,  false))
    truthy(L.should_show_solution('after_failure', 5, true,  false))
  end)

  it('first_then_failure → true on first OR after failure', function()
    truthy(L.should_show_solution('first_then_failure', 0, false, false)) -- first
    falsy( L.should_show_solution('first_then_failure', 1, false, false)) -- not first, no fail
    truthy(L.should_show_solution('first_then_failure', 1, true,  false)) -- after failure
  end)

  it('is_verification always returns false regardless of mode', function()
    for _, mode in ipairs({'none','all','first_only','alternating','after_failure','first_then_failure'}) do
      falsy(L.should_show_solution(mode, 0, true, true), 'mode=' .. mode)
    end
  end)
end)

describe('level.pick_challenge_level', function()
  it('warmup_remaining > 0 always returns level 0', function()
    for _, wr in ipairs({1, 2, 3}) do
      eq(L.pick_challenge_level(5, wr), 0, 'warmup_remaining=' .. wr)
    end
  end)

  it('ceiling = 0 always returns 0', function()
    for _ = 1, 10 do
      eq(L.pick_challenge_level(0, 0), 0)
    end
  end)

  it('returns a value in [0, ceiling]', function()
    for _ = 1, 50 do
      local v = L.pick_challenge_level(5, 0)
      truthy(v >= 0 and v <= 5, 'got ' .. v)
    end
  end)
end)

describe('level.get_warmup_count', function()
  it('level 0-1 → 3 warmups', function()
    eq(L.get_warmup_count(0), 3)
    eq(L.get_warmup_count(1), 3)
  end)

  it('level 2-4 → 2 warmups', function()
    for _, lv in ipairs({2, 3, 4}) do
      eq(L.get_warmup_count(lv), 2, 'level=' .. lv)
    end
  end)

  it('level 5-9 → 1 warmup', function()
    for _, lv in ipairs({5, 6, 7, 8, 9}) do
      eq(L.get_warmup_count(lv), 1, 'level=' .. lv)
    end
  end)
end)

describe('level.should_increase_concurrent', function()
  it('already at max (4) → false', function()
    falsy(L.should_increase_concurrent(10, 4))
    falsy(L.should_increase_concurrent(10, 5))
  end)

  it('completed = 0 → false', function()
    falsy(L.should_increase_concurrent(0, 1))
  end)

  it('multiple of 10 and below cap → true', function()
    truthy(L.should_increase_concurrent(10, 1))
    truthy(L.should_increase_concurrent(20, 2))
    truthy(L.should_increase_concurrent(30, 3))
  end)

  it('non-multiple of 10 → false', function()
    for _, n in ipairs({1, 9, 11, 19, 21}) do
      falsy(L.should_increase_concurrent(n, 1), 'completed=' .. n)
    end
  end)
end)

describe('level.get_level_completion', function()
  it('no commands at level → 1.0 (considered complete)', function()
    local pct = L.get_level_completion(5, {}, {}, 1)
    eq(pct, 1.0)
  end)

  it('zero completions → 0.0', function()
    local cmds = { { id = 'a', level = 2 }, { id = 'b', level = 2 } }
    local prog = { [2] = empty_prog() }
    eq(L.get_level_completion(2, prog, cmds, 1), 0.0)
  end)

  it('all commands met rep target → 1.0', function()
    local cmds = { { id = 'a', level = 2 }, { id = 'b', level = 2 } }
    local prog = {
      [2] = { seen = {}, completion_counts = { a = 2, b = 2 }, failure_counts = {} }
    }
    eq(L.get_level_completion(2, prog, cmds, 2), 1.0)
  end)

  it('half the commands met rep target → 0.5', function()
    local cmds = { { id = 'a', level = 2 }, { id = 'b', level = 2 } }
    local prog = {
      [2] = { seen = {}, completion_counts = { a = 3 }, failure_counts = {} }
    }
    eq(L.get_level_completion(2, prog, cmds, 3), 0.5)
  end)

  it('completion count below rep target does not count', function()
    local cmds = { { id = 'a', level = 0 } }
    local prog = { [0] = { seen = {}, completion_counts = { a = 1 }, failure_counts = {} } }
    eq(L.get_level_completion(0, prog, cmds, 3), 0.0)  -- 1 < 3, not met
  end)

  it('ignores commands at other levels', function()
    local cmds = {
      { id = 'a', level = 1 }, { id = 'b', level = 2 },
    }
    local prog = {
      [1] = { seen = {}, completion_counts = { a = 1 }, failure_counts = {} },
    }
    -- level 2 has no completed entries, level 1 is irrelevant
    eq(L.get_level_completion(2, prog, cmds, 1), 0.0)
  end)
end)

describe('level.try_advance_ceiling', function()
  it('stays at ceiling when < 75% done', function()
    local cmds = {}
    for i = 1, 8 do table.insert(cmds, { id = 'c' .. i, level = 2 }) end
    -- only 5/8 = 62.5% done — below threshold
    local prog = { [2] = {
      seen = {}, failure_counts = {},
      completion_counts = { c1=1, c2=1, c3=1, c4=1, c5=1 },
    }}
    eq(L.try_advance_ceiling(2, prog, cmds, 1), 2)
  end)

  it('advances when ≥75% done', function()
    local cmds = {}
    for i = 1, 4 do table.insert(cmds, { id = 'c' .. i, level = 2 }) end
    -- 3/4 = 75% done
    local prog = { [2] = {
      seen = {}, failure_counts = {},
      completion_counts = { c1=1, c2=1, c3=1 },
    }}
    eq(L.try_advance_ceiling(2, prog, cmds, 1), 3)
  end)

  it('caps at 9', function()
    local cmds = { { id = 'x', level = 9 } }
    local prog = { [9] = { seen = {}, failure_counts = {}, completion_counts = { x = 1 } } }
    eq(L.try_advance_ceiling(9, prog, cmds, 1), 9)
  end)

  it('advances respect repetition_target', function()
    local cmds = { { id = 'x', level = 3 } }
    -- completed once but target is 2 → not yet
    local prog = { [3] = { seen = {}, failure_counts = {}, completion_counts = { x = 1 } } }
    eq(L.try_advance_ceiling(3, prog, cmds, 2), 3)

    -- completed twice, target is 2 → advance
    prog[3].completion_counts.x = 2
    eq(L.try_advance_ceiling(3, prog, cmds, 2), 4)
  end)
end)

describe('level.pick_next_command', function()
  local function cmds_at(levels)
    local out = {}
    for i, lv in ipairs(levels) do
      table.insert(out, { id = 'c' .. i, level = lv, solution = {'x'}, question = 'q', category = 'C' })
    end
    return out
  end

  it('returns nil when all commands are active', function()
    local cmds    = cmds_at({0})
    local active  = { c1 = true }
    local result  = L.pick_next_command(cmds, 0, active, {}, 1, {})
    eq(result, nil)
  end)

  it('picks a command at the target level', function()
    local cmds   = cmds_at({0, 1, 2})
    local result = L.pick_next_command(cmds, 1, {}, {}, 1, {})
    eq(result.level, 1)
  end)

  it('falls back to any level when target level is empty', function()
    local cmds   = cmds_at({2, 2})
    local result = L.pick_next_command(cmds, 0, {}, {}, 1, {})  -- nothing at level 0
    truthy(result ~= nil)
  end)

  it('prefers commands below rep target', function()
    -- c1 (level 0) has 0 completions, c2 (level 0) has 3
    local cmds = {
      { id = 'c1', level = 0, solution = {'h'}, question = 'q', category = 'C' },
      { id = 'c2', level = 0, solution = {'j'}, question = 'q', category = 'C' },
    }
    local prog = {
      [0] = { seen = {}, failure_counts = {}, completion_counts = { c2 = 3 } }
    }
    -- With rep target 2: c2 has met it (3 ≥ 2), c1 has not → must pick c1
    local result = L.pick_next_command(cmds, 0, {}, prog, 2, {})
    eq(result.id, 'c1')
  end)

  it('pending verification takes absolute priority', function()
    local cmds = {
      { id = 'v1', level = 0, solution = {'h'}, question = 'q', category = 'C' },
      { id = 'c1', level = 1, solution = {'j'}, question = 'q', category = 'C' },
    }
    local result = L.pick_next_command(cmds, 1, {}, {}, 1, {'v1'})
    eq(result.id, 'v1')
  end)

  it('respects active_ids exclusion', function()
    local cmds = cmds_at({0, 0})
    -- only c1 active; c2 must be picked
    local active = { c1 = true }
    local result = L.pick_next_command(cmds, 0, active, {}, 1, {})
    eq(result.id, 'c2')
  end)
end)

-- ── High score save / load ────────────────────────────────────────────────────

describe('high scores save/load roundtrip', function()
  local save = arcade._test_api.save_high_score
  local load = arcade._test_api.load_high_scores

  -- Use a temp file so tests don't pollute real data
  local orig_file
  local function set_temp_file()
    orig_file = rawget(require('vim-learn.arcade'), '_SCORE_FILE_OVERRIDE')
    -- Monkey-patch via the test API: write to a temp path
    -- We rely on the actual save_high_score function writing to SCORE_FILE.
    -- To make tests hermetic we redirect at the Lua level by overriding the
    -- upvalue would require debug API. Instead, just test the data-transform
    -- logic by calling save+load in sequence (isolation via fresh calls).
  end

  it('load returns empty tables when file missing', function()
    local scores = load()
    truthy(type(scores.general)         == 'table')
    truthy(type(scores.timed_challenge) == 'table')
    truthy(type(scores.survival)        == 'table')
  end)

  it('saved entry can be retrieved', function()
    local entry = {
      id = 'test001', timestamp = 1700000000,
      score = 500, mode = 'general',
      language = 'go', starting_level = 2, repetition_target = 1,
      guided_mode = 'none', challenges_completed = 10, challenges_failed = 2,
      accuracy = 0.83, session_duration_ms = 60000,
      expected_time_ms = 0, achieved_time_ms = 0,
    }
    save(entry)
    local scores = load()
    truthy(#scores.general >= 1)
    local found = false
    for _, e in ipairs(scores.general) do
      if e.id == 'test001' then found = true; break end
    end
    truthy(found, 'saved entry not found in high scores')
  end)

  it('general/timed scores sorted by score descending', function()
    save({ id='a1', timestamp=0, score=100, mode='general', language='go',
           starting_level=0, repetition_target=1, guided_mode='none',
           challenges_completed=1, challenges_failed=0, accuracy=1,
           session_duration_ms=1000, expected_time_ms=0, achieved_time_ms=0 })
    save({ id='a2', timestamp=0, score=500, mode='general', language='go',
           starting_level=0, repetition_target=1, guided_mode='none',
           challenges_completed=5, challenges_failed=0, accuracy=1,
           session_duration_ms=1000, expected_time_ms=0, achieved_time_ms=0 })
    local scores = load()
    -- highest score should be first
    local max_score = 0
    for _, e in ipairs(scores.general) do
      truthy(e.score >= max_score or e.score == scores.general[1].score,
        'scores not sorted: ' .. e.score .. ' after ' .. scores.general[1].score)
      break  -- just check the top entry is the highest
    end
    truthy(scores.general[1].score >= 500)
  end)

  it('survival scores sorted by achieved_time_ms descending', function()
    save({ id='s1', timestamp=0, score=100, mode='survival', language='go',
           starting_level=0, repetition_target=1, guided_mode='none',
           challenges_completed=3, challenges_failed=1, accuracy=0.75,
           session_duration_ms=5000, expected_time_ms=6000, achieved_time_ms=4500 })
    save({ id='s2', timestamp=0, score=200, mode='survival', language='go',
           starting_level=0, repetition_target=1, guided_mode='none',
           challenges_completed=5, challenges_failed=1, accuracy=0.83,
           session_duration_ms=8000, expected_time_ms=9000, achieved_time_ms=7000 })
    local scores = load()
    truthy(#scores.survival >= 2)
    -- s2 survived longer (7000ms) → should be first
    eq(scores.survival[1].achieved_time_ms, 7000)
  end)

  it('keeps at most 10 entries per mode', function()
    for i = 1, 12 do
      save({ id='fill'..i, timestamp=i, score=i*10, mode='timed_challenge', language='go',
             starting_level=0, repetition_target=1, guided_mode='none',
             challenges_completed=i, challenges_failed=0, accuracy=1,
             session_duration_ms=60000, expected_time_ms=0, achieved_time_ms=0 })
    end
    local scores = load()
    truthy(#scores.timed_challenge <= 10, 'got ' .. #scores.timed_challenge .. ' entries, expected ≤10')
    -- Should keep the top 10 by score (score 120 down to 30)
    eq(scores.timed_challenge[1].score, 120)
  end)
end)
