local M = {}

M.config = {
  data_path  = nil,
  state_path = vim.fn.stdpath('data') .. '/vim-learn-state.json',
}

function M.setup(opts)
  M.config = vim.tbl_deep_extend('force', M.config, opts or {})
  M._data  = nil
  M._state = nil

  -- force = true so re-sourcing / lazy re-setup doesn't raise E174
  vim.api.nvim_create_user_command('VimLearnCheatsheet', function()
    require('vim-learn.cheatsheet').open()
  end, { desc = 'Open Vim cheatsheet overlay', force = true })

  vim.api.nvim_create_user_command('VimLearnQuiz', function()
    require('vim-learn.quiz').open()
  end, { desc = 'Open Vim quiz overlay', force = true })

  vim.api.nvim_create_user_command('VimLearnArcade', function()
    require('vim-learn.arcade').open_arcade()
  end, { desc = 'Open Vim arcade overlay', force = true })
end

-- ── data ─────────────────────────────────────────────────────────────────────

function M.get_data()
  if M._data then return M._data end
  if not M.config.data_path then
    vim.notify('vim-learn: data_path not configured', vim.log.levels.ERROR)
    return {}
  end
  local path = vim.fn.expand(M.config.data_path)
  if vim.fn.filereadable(path) == 0 then
    vim.notify('vim-learn: cannot read ' .. path, vim.log.levels.ERROR)
    return {}
  end
  local ok_r, lines = pcall(vim.fn.readfile, path)
  if not ok_r then
    vim.notify('vim-learn: readfile error – ' .. tostring(lines), vim.log.levels.ERROR)
    return {}
  end
  local ok_j, data = pcall(vim.json.decode, table.concat(lines, '\n'))
  if not ok_j then
    vim.notify('vim-learn: invalid JSON – ' .. tostring(data), vim.log.levels.ERROR)
    return {}
  end
  M._data = data
  return data
end

function M.reload_data()
  M._data = nil
  return M.get_data()
end

-- ── persistent state (known items) ───────────────────────────────────────────

function M.get_state()
  if M._state then return M._state end
  local path = vim.fn.expand(M.config.state_path)
  if vim.fn.filereadable(path) == 0 then
    M._state = { known = {} }
    return M._state
  end
  local ok_r, lines = pcall(vim.fn.readfile, path)
  if ok_r and lines and #lines > 0 then
    local ok_j, s = pcall(vim.json.decode, table.concat(lines, '\n'))
    if ok_j and s then
      M._state = s
      return s
    end
  end
  M._state = { known = {} }
  return M._state
end

function M.save_state()
  local path = vim.fn.expand(M.config.state_path)
  vim.fn.mkdir(vim.fn.fnamemodify(path, ':h'), 'p')
  vim.fn.writefile({ vim.json.encode(M._state or { known = {} }) }, path)
end

function M.is_known(id)
  return vim.tbl_contains(M.get_state().known, id)
end

function M.toggle_known(id)
  local s = M.get_state()
  if M.is_known(id) then
    s.known = vim.tbl_filter(function(k) return k ~= id end, s.known)
  else
    table.insert(s.known, id)
  end
  M.save_state()
end

-- ── category colours (same hue algorithm as the web cheatsheet) ──────────────

local function hsl_to_hex(h, s, l)
  s = s / 100
  l = l / 100
  local c = (1 - math.abs(2 * l - 1)) * s
  local x = c * (1 - math.abs((h / 60) % 2 - 1))
  local m = l - c / 2
  local r, g, b
  if     h < 60  then r, g, b = c, x, 0
  elseif h < 120 then r, g, b = x, c, 0
  elseif h < 180 then r, g, b = 0, c, x
  elseif h < 240 then r, g, b = 0, x, c
  elseif h < 300 then r, g, b = x, 0, c
  else                r, g, b = c, 0, x
  end
  return string.format('#%02x%02x%02x',
    math.floor((r + m) * 255),
    math.floor((g + m) * 255),
    math.floor((b + m) * 255))
end

function M.setup_category_highlights()
  local data = M.get_data()
  local cats, seen = {}, {}
  for _, item in ipairs(data) do
    local cat = item.category
    if cat and not seen[cat] then
      seen[cat] = true
      table.insert(cats, cat)
    end
  end
  table.sort(cats)
  local n = #cats
  M._cat_hl = {}
  if n == 0 then return end
  for i, cat in ipairs(cats) do
    local hue = math.floor(((i - 1) / n) * 360)
    local hex  = hsl_to_hex(hue, 70, 52)
    local hl   = 'VimLearnCat' .. i
    vim.api.nvim_set_hl(0, hl, { fg = hex, bold = true })
    M._cat_hl[cat] = hl
  end
end

function M.get_category_hl(cat)
  if not M._cat_hl then M.setup_category_highlights() end
  return M._cat_hl[cat] or 'Normal'
end

-- Exposed only for unit tests.
M._test_api = { hsl_to_hex = hsl_to_hex }

return M
