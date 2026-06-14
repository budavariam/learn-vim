local cs = require('vim-learn.cheatsheet')
local core = require('vim-learn')
local api = cs._test_api

-- ── fuzzy_match ───────────────────────────────────────────────────────────────

describe('fuzzy_match', function()
  local fm = api.fuzzy_match

  it('empty query always matches', function()
    truthy(fm('anything here', ''))
  end)

  it('exact substring matches', function()
    truthy(fm('move cursor left', 'cursor'))
  end)

  it('non-contiguous characters match in order', function()
    truthy(fm('move cursor left', 'mvl'))   -- m..v..l in order
  end)

  it('characters out of order do not match', function()
    falsy(fm('hello world', 'wh'))          -- w comes after h in text
  end)

  it('query longer than text does not match', function()
    falsy(fm('hi', 'hello'))
  end)

  it('case insensitive', function()
    truthy(fm('Move Cursor Left', 'mcl'))
  end)

  it('does not match missing character', function()
    falsy(fm('goto end', 'gg'))  -- only one 'g' in text
  end)
end)

-- ── trunc_pad ─────────────────────────────────────────────────────────────────

describe('trunc_pad', function()
  local tp = api.trunc_pad

  it('pads short string to target width', function()
    local result = tp('hi', 10)
    eq(vim.fn.strdisplaywidth(result), 10)
  end)

  it('leaves string unchanged when exact width', function()
    local result = tp('hello', 5)
    eq(result, 'hello')
  end)

  it('truncates string exceeding target width', function()
    local result = tp('hello world', 5)
    eq(vim.fn.strdisplaywidth(result), 5)
  end)

  it('truncated result ends with ellipsis character', function()
    local result = tp('hello world', 7)
    -- last visible char should be '…' (the trunc indicator)
    truthy(result:find('…'))
  end)
end)

-- ── filtered_sorted_data ─────────────────────────────────────────────────────

describe('filtered_sorted_data – basic', function()
  it('returns all items with default state', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    eq(#data, 11)
  end)

  it('level_min filter excludes lower levels', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 1, level_max = 9 })
    local data = api.filtered_sorted_data()
    for _, item in ipairs(data) do
      truthy(item.level >= 1, 'item level ' .. item.level .. ' below min 1')
    end
  end)

  it('level_max filter excludes higher levels', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 0, level_max = 1 })
    local data = api.filtered_sorted_data()
    for _, item in ipairs(data) do
      truthy(item.level <= 1, 'item level ' .. item.level .. ' above max 1')
    end
    -- Advanced (level 7) entries should be gone
    eq(#data, 8)
  end)

  it('exact level range returns only matching items', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 7, level_max = 7 })
    local data = api.filtered_sorted_data()
    eq(#data, 2)   -- two Advanced entries at level 7
    for _, item in ipairs(data) do eq(item.level, 7) end
  end)
end)

describe('filtered_sorted_data – known filter', function()
  it('unknown filter hides known items', function()
    core.toggle_known('id001')   -- mark h as known
    api.set_state({ filter_idx = 2, search_query = '', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    for _, item in ipairs(data) do
      falsy(item.id == 'id001', 'known item id001 should be hidden')
    end
    eq(#data, 10)
  end)

  it('known filter shows only known items', function()
    core.toggle_known('id001')
    core.toggle_known('id002')
    api.set_state({ filter_idx = 3, search_query = '', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    eq(#data, 2)
    eq(data[1].id, 'id001')
    eq(data[2].id, 'id002')
  end)
end)

describe('filtered_sorted_data – fuzzy search', function()
  it('filters by search query', function()
    api.set_state({ filter_idx = 1, search_query = 'macro', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    eq(#data, 2)   -- "record a macro" + "play a macro"
  end)

  it('empty query returns all items', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 0, level_max = 9 })
    eq(#api.filtered_sorted_data(), 11)
  end)

  it('non-matching query returns empty list', function()
    api.set_state({ filter_idx = 1, search_query = 'xyzzy', level_min = 0, level_max = 9 })
    eq(#api.filtered_sorted_data(), 0)
  end)

  it('matches by category name', function()
    api.set_state({ filter_idx = 1, search_query = 'Advanced', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    eq(#data, 2)
  end)
end)

describe('filtered_sorted_data – ordering', function()
  it('categories sorted by their minimum level', function()
    api.set_state({ filter_idx = 1, search_query = '', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    -- collect category order
    local cat_order, seen = {}, {}
    for _, item in ipairs(data) do
      if not seen[item.category] then
        seen[item.category] = true
        table.insert(cat_order, item.category)
      end
    end
    -- Advanced (min level 7) must come after categories with lower min levels
    local adv_pos = 0
    for i, c in ipairs(cat_order) do if c == 'Advanced' then adv_pos = i end end
    truthy(adv_pos == #cat_order, 'Advanced should be last (highest min level)')
  end)

  it('items within a category sorted by level ascending', function()
    api.set_state({ filter_idx = 1, search_query = 'Cursor', level_min = 0, level_max = 9 })
    local data = api.filtered_sorted_data()
    local cursor_items = {}
    for _, item in ipairs(data) do
      if item.category == 'Cursor movement' then
        table.insert(cursor_items, item)
      end
    end
    for i = 2, #cursor_items do
      truthy(cursor_items[i].level >= cursor_items[i-1].level,
        'items out of level order at index ' .. i)
    end
  end)
end)
