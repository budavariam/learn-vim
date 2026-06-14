local M    = {}
local core  = require('vim-learn')
local ns    = vim.api.nvim_create_namespace('vim_learn_quiz')

local state = {
  win      = nil,
  buf      = nil,
  items    = {},
  idx      = 1,
  revealed = false,
  known_ct = 0,
  skip_ct  = 0,
}

-- ── helpers ───────────────────────────────────────────────────────────────────

local function win_dims()
  local w = math.min(72, math.floor(vim.o.columns * 0.75))
  local h = 14
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

-- ── render ────────────────────────────────────────────────────────────────────

local function render()
  if not (state.buf and vim.api.nvim_buf_is_valid(state.buf)) then return end

  local total = #state.items
  if total == 0 then
    vim.bo[state.buf].modifiable = true
    vim.api.nvim_buf_set_lines(state.buf, 0, -1, false, {
      '', '  No items to quiz!', '',
      '  Change the filter in the cheatsheet (f key) to include more items.',
      '', '  Press q to close.',
    })
    vim.bo[state.buf].modifiable = false
    return
  end

  local item   = state.items[state.idx]
  local w      = vim.api.nvim_win_get_width(state.win)
  local bar    = string.rep('─', w - 2)

  -- progress info
  local progress = string.format('  %d / %d   known: %d   skipped: %d',
    state.idx, total, state.known_ct, state.skip_ct)

  -- question
  local question = strip_html(item.question)
  local cat_info = string.format('  Category: %s   Level: %d', item.category, item.level)

  local lines = {
    progress,
    bar,
    '',
    '  ' .. question,
    '',
    bar,
    '',
  }

  local hls = {}
  local function hl(lnum, cs, ce, grp)
    table.insert(hls, { lnum, cs, ce, grp })
  end
  hl(0, 0, -1, 'Comment')

  if state.revealed then
    -- show all solutions
    local sol_label = '  Answer: '
    for i, sol in ipairs(item.solution) do
      local prefix = i == 1 and sol_label or string.rep(' ', #sol_label)
      local lnum   = #lines
      table.insert(lines, prefix .. sol)
      hl(lnum, #prefix, #prefix + #sol, 'Keyword')
    end
    table.insert(lines, '')
    table.insert(lines, cat_info)
    table.insert(lines, '')
    table.insert(lines, bar)
    table.insert(lines, '')
    local hints = '  [k] known  [n] skip  [q] quit  [r] reshuffle'
    table.insert(lines, hints)
    hl(#lines - 1, 0, -1, 'Comment')
  else
    local lnum_hidden = #lines
    table.insert(lines, '  Answer:  [press SPACE or ENTER to reveal]')
    hl(lnum_hidden, 10, -1, 'NonText')
    table.insert(lines, '')
    table.insert(lines, bar)
    table.insert(lines, '')
    local hints = '  [SPACE/ENTER] reveal  [n] skip  [q] quit  [r] reshuffle'
    table.insert(lines, hints)
    hl(#lines - 1, 0, -1, 'Comment')
  end

  vim.bo[state.buf].modifiable = true
  vim.api.nvim_buf_set_lines(state.buf, 0, -1, false, lines)
  vim.bo[state.buf].modifiable = false

  vim.api.nvim_buf_clear_namespace(state.buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_add_highlight(state.buf, ns, h[4], h[1], h[2], h[3])
  end

  -- category color on question line (line 3, 0-based)
  local cat_hl = core.get_category_hl(item.category)
  vim.api.nvim_buf_add_highlight(state.buf, ns, cat_hl, 3, 2, -1)
end

local function next_item()
  state.idx      = state.idx + 1
  state.revealed = false
  if state.idx > #state.items then
    -- wrap: show summary then restart
    state.idx     = 1
    state.known_ct = 0
    state.skip_ct  = 0
    vim.notify(string.format(
      'vim-learn: Quiz loop complete! Known: %d / %d',
      state.known_ct, #state.items), vim.log.levels.INFO)
  end
  render()
end

-- ── public ────────────────────────────────────────────────────────────────────

function M.open(items_override)
  if state.win and vim.api.nvim_win_is_valid(state.win) then
    vim.api.nvim_set_current_win(state.win)
    return
  end

  math.randomseed(os.time())

  -- build item list: unknown items first, shuffled
  local data = items_override or core.get_data()
  local unknown, known_items = {}, {}
  for _, item in ipairs(data) do
    if core.is_known(item.id) then
      table.insert(known_items, item)
    else
      table.insert(unknown, item)
    end
  end
  shuffle(unknown)
  shuffle(known_items)
  -- unknown first, then known for review
  state.items    = vim.list_extend(unknown, known_items)
  state.idx      = 1
  state.revealed = false
  state.known_ct = 0
  state.skip_ct  = 0

  state.buf = vim.api.nvim_create_buf(false, true)
  vim.bo[state.buf].bufhidden = 'wipe'
  vim.bo[state.buf].filetype  = 'vim-learn-quiz'

  local w, h, col, row = win_dims()
  state.win = vim.api.nvim_open_win(state.buf, true, {
    relative  = 'editor',
    width     = w,
    height    = h,
    col       = col,
    row       = row,
    style     = 'minimal',
    border    = 'rounded',
    title     = ' Vim Learn – Quiz ',
    title_pos = 'center',
  })
  vim.wo[state.win].wrap = true

  core.setup_category_highlights()
  render()

  local o = { buffer = state.buf, noremap = true, silent = true }

  -- reveal or next
  local function reveal_or_next()
    if not state.revealed then
      state.revealed = true
      render()
    else
      next_item()
    end
  end
  vim.keymap.set('n', '<Space>', reveal_or_next, o)
  vim.keymap.set('n', '<CR>',   reveal_or_next, o)

  -- mark known + advance
  vim.keymap.set('n', 'k', function()
    if state.revealed then
      local item = state.items[state.idx]
      if not core.is_known(item.id) then
        core.toggle_known(item.id)
        state.known_ct = state.known_ct + 1
      end
      next_item()
    else
      reveal_or_next()
    end
  end, o)

  -- mark unknown + advance (undo known if set)
  vim.keymap.set('n', 'u', function()
    if state.revealed then
      local item = state.items[state.idx]
      if core.is_known(item.id) then
        core.toggle_known(item.id)
      end
      next_item()
    end
  end, o)

  -- skip
  vim.keymap.set('n', 'n', function()
    state.skip_ct  = state.skip_ct + 1
    state.revealed = false
    next_item()
  end, o)

  -- reshuffle remaining
  vim.keymap.set('n', 'r', function()
    local remaining = {}
    for i = state.idx, #state.items do
      table.insert(remaining, state.items[i])
    end
    shuffle(remaining)
    for i, v in ipairs(remaining) do
      state.items[state.idx + i - 1] = v
    end
    state.revealed = false
    render()
  end, o)

  vim.keymap.set('n', 'q',     M.close, o)
  vim.keymap.set('n', '<Esc>', M.close, o)

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
