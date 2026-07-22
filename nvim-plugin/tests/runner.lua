-- Minimal headless test runner for vim-learn.nvim
-- Usage: nvim --headless -u NONE -l nvim-plugin/tests/runner.lua
--        (run from the repo root)

local here       = debug.getinfo(1, 'S').source:sub(2)   -- absolute path of this file
local tests_dir  = vim.fn.fnamemodify(here, ':h')
local plugin_dir = vim.fn.fnamemodify(tests_dir, ':h')

-- Add the plugin to runtimepath so require('vim-learn') works.
vim.opt.rtp:prepend(plugin_dir)

-- Point vim-learn at the test fixture and a temp state file.
local state_file = vim.fn.tempname() .. '-vim-learn-test.json'
local core = require('vim-learn')
core.setup({
  data_path  = tests_dir .. '/fixtures/data.json',
  state_path = state_file,
})

-- ── tiny test framework (globals used by test files) ─────────────────────────

local passed  = 0
local failed  = 0
local suite   = ''

function describe(name, fn)          -- luacheck: ignore
  suite = name
  io.write('\n' .. name .. '\n')
  fn()
end

function it(name, fn)                -- luacheck: ignore
  -- Reset all volatile state before each test so tests are fully isolated.
  core._data  = nil
  core._state = nil
  -- Wipe the on-disk state file so toggle_known from previous tests doesn't
  -- bleed through when get_state() re-reads it.
  vim.fn.writefile({ '{"known":[]}' }, state_file)

  local ok, err = pcall(fn)
  if ok then
    passed = passed + 1
    io.write('  ✓ ' .. name .. '\n')
  else
    failed = failed + 1
    io.write('  ✗ ' .. name .. '\n')
    io.write('    ' .. tostring(err) .. '\n')
  end
end

-- Assertion helpers
function eq(a, b, msg)               -- luacheck: ignore
  if a ~= b then
    error((msg or '') .. '\n    expected: ' .. vim.inspect(b)
                       .. '\n    got:      ' .. vim.inspect(a), 2)
  end
end

function ne(a, b, msg)               -- luacheck: ignore
  if a == b then
    error((msg or '') .. '\n    did not expect: ' .. vim.inspect(a), 2)
  end
end

function truthy(v, msg)              -- luacheck: ignore
  if not v then
    error((msg or 'expected truthy') .. ', got ' .. vim.inspect(v), 2)
  end
end

function falsy(v, msg)               -- luacheck: ignore
  if v then
    error((msg or 'expected falsy') .. ', got ' .. vim.inspect(v), 2)
  end
end

function tbl_eq(a, b, msg)           -- luacheck: ignore
  local sa = vim.inspect(a)
  local sb = vim.inspect(b)
  if sa ~= sb then
    error((msg or '') .. '\n    expected: ' .. sb .. '\n    got: ' .. sa, 2)
  end
end

-- ── run test files ────────────────────────────────────────────────────────────

local test_files = {
  tests_dir .. '/test_core.lua',
  tests_dir .. '/test_cheatsheet.lua',
  tests_dir .. '/test_quiz.lua',
  tests_dir .. '/test_arcade.lua',
}

for _, f in ipairs(test_files) do
  local ok, err = pcall(dofile, f)
  if not ok then
    io.write('\nFailed to load ' .. vim.fn.fnamemodify(f, ':t') .. ': ' .. tostring(err) .. '\n')
    failed = failed + 1
  end
end

-- ── summary ───────────────────────────────────────────────────────────────────

io.write(string.format('\n%d passed  %d failed\n', passed, failed))

-- Clean up temp state file
vim.fn.delete(state_file)

if failed > 0 then
  vim.cmd('cquit 1')
else
  vim.cmd('quit!')
end
