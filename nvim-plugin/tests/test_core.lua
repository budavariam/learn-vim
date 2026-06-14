local core = require('vim-learn')

-- ── hsl_to_hex (exposed via _test_api) ───────────────────────────────────────

describe('hsl_to_hex', function()
  local h2x = core._test_api.hsl_to_hex

  it('returns a 7-char hex string', function()
    local c = h2x(0, 70, 52)
    eq(#c, 7)
    eq(c:sub(1, 1), '#')
  end)

  it('pure red hue (0°) is reddish', function()
    local c = h2x(0, 100, 50)
    eq(c, '#ff0000')
  end)

  it('handles hue 120° (green)', function()
    local c = h2x(120, 100, 50)
    eq(c, '#00ff00')
  end)

  it('handles hue 240° (blue)', function()
    local c = h2x(240, 100, 50)
    eq(c, '#0000ff')
  end)
end)

-- ── get_data ──────────────────────────────────────────────────────────────────

describe('get_data', function()
  it('loads all fixture entries', function()
    local data = core.get_data()
    eq(#data, 11)
  end)

  it('caches on second call', function()
    local a = core.get_data()
    local b = core.get_data()
    eq(a, b)   -- same table reference
  end)

  it('returns empty array for missing file', function()
    local saved = core.config.data_path
    core.config.data_path = '/nonexistent/path.json'
    core._data = nil
    local data = core.get_data()
    eq(#data, 0)
    core.config.data_path = saved
    core._data = nil
  end)

  it('entries have expected fields', function()
    local item = core.get_data()[1]
    truthy(item.id)
    truthy(item.category)
    truthy(item.question)
    truthy(item.solution)
    truthy(type(item.level) == 'number')
  end)
end)

-- ── known-item state ──────────────────────────────────────────────────────────

describe('known / toggle_known', function()
  it('is_known returns false for fresh state', function()
    falsy(core.is_known('id001'))
  end)

  it('toggle_known marks an item known', function()
    core.toggle_known('id001')
    truthy(core.is_known('id001'))
  end)

  it('toggle_known unmarks an already-known item', function()
    core.toggle_known('id001')
    truthy(core.is_known('id001'))
    core.toggle_known('id001')
    falsy(core.is_known('id001'))
  end)

  it('marks one item without affecting others', function()
    core.toggle_known('id001')
    falsy(core.is_known('id002'))
  end)
end)

-- ── category highlights ───────────────────────────────────────────────────────

describe('setup_category_highlights', function()
  it('runs without error', function()
    core.setup_category_highlights()
    truthy(core._cat_hl)
  end)

  it('creates a hl group for each category', function()
    core.setup_category_highlights()
    truthy(core._cat_hl['Cursor movement'])
    truthy(core._cat_hl['Insert mode'])
    truthy(core._cat_hl['Advanced'])
  end)

  it('get_category_hl returns a non-empty string', function()
    local hl = core.get_category_hl('Editing')
    truthy(type(hl) == 'string' and hl ~= '')
  end)

  it('get_category_hl returns Normal for unknown category', function()
    eq(core.get_category_hl('NonExistentCategory'), 'Normal')
  end)
end)
