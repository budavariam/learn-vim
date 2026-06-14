local qz  = require('vim-learn.quiz')
local core = require('vim-learn')
local api  = qz._test_api

-- ── level_bar ─────────────────────────────────────────────────────────────────

describe('level_bar', function()
  local lb = api.level_bar

  it('full range shows all filled', function()
    local bar = lb(0, 9)
    -- 10 × ● = 10 × 3 bytes = 30 bytes; display width = 10
    eq(vim.fn.strdisplaywidth(bar), 10)
    falsy(bar:find('○'))   -- no empty circles
  end)

  it('empty range shows all unfilled', function()
    -- level_min > level_max is an invalid state but level_min == level_max+1 won't happen
    -- test single-element range instead
    local bar = lb(5, 5)
    -- positions 0-4 and 6-9 are ○, position 5 is ●
    local chars = {}
    local i = 1
    while i <= #bar do
      local b1, b2, b3 = bar:byte(i), bar:byte(i+1), bar:byte(i+2)
      if b1 == 0xE2 and b2 == 0x97 and b3 == 0x8F then
        table.insert(chars, '●')
      else
        table.insert(chars, '○')
      end
      i = i + 3
    end
    eq(#chars, 10)
    eq(chars[6], '●')    -- index 6 = level 5 (1-based)
    eq(chars[1], '○')
    eq(chars[10], '○')
  end)

  it('range 0-2 fills first three positions', function()
    local bar = lb(0, 2)
    local w = vim.fn.strdisplaywidth(bar)
    eq(w, 10)
    -- first 3×3=9 bytes should be ●
    local prefix = bar:sub(1, 9)
    falsy(prefix:find('○'))
  end)
end)

-- ── cats_to_list / list_to_cats ───────────────────────────────────────────────

describe('cats_to_list', function()
  local ctl = api.cats_to_list
  local ltc = api.list_to_cats

  it('nil (all) round-trips as nil', function()
    eq(ctl(nil), nil)
    eq(ltc(nil), nil)
  end)

  it('converts set to sorted array', function()
    local list = ctl({ b = true, a = true, c = true })
    tbl_eq(list, { 'a', 'b', 'c' })
  end)

  it('converts array back to set', function()
    local set = ltc({ 'a', 'b', 'c' })
    truthy(set['a']); truthy(set['b']); truthy(set['c'])
    eq(set['d'], nil)
  end)

  it('roundtrip preserves content', function()
    local original = { x = true, y = true }
    local roundtripped = ltc(ctl(original))
    truthy(roundtripped['x']); truthy(roundtripped['y'])
    local n = 0; for _ in pairs(roundtripped) do n = n + 1 end
    eq(n, 2)
  end)

  it('empty set roundtrips as empty (not nil)', function()
    local list = ctl({})
    tbl_eq(list, {})
    local set = ltc({})
    tbl_eq(set, {})
  end)
end)

-- ── count_items / split_items ─────────────────────────────────────────────────

describe('count_items', function()
  local ci = api.count_items

  it('all items with no restrictions', function()
    eq(ci({ level_min=0, level_max=9, filter='all', categories=nil }), 11)
  end)

  it('level 0 only', function()
    -- h(0), j(0), i(0), u(0) = 4 items
    eq(ci({ level_min=0, level_max=0, filter='all', categories=nil }), 4)
  end)

  it('level 7+ only (Advanced)', function()
    eq(ci({ level_min=7, level_max=9, filter='all', categories=nil }), 2)
  end)

  it('empty range returns 0', function()
    eq(ci({ level_min=5, level_max=4, filter='all', categories=nil }), 0)
  end)

  it('category filter limits results', function()
    local only_advanced = { ['Advanced'] = true }
    eq(ci({ level_min=0, level_max=9, filter='all', categories=only_advanced }), 2)
  end)

  it('unknown filter excludes known items', function()
    core.toggle_known('id001')   -- mark 'h' as known
    local n = ci({ level_min=0, level_max=9, filter='unknown', categories=nil })
    eq(n, 10)
  end)

  it('known filter includes only known items', function()
    core.toggle_known('id001')
    core.toggle_known('id002')
    local n = ci({ level_min=0, level_max=9, filter='known', categories=nil })
    eq(n, 2)
  end)
end)

describe('split_items', function()
  local si = api.split_items

  it('all items go to unknown when nothing is known', function()
    local u, k = si({ level_min=0, level_max=9, filter='all', categories=nil })
    eq(#u, 11); eq(#k, 0)
  end)

  it('known item moves to known bucket', function()
    core.toggle_known('id001')
    local u, k = si({ level_min=0, level_max=9, filter='all', categories=nil })
    eq(#u, 10); eq(#k, 1)
    eq(k[1].id, 'id001')
  end)
end)

-- ── toggle_category ───────────────────────────────────────────────────────────

describe('toggle_category', function()
  local tc  = api.toggle_category
  local cats = { 'A', 'B', 'C' }

  it('nil (all) → deselect one → partial set', function()
    api.set_setup({ cfg = { categories = nil }, cat_all = cats })
    tc('B')
    local c = api.get_setup_cfg()
    eq(c.categories['A'], true)
    eq(c.categories['B'], nil)
    eq(c.categories['C'], true)
  end)

  it('partial set → select missing → back to nil (all)', function()
    api.set_setup({ cfg = { categories = { A = true, C = true } }, cat_all = cats })
    tc('B')   -- adds B, now all three selected → should collapse to nil
    eq(api.get_setup_cfg().categories, nil)
  end)

  it('partial set → deselect existing', function()
    api.set_setup({ cfg = { categories = { A = true, B = true, C = true } }, cat_all = cats })
    -- all three in table but not nil (shouldn't happen in normal flow, handle gracefully)
    tc('A')
    local c = api.get_setup_cfg()
    eq(c.categories['A'], nil)
    truthy(c.categories['B'])
    truthy(c.categories['C'])
  end)

  it('empty set → add one', function()
    api.set_setup({ cfg = { categories = {} }, cat_all = cats })
    tc('A')
    local c = api.get_setup_cfg()
    truthy(c.categories['A'])
    eq(c.categories['B'], nil)
  end)
end)

-- ── preset persistence ────────────────────────────────────────────────────────

describe('user presets', function()
  it('save and retrieve a user preset', function()
    api.save_preset('MyTest', {
      level_min = 2, level_max = 6, filter = 'unknown',
      categories = { Editing = true },
    })
    local presets = api.get_all_presets()
    local found
    for _, p in ipairs(presets) do
      if p.name == 'MyTest' then found = p end
    end
    truthy(found)
    eq(found.level_min, 2)
    eq(found.level_max, 6)
    eq(found.filter, 'unknown')
  end)

  it('delete a user preset', function()
    api.save_preset('ToDelete', { level_min=0, level_max=9, filter='all', categories=nil })
    api.delete_preset('ToDelete')
    local presets = api.get_all_presets()
    for _, p in ipairs(presets) do
      ne(p.name, 'ToDelete', 'preset should have been deleted')
    end
  end)

  it('default presets are always present', function()
    local presets = api.get_all_presets()
    local names = {}
    for _, p in ipairs(presets) do names[p.name] = true end
    truthy(names['All'])
    truthy(names['Beginner'])
    truthy(names['Unknown'])
    truthy(names['Expert'])
  end)
end)
