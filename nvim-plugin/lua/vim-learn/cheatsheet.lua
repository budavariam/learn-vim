local M    = {}
local core  = require('vim-learn')
local ns    = vim.api.nvim_create_namespace('vim_learn_cs')

local FILTERS = { 'all', 'unknown', 'known' }

local state = {
  win          = nil,
  buf          = nil,
  search_win   = nil,
  search_buf   = nil,
  filter_idx   = 1,
  search_query = '',
  entry_map    = {},   -- lnum (0-based) -> item id
}

-- ── helpers ───────────────────────────────────────────────────────────────────

-- Returns (width, main_height, col, row).
-- Reserves 3 extra rows below main for the search bar (1 line + 2 borders).
local function win_dims()
  local w      = math.max(80, math.floor(vim.o.columns * 0.85))
  local avail  = math.floor(vim.o.lines * 0.88)
  local main_h = math.max(15, avail - 3)   -- 3 = search content(1) + 2 borders
  local col    = math.floor((vim.o.columns - w) / 2)
  -- centre the combined block: main (main_h+2) + search (1+2) = main_h+5
  local row    = math.max(0, math.floor((vim.o.lines - (main_h + 5)) / 2))
  return w, main_h, col, row
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

local function filtered_data()
  local data  = core.get_data()
  local mode  = FILTERS[state.filter_idx]
  local query = state.search_query
  local out   = {}
  for _, item in ipairs(data) do
    if mode == 'unknown' and core.is_known(item.id)     then goto skip end
    if mode == 'known'   and not core.is_known(item.id) then goto skip end
    if query ~= '' then
      local haystack = table.concat(item.solution, ' ')
        .. ' ' .. item.question
        .. ' ' .. item.category
      if not fuzzy_match(haystack, query) then goto skip end
    end
    table.insert(out, item)
    ::skip::
  end
  return out
end

local function strip_html(s)
  return (s:gsub('<[^>]+>', ''))
end

-- ── render ────────────────────────────────────────────────────────────────────

local function render()
  if not (state.buf and vim.api.nvim_buf_is_valid(state.buf)) then return end

  local data  = filtered_data()
  local mode  = FILTERS[state.filter_idx]
  local w     = vim.api.nvim_win_get_width(state.win)
  local sol_w = 22
  local lvl_w = 4
  local q_w   = math.max(20, w - sol_w - lvl_w - 8)

  local lines = {}
  local hls   = {}
  local emap  = {}

  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end

  -- header line
  local query_hint = state.search_query ~= ''
    and ('  /' .. state.search_query)
    or  '  /search'
  local header = string.format(
    ' filter:%-7s  %d shown%s',
    mode, #data, query_hint)
  table.insert(lines, header)
  hl(0, 0, -1, 'Title')
  table.insert(lines, string.rep('─', w - 2))

  local cur_cat = nil
  for _, item in ipairs(data) do
    if item.category ~= cur_cat then
      cur_cat = item.category
      table.insert(lines, '')
      local cat_lnum = #lines - 1
      local cat_line = '  ' .. item.category
      table.insert(lines, cat_line)
      hl(cat_lnum, 2, 2 + #item.category, core.get_category_hl(item.category))
    end

    local known    = core.is_known(item.id)
    local mark     = known and '✓' or ' '
    local sols     = table.concat(item.solution, '  ')
    if #sols > sol_w then sols = sols:sub(1, sol_w - 1) .. '…' end
    local question = strip_html(item.question)
    if #question > q_w then question = question:sub(1, q_w - 1) .. '…' end

    local lnum = #lines
    emap[lnum] = item.id
    local line = string.format(' %s  %-' .. sol_w .. 's  %-' .. q_w .. 's  [%d]',
      mark, sols, question, item.level)
    table.insert(lines, line)

    if known then
      hl(lnum, 0, -1, 'Comment')
    else
      hl(lnum, 5, 5 + #sols, 'Keyword')
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
  -- strip the leading "> " prefix we set as a prompt indicator
  state.search_query = line:gsub('^>%s*', '')
  render()
end

local function open_search()
  if state.search_win and vim.api.nvim_win_is_valid(state.search_win) then
    vim.api.nvim_set_current_win(state.search_win)
    vim.cmd('startinsert!')
    return
  end

  local w, main_h, col, row = win_dims()
  local search_row = row + main_h + 2   -- main content(main_h) + top-border(1) + bottom-border(1)

  state.search_buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.search_buf].bufhidden = 'wipe'

  state.search_win = vim.api.nvim_open_win(state.search_buf, true, {
    relative  = 'editor',
    width     = w,
    height    = 1,
    col       = col,
    row       = search_row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' fuzzy search ',
    title_pos = 'left',
  })

  -- seed with current query so user can edit it
  local seed = '> ' .. state.search_query
  vim.api.nvim_buf_set_lines(state.search_buf, 0, -1, false, { seed })
  vim.api.nvim_win_set_cursor(state.search_win, { 1, #seed })
  vim.cmd('startinsert!')

  vim.api.nvim_create_autocmd('TextChangedI', {
    buffer   = state.search_buf,
    callback = update_query,
  })

  local o = { buffer = state.search_buf, noremap = true, silent = true }

  -- confirm: close search bar, return focus to main
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

  -- clear: reset query, close bar
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

  vim.keymap.set({ 'i', 'n' }, '<CR>',  confirm,      o)
  vim.keymap.set({ 'i', 'n' }, '<Esc>', clear_search,  o)
end

-- ── public ────────────────────────────────────────────────────────────────────

function M.open()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_set_current_win(state.win)
    return
  end

  state.search_query = ''

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
    title     = ' Vim Learn – Cheatsheet  [/] search  [f] filter  [Space] toggle known  [Q] quiz ',
    title_pos = 'center',
  })
  vim.wo[state.win].wrap       = false
  vim.wo[state.win].cursorline = true
  vim.wo[state.win].scrolloff  = 3

  core.setup_category_highlights()
  render()

  local o = { buffer = state.buf, noremap = true, silent = true }

  vim.keymap.set('n', 'q',     M.close, o)
  vim.keymap.set('n', '<Esc>', function()
    -- if there's an active query, clear it first; else close
    if state.search_query ~= '' then
      state.search_query = ''
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
    core.reload_data(); core._cat_hl = nil
    core.setup_category_highlights(); render()
  end, o)

  vim.keymap.set('n', 'Q', function()
    M.close()
    require('vim-learn.quiz').open()
  end, o)

  vim.api.nvim_create_autocmd('WinLeave', {
    buffer   = state.buf,
    once     = true,
    callback = M.close,
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
