import { getPresetDimensions, generateGrid, generateLoremGrid } from './VimBotsEngine'
import type { VimBotsBoardSource, VimBoardPreset } from './VimBotsEngine'
import { getSizedFile } from '../files/index'
import type { Language } from './types'

// ── Grid content loading ──

export function buildGridContent(
  boardSource: VimBotsBoardSource,
  gridPreset: VimBoardPreset,
  customRows: number,
  customCols: number,
  codeFileSize: 'short' | 'medium' | 'long'
): string {
  if (boardSource === 'grid' || boardSource === 'lorem-grid') {
    const dims =
      gridPreset === 'custom'
        ? { rows: customRows, cols: customCols }
        : getPresetDimensions(gridPreset)
    return boardSource === 'lorem-grid'
      ? generateLoremGrid(dims.rows, dims.cols)
      : generateGrid(dims.rows, dims.cols)
  }
  return getSizedFile(boardSource as Language, codeFileSize)
}
