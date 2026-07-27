// Pure computation — no React imports.

export type Pos = { lineNumber: number; column: number }
export type QvimxBorderShape = 'full-rect' | 'code-right' | 'inverse-code' | 'sub-rect' | 'rectangles'
export type QvimxCodeSize = 'short' | 'medium' | 'long'
export type CellKind = 'border' | 'interior' | 'outside'

export interface BoardDimensions {
  minLine: number
  maxLine: number
  minCol: number
  maxCol: number
  lineWidths: number[] // length of each bordered line (all equal for full-rect)
  lineContentWidths?: number[] // per-interior-line code character count (inverse-code / code-right)
}

// ── helpers ───────────────────────────────────────────────────────────────────

export function posEq(a: Pos, b: Pos): boolean {
  return a.lineNumber === b.lineNumber && a.column === b.column
}

// ── buildBorderedContent ──────────────────────────────────────────────────────
// Wraps raw code in box-drawing characters so the border appears as real text
// inside Monaco. The player navigates the bordered document; border cells are
// positions where the character is ┌ ┐ └ ┘ │ or ─.
//
// Output example (innerWidth = 10):
//   ┌──────────┐   line 1
//   │hello     │   line 2
//   │world     │   line 3
//   └──────────┘   line 4 (= numRawLines + 2)
//
// sub-rect / rectangles: include all raw lines so the full code is visible.
// The inner bordered rect(s) define the playable area; outer lines are 'outside'.

function borderedSection(lines: string[], innerWidth: number): string[] {
  return [
    '┌' + '─'.repeat(innerWidth) + '┐',
    ...lines.map(l => '│' + l.padEnd(innerWidth) + '│'),
    '└' + '─'.repeat(innerWidth) + '┘',
  ]
}

export function buildBorderedContent(
  rawContent: string,
  shape: QvimxBorderShape,
): { borderedContent: string; dims: BoardDimensions; allRectDims?: BoardDimensions[] } {
  const rawLines = rawContent.split('\n')

  // ── sub-rect ──────────────────────────────────────────────────────────────
  if (shape === 'sub-rect') {
    const vPad = Math.floor(rawLines.length * 0.2)
    const innerSlice = rawLines.slice(vPad, rawLines.length - vPad)
    const effectiveInner = innerSlice.length > 0 ? innerSlice : rawLines
    const effectivePad = innerSlice.length > 0 ? vPad : 0

    const innerWidth = Math.max(...effectiveInner.map(l => l.length), 1)
    const section = borderedSection(effectiveInner, innerWidth)

    const totalWidth = innerWidth + 2
    const outerTop = rawLines.slice(0, effectivePad)
    const outerBottom = effectivePad > 0 ? rawLines.slice(rawLines.length - effectivePad) : []
    const allLines = [...outerTop, ...section, ...outerBottom]

    const dims: BoardDimensions = {
      minLine: effectivePad + 1,
      maxLine: effectivePad + effectiveInner.length + 2,
      minCol: 1,
      maxCol: totalWidth,
      lineWidths: Array(allLines.length).fill(totalWidth),
    }
    return { borderedContent: allLines.join('\n'), dims }
  }

  // ── rectangles: two vertically-stacked inner bordered rects ───────────────
  if (shape === 'rectangles') {
    const vPad = Math.max(1, Math.floor(rawLines.length * 0.05))
    const innerSlice = rawLines.slice(vPad, rawLines.length - vPad)
    const effectiveInner = innerSlice.length > 0 ? innerSlice : rawLines
    const effectivePad = innerSlice.length > 0 ? vPad : 0

    const mid = Math.floor(effectiveInner.length / 2)
    const gap = Math.max(1, Math.floor(effectiveInner.length * 0.04))

    const topLines = effectiveInner.slice(0, mid)
    const gapLines = effectiveInner.slice(mid, mid + gap)
    const bottomLines = effectiveInner.slice(mid + gap)

    const topWidth = Math.max(...(topLines.length > 0 ? topLines : ['']).map(l => l.length), 1)
    const bottomWidth = Math.max(...(bottomLines.length > 0 ? bottomLines : ['']).map(l => l.length), 1)

    const topSection = borderedSection(topLines, topWidth)
    const bottomSection = borderedSection(bottomLines, bottomWidth)

    const outerTop = rawLines.slice(0, effectivePad)
    const outerBottom = effectivePad > 0 ? rawLines.slice(rawLines.length - effectivePad) : []
    const allLines = [...outerTop, ...topSection, ...gapLines, ...bottomSection, ...outerBottom]

    const topMinLine = effectivePad + 1
    const topMaxLine = topMinLine + topLines.length + 1
    const bottomMinLine = topMaxLine + gapLines.length + 1
    const bottomMaxLine = bottomMinLine + bottomLines.length + 1
    const maxWidth = Math.max(topWidth, bottomWidth) + 2

    const topDims: BoardDimensions = {
      minLine: topMinLine,
      maxLine: topMaxLine,
      minCol: 1,
      maxCol: topWidth + 2,
      lineWidths: Array(topLines.length + 2).fill(topWidth + 2),
    }
    const bottomDims: BoardDimensions = {
      minLine: bottomMinLine,
      maxLine: bottomMaxLine,
      minCol: 1,
      maxCol: bottomWidth + 2,
      lineWidths: Array(bottomLines.length + 2).fill(bottomWidth + 2),
    }
    const outerDims: BoardDimensions = {
      minLine: topMinLine,
      maxLine: bottomMaxLine,
      minCol: 1,
      maxCol: maxWidth,
      lineWidths: Array(allLines.length).fill(maxWidth),
    }

    return {
      borderedContent: allLines.join('\n'),
      dims: outerDims,
      allRectDims: [topDims, bottomDims],
    }
  }

  // ── full-rect, inverse-code, code-right ───────────────────────────────────
  const lines = rawLines
  const innerWidth = Math.max(...lines.map(l => l.length), 1)

  const top = '┌' + '─'.repeat(innerWidth) + '┐'
  const bottom = '└' + '─'.repeat(innerWidth) + '┘'

  // inverse-code and code-right use regular whitespace; the neutral logic in
  // useQvimx distinguishes playable from non-playable cells at the game level.
  const wrappedLines = lines.map(l => '│' + l.padEnd(innerWidth) + '│')

  const totalWidth = innerWidth + 2
  const content = [top, ...wrappedLines, bottom].join('\n')

  const lineContentWidths: number[] | undefined =
    shape === 'inverse-code' || shape === 'code-right'
      ? lines.map(l => l.length)
      : undefined

  const dims: BoardDimensions = {
    minLine: 1,
    maxLine: lines.length + 2,
    minCol: 1,
    maxCol: totalWidth,
    lineWidths: Array(lines.length + 2).fill(totalWidth),
    ...(lineContentWidths !== undefined ? { lineContentWidths } : {}),
  }

  return { borderedContent: content, dims }
}

// ── classifyCell ──────────────────────────────────────────────────────────────
// Works on the BORDERED document coordinates (after buildBorderedContent).

export function classifyCell(pos: Pos, dims: BoardDimensions): CellKind {
  const { lineNumber: ln, column: col } = pos
  if (ln < dims.minLine || ln > dims.maxLine || col < dims.minCol || col > dims.maxCol) {
    return 'outside'
  }
  if (
    ln === dims.minLine ||
    ln === dims.maxLine ||
    col === dims.minCol ||
    col === dims.maxCol
  ) {
    return 'border'
  }
  return 'interior'
}

// ── borderStartPositions ──────────────────────────────────────────────────────

export function borderStartPositions(dims: BoardDimensions): Pos[] {
  const midCol = Math.floor((dims.minCol + dims.maxCol) / 2)
  const midLine = Math.floor((dims.minLine + dims.maxLine) / 2)
  return [
    { lineNumber: dims.minLine, column: midCol }, // top-mid  (player start)
    { lineNumber: dims.maxLine, column: midCol }, // bottom-mid (enemy start)
    { lineNumber: midLine, column: dims.minCol }, // left-mid  (respawn)
    { lineNumber: midLine, column: dims.maxCol }, // right-mid (respawn)
  ]
}

// ── allBorderCells ────────────────────────────────────────────────────────────

export function allBorderCells(dims: BoardDimensions): Pos[] {
  const cells: Pos[] = []
  for (let col = dims.minCol; col <= dims.maxCol; col++) {
    cells.push({ lineNumber: dims.minLine, column: col })
    cells.push({ lineNumber: dims.maxLine, column: col })
  }
  for (let ln = dims.minLine + 1; ln < dims.maxLine; ln++) {
    cells.push({ lineNumber: ln, column: dims.minCol })
    cells.push({ lineNumber: ln, column: dims.maxCol })
  }
  return cells
}

// ── allInteriorCells ──────────────────────────────────────────────────────────

export function allInteriorCells(dims: BoardDimensions): Pos[] {
  const cells: Pos[] = []
  for (let ln = dims.minLine + 1; ln < dims.maxLine; ln++) {
    for (let col = dims.minCol + 1; col < dims.maxCol; col++) {
      cells.push({ lineNumber: ln, column: col })
    }
  }
  return cells
}

// ── floodFillClaim ────────────────────────────────────────────────────────────
// Arc-based flood fill: the temp line runs from entryBorderCell to
// exitBorderCell, dividing the board border into two arcs.  BFS is confined
// to INTERIOR cells only (cannot traverse border cells), seeded from interior
// cells adjacent to each arc.  This prevents the BFS from going "around" the
// temp line via the border ring.  The smaller of the two enclosed regions is
// returned (standard Qix behaviour when enemy location is unknown).

function pkey(p: Pos): string {
  return `${p.lineNumber},${p.column}`
}

export function floodFillClaim(
  allInterior: Pos[],
  tempLine: Pos[],
  entryBorderCell: Pos,
  exitBorderCell: Pos,
  orderedBorder: Pos[],
): Pos[] {
  if (!tempLine.length || !orderedBorder.length) return []

  const wallSet = new Set<string>(tempLine.map(pkey))
  const interiorSet = new Set<string>(allInterior.map(pkey))

  // BFS confined to interior cells (border cells act as an impenetrable outer wall)
  function bfsFromSeeds(seeds: Pos[]): Set<string> {
    const visited = new Set<string>()
    const queue: Pos[] = []
    for (const s of seeds) {
      const k = pkey(s)
      if (visited.has(k) || wallSet.has(k) || !interiorSet.has(k)) continue
      visited.add(k)
      queue.push(s)
    }
    let head = 0
    while (head < queue.length) {
      const { lineNumber: ln, column: col } = queue[head++]
      for (const [dl, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
        const np = { lineNumber: ln + dl, column: col + dc }
        const k = pkey(np)
        if (visited.has(k) || wallSet.has(k) || !interiorSet.has(k)) continue
        visited.add(k)
        queue.push(np)
      }
    }
    return visited
  }

  // Interior cells adjacent to a border arc (these are the BFS seeds for that side)
  function arcSeeds(fromIdx: number, toIdx: number): Pos[] {
    const n = orderedBorder.length
    const seen = new Set<string>()
    const result: Pos[] = []
    let i = fromIdx
    for (;;) {
      const bp = orderedBorder[i]
      for (const [dl, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
        const np = { lineNumber: bp.lineNumber + dl, column: bp.column + dc }
        const k = pkey(np)
        if (!seen.has(k) && !wallSet.has(k) && interiorSet.has(k)) {
          seen.add(k)
          result.push(np)
        }
      }
      if (i === toIdx) break
      i = (i + 1) % n
    }
    return result
  }

  const entryIdx = orderedBorder.findIndex(p => posEq(p, entryBorderCell))
  const exitIdx = orderedBorder.findIndex(p => posEq(p, exitBorderCell))
  // Fall back to old all-border-seed approach if endpoints not found
  if (entryIdx === -1 || exitIdx === -1) {
    const fallbackSeeds: Pos[] = []
    const seen = new Set<string>()
    for (const bp of orderedBorder) {
      for (const [dl, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]) {
        const np = { lineNumber: bp.lineNumber + dl, column: bp.column + dc }
        const k = pkey(np)
        if (!seen.has(k) && !wallSet.has(k) && interiorSet.has(k)) {
          seen.add(k)
          fallbackSeeds.push(np)
        }
      }
    }
    const reachable = bfsFromSeeds(fallbackSeeds)
    return allInterior.filter(p => !reachable.has(pkey(p)))
  }

  // Arc1: clockwise entry → exit  |  Arc2: clockwise exit → entry
  const seeds1 = arcSeeds(entryIdx, exitIdx)
  const seeds2 = arcSeeds(exitIdx, entryIdx)

  const region1 = bfsFromSeeds(seeds1)
  const region2 = bfsFromSeeds(seeds2)

  // Use the EXCLUSIVE portion of each region — cells reachable from ONLY one arc.
  // Cells in both regions are "outside" (connected to both arcs → not enclosed).
  // This prevents the 99% bug: when the temp-line doesn't form a real partition,
  // both regions overlap heavily, so their exclusive portions are near-empty.
  const exclusive1 = allInterior.filter(p => {
    const k = pkey(p)
    return region1.has(k) && !region2.has(k)
  })
  const exclusive2 = allInterior.filter(p => {
    const k = pkey(p)
    return region2.has(k) && !region1.has(k)
  })

  // Claim the smaller exclusive region
  return exclusive1.length <= exclusive2.length ? exclusive1 : exclusive2
}

// ── orderedBorderCells ────────────────────────────────────────────────────────
// Returns border cells in clockwise order: top row L→R, right col T→B,
// bottom row R→L, left col B→T.

export function orderedBorderCells(dims: BoardDimensions): Pos[] {
  const { minLine, maxLine, minCol, maxCol } = dims
  const cells: Pos[] = []
  for (let col = minCol; col <= maxCol; col++) cells.push({ lineNumber: minLine, column: col })
  for (let ln = minLine + 1; ln <= maxLine; ln++) cells.push({ lineNumber: ln, column: maxCol })
  for (let col = maxCol - 1; col >= minCol; col--) cells.push({ lineNumber: maxLine, column: col })
  for (let ln = maxLine - 1; ln >= minLine + 1; ln--) cells.push({ lineNumber: ln, column: minCol })
  return cells
}

// ── computeClosingLine ────────────────────────────────────────────────────────

export function computeClosingLine(
  lastDrawnPos: Pos,
  primaryAxis: 'h' | 'v',
  dims: BoardDimensions,
  tempLine: Pos[],
): Pos[] {
  const tempSet = new Set<string>(tempLine.map(p => `${p.lineNumber},${p.column}`))
  const result: Pos[] = []

  if (primaryAxis === 'v') {
    const distToTop = lastDrawnPos.lineNumber - dims.minLine
    const distToBottom = dims.maxLine - lastDrawnPos.lineNumber
    const step = distToTop <= distToBottom ? -1 : 1
    let ln = lastDrawnPos.lineNumber + step
    while (ln >= dims.minLine && ln <= dims.maxLine) {
      if (tempSet.has(`${ln},${lastDrawnPos.column}`)) break
      result.push({ lineNumber: ln, column: lastDrawnPos.column })
      if (ln === dims.minLine || ln === dims.maxLine) break
      ln += step
    }
  } else {
    const distToLeft = lastDrawnPos.column - dims.minCol
    const distToRight = dims.maxCol - lastDrawnPos.column
    const step = distToLeft <= distToRight ? -1 : 1
    let col = lastDrawnPos.column + step
    while (col >= dims.minCol && col <= dims.maxCol) {
      if (tempSet.has(`${lastDrawnPos.lineNumber},${col}`)) break
      result.push({ lineNumber: lastDrawnPos.lineNumber, column: col })
      if (col === dims.minCol || col === dims.maxCol) break
      col += step
    }
  }

  return result
}
