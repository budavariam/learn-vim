local M    = {}
local core  = require('vim-learn')
local ns    = vim.api.nvim_create_namespace('vim_learn_quiz')

local LVL_MIN        = 0
local LVL_MAX        = 9
local BAR_CHAR_BYTES = 3   -- ● / ○ are both 3-byte UTF-8 sequences

local DEFAULT_PRESETS = {
  { name = 'All',      level_min = 0, level_max = 9, filter = 'all',     categories = nil },
  { name = 'Beginner', level_min = 0, level_max = 2, filter = 'all',     categories = nil },
  { name = 'Unknown',  level_min = 0, level_max = 9, filter = 'unknown', categories = nil },
  { name = 'Expert',   level_min = 7, level_max = 9, filter = 'all',     categories = nil },
}

-- ── run state ────────────────────────────────────────────────────────────────

local state = {
  win      = nil,
  buf      = nil,
  items    = {},
  idx      = 1,
  revealed = false,
  known_ct = 0,
  skip_ct  = 0,
}

-- ── setup state ───────────────────────────────────────────────────────────────

local setup = {
  win         = nil,
  buf         = nil,
  cfg         = nil,      -- current working config
  line_to_cat = {},       -- 0-based lnum -> category name
  cat_all     = {},       -- ordered list of all categories in data
}

-- ── helpers ───────────────────────────────────────────────────────────────────

local function quiz_win_dims()
  local w = math.min(72, math.floor(vim.o.columns * 0.75))
  local h = 14
  return w, h,
    math.floor((vim.o.columns - w) / 2),
    math.floor((vim.o.lines   - h) / 2)
end

local function setup_win_dims()
  local w = math.min(68, math.floor(vim.o.columns * 0.72))
  local h = math.max(20, math.min(math.floor(vim.o.lines * 0.88), 45))
  return w, h,
    math.floor((vim.o.columns - w) / 2),
    math.floor((vim.o.lines   - h) / 2)
end

local function strip_html(s)
  return (s:gsub('<[^>]+>', ''))
end

local function shuffle(t)
  local n = #t
  for i = n, 2, -1 do
    local j = math.random(i)
    t[i], t[j] = t[j], t[i]
  end
end

local function level_bar(lmin, lmax)
  local t = {}
  for i = LVL_MIN, LVL_MAX do
    t[#t + 1] = (i >= lmin and i <= lmax) and '●' or '○'
  end
  return table.concat(t)
end

-- Collect all categories from data in first-appearance order.
local function all_categories()
  local data = core.get_data()
  local order, seen = {}, {}
  for _, item in ipairs(data) do
    if item.category and not seen[item.category] then
      seen[item.category] = true
      table.insert(order, item.category)
    end
  end
  return order
end

-- ── presets ───────────────────────────────────────────────────────────────────

local function get_user_presets()
  return core.get_state().quiz_presets or {}
end

local function get_all_presets()
  local out = {}
  for _, p in ipairs(DEFAULT_PRESETS) do
    table.insert(out, vim.tbl_extend('force', {}, p))
  end
  for _, p in ipairs(get_user_presets()) do
    table.insert(out, vim.tbl_extend('force', {}, p))
  end
  return out
end

-- Serialise cfg.categories (table or nil) to a JSON-safe array or nil.
local function cats_to_list(categories)
  if categories == nil then return nil end
  local list = {}
  for c in pairs(categories) do table.insert(list, c) end
  table.sort(list)
  return list
end

-- Deserialise stored array back to a set table or nil.
local function list_to_cats(list)
  if not list then return nil end
  local set = {}
  for _, c in ipairs(list) do set[c] = true end
  return set
end

local function save_user_preset(name, cfg)
  local s = core.get_state()
  if not s.quiz_presets then s.quiz_presets = {} end
  local entry = {
    name       = name,
    level_min  = cfg.level_min,
    level_max  = cfg.level_max,
    filter     = cfg.filter,
    categories = cats_to_list(cfg.categories),
  }
  for i, p in ipairs(s.quiz_presets) do
    if p.name == name then s.quiz_presets[i] = entry; core.save_state(); return end
  end
  table.insert(s.quiz_presets, entry)
  core.save_state()
end

local function delete_user_preset(name)
  local s = core.get_state()
  if not s.quiz_presets then return end
  s.quiz_presets = vim.tbl_filter(function(p) return p.name ~= name end, s.quiz_presets)
  core.save_state()
end

local function apply_preset(p)
  setup.cfg = {
    level_min  = p.level_min,
    level_max  = p.level_max,
    filter     = p.filter,
    categories = list_to_cats(p.categories),
  }
end

-- ── filtering ────────────────────────────────────────────────────────────────

local function split_items(cfg)
  local data = core.get_data()
  local unknown, known_items = {}, {}
  for _, item in ipairs(data) do
    if item.level < cfg.level_min or item.level > cfg.level_max then goto skip end
    if cfg.filter == 'unknown' and core.is_known(item.id)      then goto skip end
    if cfg.filter == 'known'   and not core.is_known(item.id)  then goto skip end
    if cfg.categories and not cfg.categories[item.category]    then goto skip end
    if core.is_known(item.id) then
      table.insert(known_items, item)
    else
      table.insert(unknown, item)
    end
    ::skip::
  end
  return unknown, known_items
end

local function count_items(cfg)
  local u, k = split_items(cfg)
  return #u + #k
end

-- Toggle a category in setup.cfg (nil=all, {}=none, {x=true}=partial).
local function toggle_category(cat)
  local cats = setup.cfg.categories
  local n_all = #setup.cat_all
  if cats == nil then
    -- all → deselect this one
    cats = {}
    for _, c in ipairs(setup.cat_all) do
      if c ~= cat then cats[c] = true end
    end
  elseif cats[cat] then
    cats[cat] = nil
    local n = 0; for _ in pairs(cats) do n = n + 1 end
    if n >= n_all then cats = nil end
  else
    cats[cat] = true
    local n = 0; for _ in pairs(cats) do n = n + 1 end
    if n >= n_all then cats = nil end
  end
  setup.cfg.categories = cats
end

-- ── setup render ──────────────────────────────────────────────────────────────

local function render_setup()
  if not (setup.buf and vim.api.nvim_buf_is_valid(setup.buf)) then return end
  if not (setup.win and vim.api.nvim_win_is_valid(setup.win)) then return end

  local w   = vim.api.nvim_win_get_width(setup.win)
  local cfg = setup.cfg
  local lines, hls, l2c = {}, {}, {}

  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end
  local sep = string.rep('─', w - 2)

  -- ── presets ──
  local all_presets = get_all_presets()
  local preset_chunks = {}
  for i, p in ipairs(all_presets) do
    table.insert(preset_chunks, '[' .. i .. '] ' .. p.name)
  end
  table.insert(lines, ' Presets:  ' .. table.concat(preset_chunks, '  '))
  hl(0, 1, 9, 'Title')
  -- highlight the numbers
  local col = 11
  for i, p in ipairs(all_presets) do
    local tag = '[' .. i .. ']'
    hl(0, col, col + #tag, 'Special')
    col = col + #tag + 1 + #p.name + 2
  end
  table.insert(lines, '  [S] save current as preset   [D] delete a user preset')
  hl(1, 0, -1, 'Comment')

  table.insert(lines, sep)

  -- ── level range ──
  local bar_prefix = ' Level:   '
  local bp = #bar_prefix
  local bar_disp = level_bar(cfg.level_min, cfg.level_max)
  local n_chars = LVL_MAX - LVL_MIN + 1
  local total_bar_bytes = n_chars * BAR_CHAR_BYTES
  local lvl_lnum = #lines
  table.insert(lines,
    bar_prefix .. bar_disp
    .. string.format('  %d-%d    [<] lower-min  [>] raise-min  [[] lower-max  []] raise-max',
      cfg.level_min, cfg.level_max))
  hl(lvl_lnum, 1, 8, 'Keyword')
  -- dim before range, highlight active range, dim after
  hl(lvl_lnum, bp,                                    bp + cfg.level_min * BAR_CHAR_BYTES,        'Comment')
  hl(lvl_lnum, bp + cfg.level_min * BAR_CHAR_BYTES,   bp + (cfg.level_max + 1) * BAR_CHAR_BYTES, 'Special')
  hl(lvl_lnum, bp + (cfg.level_max + 1) * BAR_CHAR_BYTES, bp + total_bar_bytes,                  'Comment')

  -- ── filter ──
  local flt_lnum = #lines
  table.insert(lines, string.format(' Filter:   [f] %-8s   (all / unknown / known)', cfg.filter))
  hl(flt_lnum, 1, 8, 'Keyword')
  local flt_col = 15
  hl(flt_lnum, flt_col, flt_col + #cfg.filter, 'Special')

  table.insert(lines, sep)

  -- ── categories ──
  local sec_lnum = #lines
  table.insert(lines, ' Sections:  [a] all  [n] none    j/k + Space to toggle')
  hl(sec_lnum, 1, 10, 'Title')
  hl(sec_lnum, 10, -1, 'Comment')

  for _, cat in ipairs(setup.cat_all) do
    local selected = cfg.categories == nil or (cfg.categories[cat] == true)
    local mark     = selected and '●' or '○'
    local cat_lnum = #lines
    table.insert(lines, '  ' .. mark .. ' ' .. cat)
    l2c[cat_lnum] = cat
    hl(cat_lnum, 2, 2 + BAR_CHAR_BYTES, core.get_category_hl(cat))
    if not selected then
      hl(cat_lnum, 0, -1, 'Comment')
    end
  end

  table.insert(lines, sep)

  -- ── footer ──
  local n = count_items(cfg)
  local footer_lnum = #lines
  table.insert(lines, string.format(
    ' %d item%s   [Enter] Start quiz   [q/Esc] Cancel',
    n, n == 1 and '' or 's'))
  hl(footer_lnum, 0, -1, n > 0 and 'Normal' or 'WarningMsg')

  setup.line_to_cat = l2c

  vim.bo[setup.buf].modifiable = true
  vim.api.nvim_buf_set_lines(setup.buf, 0, -1, false, lines)
  vim.bo[setup.buf].modifiable = false

  vim.api.nvim_buf_clear_namespace(setup.buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(setup.buf, ns, h[4], h[1], h[2], h[3])
  end
end

-- ── setup window ─────────────────────────────────────────────────────────────

local close_setup  -- forward declaration
local start_quiz   -- forward declaration

local function open_setup()
  if setup.win and vim.api.nvim_win_is_valid(setup.win) then
    vim.api.nvim_set_current_win(setup.win)
    return
  end

  setup.cat_all = all_categories()
  -- initialise cfg from 'All' preset if not already set
  if not setup.cfg then
    apply_preset(DEFAULT_PRESETS[1])
  end

  setup.buf = vim.api.nvim_create_buf(false, true)
  vim.bo[setup.buf].bufhidden = 'wipe'

  local w, h, col, row = setup_win_dims()
  setup.win = vim.api.nvim_open_win(setup.buf, true, {
    relative  = 'editor',
    width     = w,
    height    = h,
    col       = col,
    row       = row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' Vim Learn – Quiz Setup ',
    title_pos = 'center',
  })
  vim.wo[setup.win].cursorline = true
  vim.wo[setup.win].scrolloff  = 3

  core.setup_category_highlights()
  render_setup()

  local o = { buffer = setup.buf, noremap = true, silent = true }

  -- preset selection by number
  local all_presets = get_all_presets()
  for i = 1, math.min(9, #all_presets) do
    local p = all_presets[i]
    vim.keymap.set('n', tostring(i), function()
      apply_preset(p)
      render_setup()
    end, o)
  end
  -- re-register on each render isn't ideal, but for simplicity we register once
  -- and get_all_presets() is re-read each time a new preset is added

  -- save current config as user preset
  vim.keymap.set('n', 'S', function()
    local name = vim.fn.input('Preset name: ')
    if name and name ~= '' then
      save_user_preset(name, setup.cfg)
      vim.notify('vim-learn: preset "' .. name .. '" saved', vim.log.levels.INFO)
      -- re-register number keymaps for updated preset list
      local updated = get_all_presets()
      for i = 1, math.min(9, #updated) do
        local p2 = updated[i]
        vim.keymap.set('n', tostring(i), function()
          apply_preset(p2)
          render_setup()
        end, o)
      end
      render_setup()
    end
  end, o)

  -- delete a user preset
  vim.keymap.set('n', 'D', function()
    local user = get_user_presets()
    if #user == 0 then
      vim.notify('vim-learn: no user presets to delete', vim.log.levels.INFO)
      return
    end
    local names = {}
    for i, p in ipairs(user) do
      table.insert(names, i .. ': ' .. p.name)
    end
    local choice = vim.fn.input('Delete (' .. table.concat(names, ', ') .. '): ')
    local idx = tonumber(choice)
    if idx and idx >= 1 and idx <= #user then
      local name = user[idx].name
      delete_user_preset(name)
      vim.notify('vim-learn: deleted "' .. name .. '"', vim.log.levels.INFO)
      render_setup()
    end
  end, o)

  -- level range
  vim.keymap.set('n', '<', function()
    setup.cfg.level_min = math.max(LVL_MIN, setup.cfg.level_min - 1); render_setup()
  end, o)
  vim.keymap.set('n', '>', function()
    setup.cfg.level_min = math.min(setup.cfg.level_max, setup.cfg.level_min + 1); render_setup()
  end, o)
  vim.keymap.set('n', '[', function()
    setup.cfg.level_max = math.max(setup.cfg.level_min, setup.cfg.level_max - 1); render_setup()
  end, o)
  vim.keymap.set('n', ']', function()
    setup.cfg.level_max = math.min(LVL_MAX, setup.cfg.level_max + 1); render_setup()
  end, o)

  -- filter cycle
  local FILTER_ORDER = { 'all', 'unknown', 'known' }
  vim.keymap.set('n', 'f', function()
    local cur = setup.cfg.filter
    for i, v in ipairs(FILTER_ORDER) do
      if v == cur then
        setup.cfg.filter = FILTER_ORDER[(i % #FILTER_ORDER) + 1]
        break
      end
    end
    render_setup()
  end, o)

  -- category: all / none
  vim.keymap.set('n', 'a', function()
    setup.cfg.categories = nil; render_setup()
  end, o)
  vim.keymap.set('n', 'n', function()
    setup.cfg.categories = {}; render_setup()
  end, o)

  -- category: toggle under cursor
  vim.keymap.set('n', '<Space>', function()
    local lnum = vim.api.nvim_win_get_cursor(setup.win)[1] - 1
    local cat  = setup.line_to_cat[lnum]
    if cat then toggle_category(cat); render_setup() end
  end, o)
  vim.keymap.set('n', '<CR>', function()
    -- if on a category line, toggle; else start quiz
    local lnum = vim.api.nvim_win_get_cursor(setup.win)[1] - 1
    local cat  = setup.line_to_cat[lnum]
    if cat then
      toggle_category(cat); render_setup()
    else
      start_quiz()
    end
  end, o)

  vim.keymap.set('n', 's', start_quiz, o)   -- 's' = start as quick shortcut

  vim.keymap.set('n', 'q',     close_setup, o)
  vim.keymap.set('n', '<Esc>', close_setup, o)

  vim.api.nvim_create_autocmd('WinLeave', {
    buffer   = setup.buf,
    callback = function()
      vim.schedule(function()
        if vim.api.nvim_get_current_win() ~= setup.win then
          close_setup()
        end
      end)
    end,
  })
end

close_setup = function()
  if setup.win and vim.api.nvim_win_is_valid(setup.win) then
    vim.api.nvim_win_close(setup.win, true)
  end
  setup.win = nil
  setup.buf = nil
end

-- ── quiz render ───────────────────────────────────────────────────────────────

local function render_quiz()
  if not (state.buf and vim.api.nvim_buf_is_valid(state.buf)) then return end
  if not (state.win and vim.api.nvim_win_is_valid(state.win)) then return end

  local total = #state.items
  if total == 0 then
    vim.bo[state.buf].modifiable = true
    vim.api.nvim_buf_set_lines(state.buf, 0, -1, false, {
      '', '  No items match your filters.',
      '', '  Press b to go back to setup, q to close.',
    })
    vim.bo[state.buf].modifiable = false
    return
  end

  local item  = state.items[state.idx]
  local w     = vim.api.nvim_win_get_width(state.win)
  local bar   = string.rep('─', w - 2)

  local progress = string.format('  %d / %d   known: %d   skipped: %d',
    state.idx, total, state.known_ct, state.skip_ct)
  local question = strip_html(item.question)
  local cat_info = string.format('  %s   Level %d', item.category, item.level)

  local lines = { progress, bar, '', '  ' .. question, '', bar, '' }

  local hls = {}
  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end
  hl(0, 0, -1, 'Comment')

  if state.revealed then
    local lbl = '  Answer: '
    for i, sol in ipairs(item.solution) do
      local pfx  = i == 1 and lbl or string.rep(' ', #lbl)
      local lnum = #lines
      table.insert(lines, pfx .. sol)
      hl(lnum, #pfx, #pfx + #sol, 'Keyword')
    end
    table.insert(lines, '')
    table.insert(lines, cat_info)
    table.insert(lines, '')
    table.insert(lines, bar)
    table.insert(lines, '')
    table.insert(lines, '  [k] known  [u] unknown  [n] skip  [r] reshuffle  [b] setup  [q] quit')
    hl(#lines - 1, 0, -1, 'Comment')
  else
    local lnum_h = #lines
    table.insert(lines, '  Answer:  [SPACE / ENTER to reveal]')
    hl(lnum_h, 10, -1, 'NonText')
    table.insert(lines, '')
    table.insert(lines, bar)
    table.insert(lines, '')
    table.insert(lines, '  [SPACE/ENTER] reveal  [n] skip  [b] setup  [q] quit')
    hl(#lines - 1, 0, -1, 'Comment')
  end

  vim.bo[state.buf].modifiable = true
  vim.api.nvim_buf_set_lines(state.buf, 0, -1, false, lines)
  vim.bo[state.buf].modifiable = false

  vim.api.nvim_buf_clear_namespace(state.buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(state.buf, ns, h[4], h[1], h[2], h[3])
  end
  -- category colour on the question line (index 3)
  vim.api.nvim_buf_add_highlight(state.buf, ns, core.get_category_hl(item.category), 3, 2, -1)
end

-- ── quiz navigation ───────────────────────────────────────────────────────────

local function next_item()
  state.idx      = state.idx + 1
  state.revealed = false
  if state.idx > #state.items then
    local fk, ft = state.known_ct, #state.items
    state.idx = 1; state.known_ct = 0; state.skip_ct = 0
    vim.notify(string.format('vim-learn: loop complete – known %d / %d', fk, ft),
      vim.log.levels.INFO)
  end
  render_quiz()
end

-- ── start quiz ────────────────────────────────────────────────────────────────

start_quiz = function()
  local cfg = setup.cfg
  if count_items(cfg) == 0 then
    vim.notify('vim-learn: no items match the current filters', vim.log.levels.WARN)
    return
  end

  close_setup()

  math.randomseed(os.time())
  local unknown, known_items = split_items(cfg)
  shuffle(unknown)
  shuffle(known_items)
  state.items = {}
  vim.list_extend(state.items, unknown)
  vim.list_extend(state.items, known_items)
  state.idx = 1; state.revealed = false; state.known_ct = 0; state.skip_ct = 0

  state.buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.buf].bufhidden = 'wipe'
  vim.bo[state.buf].filetype  = 'vim-learn-quiz'

  local w, h, col, row = quiz_win_dims()
  state.win = vim.api.nvim_open_win(state.buf, true, {
    relative  = 'editor',
    width     = w, height = h, col = col, row = row,
    style     = 'minimal', border = 'rounded',
    title     = ' Vim Learn – Quiz ', title_pos = 'center',
  })
  vim.wo[state.win].wrap = true

  core.setup_category_highlights()
  render_quiz()

  local o = { buffer = state.buf, noremap = true, silent = true }

  local function reveal_or_next()
    if not state.revealed then state.revealed = true; render_quiz()
    else next_item() end
  end
  vim.keymap.set('n', '<Space>', reveal_or_next, o)
  vim.keymap.set('n', '<CR>',   reveal_or_next, o)

  vim.keymap.set('n', 'k', function()
    if state.revealed then
      local item = state.items[state.idx]
      if not core.is_known(item.id) then
        core.toggle_known(item.id); state.known_ct = state.known_ct + 1
      end
      next_item()
    else reveal_or_next() end
  end, o)

  vim.keymap.set('n', 'u', function()
    if state.revealed then
      local item = state.items[state.idx]
      if core.is_known(item.id) then core.toggle_known(item.id) end
      next_item()
    end
  end, o)

  vim.keymap.set('n', 'n', function()
    state.skip_ct = state.skip_ct + 1; next_item()
  end, o)

  vim.keymap.set('n', 'r', function()
    local rem = {}
    for i = state.idx, #state.items do table.insert(rem, state.items[i]) end
    shuffle(rem)
    for i, v in ipairs(rem) do state.items[state.idx + i - 1] = v end
    state.revealed = false; render_quiz()
  end, o)

  -- back to setup
  vim.keymap.set('n', 'b', function()
    M.close()
    open_setup()
  end, o)

  vim.keymap.set('n', 'q',     M.close, o)
  vim.keymap.set('n', '<Esc>', M.close, o)

  vim.api.nvim_create_autocmd('WinLeave', {
    buffer   = state.buf,
    callback = function()
      vim.schedule(function()
        if vim.api.nvim_get_current_win() ~= state.win then M.close() end
      end)
    end,
  })
end

-- ── public API ────────────────────────────────────────────────────────────────

function M.open()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_set_current_win(state.win); return
  end
  if setup.win and vim.api.nvim_win_is_valid(setup.win) then
    vim.api.nvim_set_current_win(setup.win); return
  end
  open_setup()
end

function M.close()
  close_setup()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_win_close(state.win, true)
  end
  state.win   = nil
  state.buf   = nil
  state.items = {}
end

return M
