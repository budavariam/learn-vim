local M    = {}
local core  = require('vim-learn')
local ns    = vim.api.nvim_create_namespace('vim_learn_cs')

local FILTERS   = { 'all', 'unknown', 'known' }
local LVL_MIN   = 0
local LVL_MAX   = 9

local state = {
  win          = nil,
  buf          = nil,
  search_win   = nil,
  search_buf   = nil,
  filter_idx   = 1,
  search_query = '',
  level_min    = LVL_MIN,
  level_max    = LVL_MAX,
  entry_map    = {},
}

-- ── helpers ───────────────────────────────────────────────────────────────────

local function win_dims()
  local w      = math.max(80, math.floor(vim.o.columns * 0.85))
  local avail  = math.floor(vim.o.lines * 0.88)
  local main_h = math.max(15, avail - 3)
  local col    = math.floor((vim.o.columns - w) / 2)
  local row    = math.max(0, math.floor((vim.o.lines - (main_h + 5)) / 2))
  return w, main_h, col, row
end

-- Truncate to at most `n` display columns then right-pad to exactly `n`.
local function trunc_pad(s, n)
  local w = vim.fn.strdisplaywidth(s)
  if w > n then
    s = vim.fn.strcharpart(s, 0, n)
    while vim.fn.strdisplaywidth(s) > n do
      s = vim.fn.strcharpart(s, 0, vim.fn.strchars(s) - 1)
    end
    s = s:sub(1, -2) .. '…'
    w = vim.fn.strdisplaywidth(s)
  end
  return s .. string.rep(' ', n - w)
end

local function fuzzy_match(text, query)
  if query == '' then return true end
  text  = text:lower()
  query = query:lower()
  local ti, qi = 1, 1
  while ti <= #text and qi <= #query do
    if text:sub(ti, ti) == query:sub(qi, qi) then qi = qi + 1 end
    ti = ti + 1
  end
  return qi > #query
end

local function strip_html(s)
  return (s:gsub('<[^>]+>', ''))
end

-- Filter, then group by category sorted by category-min-level,
-- entries within each group sorted by level ascending.
local function filtered_sorted_data()
  local data  = core.get_data()
  local mode  = FILTERS[state.filter_idx]
  local query = state.search_query
  local lmin  = state.level_min
  local lmax  = state.level_max

  -- pass 1: filter
  local filtered = {}
  for _, item in ipairs(data) do
    if mode == 'unknown' and core.is_known(item.id)     then goto skip end
    if mode == 'known'   and not core.is_known(item.id) then goto skip end
    if item.level < lmin or item.level > lmax            then goto skip end
    if query ~= '' then
      local hay = table.concat(item.solution, ' ')
        .. ' ' .. item.question .. ' ' .. item.category
      if not fuzzy_match(hay, query) then goto skip end
    end
    table.insert(filtered, item)
    ::skip::
  end

  -- pass 2: group by category, track min level per group
  local order   = {}   -- ordered list of category names (first-seen order)
  local cat_map = {}   -- cat -> { min_level, items }
  for _, item in ipairs(filtered) do
    local cat = item.category
    if not cat_map[cat] then
      cat_map[cat] = { min_level = item.level, items = {} }
      table.insert(order, cat)
    end
    local g = cat_map[cat]
    if item.level < g.min_level then g.min_level = item.level end
    table.insert(g.items, item)
  end

  -- pass 3: sort categories by min level, then name
  table.sort(order, function(a, b)
    local ma, mb = cat_map[a].min_level, cat_map[b].min_level
    if ma ~= mb then return ma < mb end
    return a < b
  end)

  -- pass 4: sort entries within each category by level, then first solution
  for _, cat in ipairs(order) do
    table.sort(cat_map[cat].items, function(a, b)
      if a.level ~= b.level then return a.level < b.level end
      return (a.solution[1] or '') < (b.solution[1] or '')
    end)
  end

  -- pass 5: flatten
  local out = {}
  for _, cat in ipairs(order) do
    for _, item in ipairs(cat_map[cat].items) do
      table.insert(out, item)
    end
  end
  return out
end

-- ── render ────────────────────────────────────────────────────────────────────

local function render()
  if not (state.buf and vim.api.nvim_buf_is_valid(state.buf)) then return end
  if not (state.win and vim.api.nvim_win_is_valid(state.win)) then return end

  local data  = filtered_sorted_data()
  local mode  = FILTERS[state.filter_idx]
  local w     = vim.api.nvim_win_get_width(state.win)
  local sol_w = 22
  local lvl_w = 4   -- '[N]' max width (levels 0-9 = 3, but reserve 4 for padding)
  local q_w   = math.max(20, w - sol_w - lvl_w - 8)

  local lines = {}
  local hls   = {}
  local emap  = {}

  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end

  -- header: filter | count | level range | search hint
  local lvl_range = state.level_min == LVL_MIN and state.level_max == LVL_MAX
    and 'all'
    or  (state.level_min .. '-' .. state.level_max)
  local query_hint = state.search_query ~= ''
    and ('  /' .. state.search_query)
    or  '  /search'
  local header = string.format(
    ' filter:%-7s  lvl:%s  %d shown%s',
    mode, lvl_range, #data, query_hint)
  table.insert(lines, header)
  hl(0, 0, -1, 'Title')
  table.insert(lines, string.rep('─', w - 2))

  local cur_cat = nil
  for _, item in ipairs(data) do
    -- category header (blank line + label)
    if item.category ~= cur_cat then
      cur_cat = item.category
      table.insert(lines, '')
      table.insert(lines, '  ' .. item.category)
      local cat_lnum = #lines - 1
      hl(cat_lnum, 2, 2 + #item.category, core.get_category_hl(item.category))
    end

    -- entry line
    local known      = core.is_known(item.id)
    local mark       = known and '✓' or ' '
    local sols       = table.concat(item.solution, '  ')
    local question   = strip_html(item.question)
    local level_str  = '[' .. item.level .. ']'

    local sols_disp  = trunc_pad(sols, sol_w)
    local q_disp     = trunc_pad(question, q_w)
    -- right-align level: pad to lvl_w so it always sits at the same column
    local lvl_disp   = string.rep(' ', lvl_w - #level_str) .. level_str

    local lnum = #lines
    emap[lnum] = item.id
    local line = ' ' .. mark .. '  ' .. sols_disp .. '  ' .. q_disp .. '  ' .. lvl_disp
    table.insert(lines, line)

    if known then
      hl(lnum, 0, -1, 'Comment')
    else
      -- highlight solution text (starts at byte 5: ' '(1)+'mark'(1)+'  '(2)+sol at 5)
      hl(lnum, 5, 5 + vim.fn.strdisplaywidth(sols_disp), 'Keyword')
      -- dim the level on the right
      local lvl_byte_start = #line - #lvl_disp
      hl(lnum, lvl_byte_start, -1, 'Comment')
    end
  end

  state.entry_map = emap

  vim.bo[state.buf].modifiable = true
  vim.api.nvim_buf_set_lines(state.buf, 0, -1, false, lines)
  vim.bo[state.buf].modifiable = false

  vim.api.nvim_buf_clear_namespace(state.buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(state.buf, ns, h[4], h[1], h[2], h[3])
  end
end

-- ── search bar ────────────────────────────────────────────────────────────────

local function update_query()
  if not (state.search_buf and vim.api.nvim_buf_is_valid(state.search_buf)) then return end
  local line = vim.api.nvim_buf_get_lines(state.search_buf, 0, 1, false)[1] or ''
  state.search_query = line
  render()
end

local function open_search()
  if state.search_win and vim.api.nvim_win_is_valid(state.search_win) then
    vim.api.nvim_set_current_win(state.search_win)
    vim.cmd('startinsert!')
    return
  end

  local win_pos    = vim.api.nvim_win_get_position(state.win)
  local main_h     = vim.api.nvim_win_get_height(state.win)
  local w          = vim.api.nvim_win_get_width(state.win)
  local search_row = win_pos[1] + main_h + 2

  state.search_buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.search_buf].bufhidden = 'wipe'

  state.search_win = vim.api.nvim_open_win(state.search_buf, true, {
    relative  = 'editor',
    width     = w,
    height    = 1,
    col       = win_pos[2],
    row       = search_row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' fuzzy search (Enter: confirm  Esc: clear) ',
    title_pos = 'left',
  })

  vim.api.nvim_buf_set_lines(state.search_buf, 0, -1, false, { state.search_query })
  vim.api.nvim_win_set_cursor(state.search_win, { 1, #state.search_query })
  vim.cmd('startinsert!')

  vim.api.nvim_create_autocmd('TextChangedI', {
    buffer   = state.search_buf,
    callback = update_query,
  })

  local o = { buffer = state.search_buf, noremap = true, silent = true }

  local function confirm()
    update_query()
    if state.search_win and vim.api.nvim_win_is_valid(state.search_win) then
      vim.api.nvim_win_close(state.search_win, true)
      state.search_win = nil
      state.search_buf = nil
    end
    vim.cmd('stopinsert')
    if state.win and vim.api.nvim_win_is_valid(state.win) then
      vim.api.nvim_set_current_win(state.win)
    end
  end

  local function clear_search()
    state.search_query = ''
    if state.search_win and vim.api.nvim_win_is_valid(state.search_win) then
      vim.api.nvim_win_close(state.search_win, true)
      state.search_win = nil
      state.search_buf = nil
    end
    vim.cmd('stopinsert')
    render()
    if state.win and vim.api.nvim_win_is_valid(state.win) then
      vim.api.nvim_set_current_win(state.win)
    end
  end

  vim.keymap.set({ 'i', 'n' }, '<CR>',  confirm,     o)
  vim.keymap.set({ 'i', 'n' }, '<Esc>', clear_search, o)
end

-- ── public ────────────────────────────────────────────────────────────────────

function M.open()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_set_current_win(state.win)
    return
  end

  state.search_query = ''
  state.filter_idx   = 1
  state.level_min    = LVL_MIN
  state.level_max    = LVL_MAX
  state.entry_map    = {}

  state.buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.buf].bufhidden = 'wipe'
  vim.bo[state.buf].filetype  = 'vim-learn'

  local w, main_h, col, row = win_dims()
  state.win = vim.api.nvim_open_win(state.buf, true, {
    relative  = 'editor',
    width     = w,
    height    = main_h,
    col       = col,
    row       = row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' VimLearn  [/]search [f]filter [<>]lvl-min [[]lvl-max [Space]known [Q]quiz ',
    title_pos = 'center',
  })
  vim.wo[state.win].wrap       = false
  vim.wo[state.win].cursorline = true
  vim.wo[state.win].scrolloff  = 3

  core.setup_category_highlights()
  render()

  local o = { buffer = state.buf, noremap = true, silent = true }

  vim.keymap.set('n', 'q', M.close, o)
  vim.keymap.set('n', '<Esc>', function()
    if state.search_query ~= '' then
      state.search_query = ''
      render()
    elseif state.level_min ~= LVL_MIN or state.level_max ~= LVL_MAX then
      state.level_min = LVL_MIN
      state.level_max = LVL_MAX
      render()
    else
      M.close()
    end
  end, o)

  vim.keymap.set('n', 'f', function()
    state.filter_idx = (state.filter_idx % #FILTERS) + 1
    render()
  end, o)

  vim.keymap.set('n', '/', open_search, o)

  -- level range: < > adjust min;  [ ] adjust max
  vim.keymap.set('n', '<', function()
    state.level_min = math.max(LVL_MIN, state.level_min - 1)
    render()
  end, o)
  vim.keymap.set('n', '>', function()
    state.level_min = math.min(state.level_max, state.level_min + 1)
    render()
  end, o)
  vim.keymap.set('n', '[', function()
    state.level_max = math.max(state.level_min, state.level_max - 1)
    render()
  end, o)
  vim.keymap.set('n', ']', function()
    state.level_max = math.min(LVL_MAX, state.level_max + 1)
    render()
  end, o)

  vim.keymap.set('n', '<Space>', function()
    local lnum = vim.api.nvim_win_get_cursor(state.win)[1] - 1
    local id   = state.entry_map[lnum]
    if id then core.toggle_known(id); render() end
  end, o)

  vim.keymap.set('n', '<CR>', function()
    local lnum = vim.api.nvim_win_get_cursor(state.win)[1] - 1
    local id   = state.entry_map[lnum]
    if id then core.toggle_known(id); render() end
  end, o)

  vim.keymap.set('n', 'R', function()
    core.reload_data()
    core._cat_hl = nil
    core.setup_category_highlights()
    render()
  end, o)

  vim.keymap.set('n', 'Q', function()
    M.close()
    require('vim-learn.quiz').open()
  end, o)

  vim.api.nvim_create_autocmd('WinLeave', {
    buffer   = state.buf,
    callback = function()
      vim.schedule(function()
        local cur = vim.api.nvim_get_current_win()
        if cur ~= state.win and cur ~= state.search_win then
          M.close()
        end
      end)
    end,
  })
end

function M.close()
  if state.search_win and vim.api.nvim_win_is_valid(state.search_win) then
    vim.api.nvim_win_close(state.search_win, true)
  end
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_win_close(state.win, true)
  end
  state.win        = nil
  state.buf        = nil
  state.search_win = nil
  state.search_buf = nil
end

return M
