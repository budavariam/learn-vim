local M   = {}
local core = require('vim-learn')
local ns   = vim.api.nvim_create_namespace('vim_learn_cs')

local FILTERS = { 'all', 'unknown', 'known' }

local state = {
  win        = nil,
  buf        = nil,
  filter_idx = 1,
  entry_map  = {},   -- lnum (0-based) -> item id
}

-- ── helpers ──────────────────────────────────────────────────────────────────

local function win_dims()
  local w = math.max(80, math.floor(vim.o.columns * 0.85))
  local h = math.max(20, math.floor(vim.o.lines   * 0.85))
  return w, h,
    math.floor((vim.o.columns - w) / 2),
    math.floor((vim.o.lines   - h) / 2)
end

local function filtered_data()
  local data = core.get_data()
  local mode = FILTERS[state.filter_idx]
  if mode == 'unknown' then
    return vim.tbl_filter(function(i) return not core.is_known(i.id) end, data)
  elseif mode == 'known' then
    return vim.tbl_filter(function(i) return core.is_known(i.id) end, data)
  end
  return data
end

-- strip html-like tags that the web UI injects (e.g. <span class="reference">)
local function strip_html(s)
  return (s:gsub('<[^>]+>', ''))
end

-- ── render ───────────────────────────────────────────────────────────────────

local function render()
  if not (state.buf and vim.api.nvim_buf_is_valid(state.buf)) then return end

  local data   = filtered_data()
  local mode   = FILTERS[state.filter_idx]
  local w      = vim.api.nvim_win_get_width(state.win)
  local sol_w  = 22
  local lvl_w  = 4
  local q_w    = math.max(20, w - sol_w - lvl_w - 8)

  local lines  = {}
  local hls    = {}   -- { lnum, col_start, col_end, hl_group }
  local emap   = {}

  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end

  -- header
  local header = string.format(
    ' Vim Cheatsheet  filter: %-7s  %d commands   <f> cycle  <Space> toggle known  <q> close',
    mode, #data)
  table.insert(lines, header)
  hl(0, 0, -1, 'Title')
  table.insert(lines, string.rep('─', w - 2))

  local cur_cat = nil
  for _, item in ipairs(data) do
    -- category header
    if item.category ~= cur_cat then
      cur_cat = item.category
      table.insert(lines, '')
      local cat_line = '  ' .. item.category
      local cat_lnum = #lines - 1
      table.insert(lines, cat_line)
      hl(cat_lnum, 2, 2 + #item.category, core.get_category_hl(item.category))
    end

    -- entry line
    local known  = core.is_known(item.id)
    local mark   = known and '✓' or ' '
    local sols   = table.concat(item.solution, '  ')
    if #sols > sol_w then sols = sols:sub(1, sol_w - 1) .. '…' end
    local question = strip_html(item.question)
    if #question > q_w then question = question:sub(1, q_w - 1) .. '…' end
    local line = string.format(' %s  %-' .. sol_w .. 's  %-' .. q_w .. 's  [%d]',
      mark, sols, question, item.level)

    local lnum = #lines
    emap[lnum]  = item.id
    table.insert(lines, line)

    -- colorise: solution bold/keyword, known items dimmed
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

-- ── public ───────────────────────────────────────────────────────────────────

function M.open()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_set_current_win(state.win)
    return
  end

  state.buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.buf].bufhidden = 'wipe'
  vim.bo[state.buf].filetype  = 'vim-learn'

  local w, h, col, row = win_dims()
  state.win = vim.api.nvim_open_win(state.buf, true, {
    relative  = 'editor',
    width     = w,
    height    = h,
    col       = col,
    row       = row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' Vim Learn – Cheatsheet ',
    title_pos = 'center',
  })
  vim.wo[state.win].wrap       = false
  vim.wo[state.win].cursorline = true
  vim.wo[state.win].scrolloff  = 3

  core.setup_category_highlights()
  render()

  -- keymaps
  local o = { buffer = state.buf, noremap = true, silent = true }
  vim.keymap.set('n', 'q',     M.close, o)
  vim.keymap.set('n', '<Esc>', M.close, o)

  vim.keymap.set('n', 'f', function()
    state.filter_idx = (state.filter_idx % #FILTERS) + 1
    render()
  end, o)

  vim.keymap.set('n', '<Space>', function()
    local lnum = vim.api.nvim_win_get_cursor(state.win)[1] - 1
    local id   = state.entry_map[lnum]
    if id then
      core.toggle_known(id)
      render()
    end
  end, o)

  vim.keymap.set('n', '<CR>', function()
    local lnum = vim.api.nvim_win_get_cursor(state.win)[1] - 1
    local id   = state.entry_map[lnum]
    if id then
      core.toggle_known(id)
      render()
    end
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

  -- close when focus leaves the float
  vim.api.nvim_create_autocmd('WinLeave', {
    buffer   = state.buf,
    once     = true,
    callback = M.close,
  })
end

function M.close()
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_win_close(state.win, true)
  end
  state.win = nil
  state.buf = nil
end

return M
