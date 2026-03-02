# Vim Cheat Sheet

* [Global](#global)
* [Cursor movement](#cursor-movement)
* [Insert mode, inserting/appending text](#insert-mode-insertingappending-text)
* [Editing](#editing)
* [Marking text (visual mode)](#marking-text-visual-mode)
* [Visual commands](#visual-commands)
* [Registers](#registers)
* [Marks](#marks)
* [Macros](#macros)
* [Cut and paste](#cut-and-paste)
* [Exiting](#exiting)
* [Search and replace](#search-and-replace)
* [Search in multiple files](#search-in-multiple-files)
* [Vim for programmers](#vim-for-programmers)
* [Working with multiple files](#working-with-multiple-files)
* [Split window](#split-window)
* [Tabs](#tabs)
* [Extra](#extra)
* [Open vim specially](#open-vim-specially)
* [Vim sessions](#vim-sessions)
* [Command line history](#command-line-history)
* [Folding](#folding)
* [Tips and tricks](#tips-and-tricks)

* multiple sources, like [this](https://vim.rtorr.com/), and [this](https://www.fprintf.net/vimCheatSheet.html) great cheatsheets.

## Global

* 1 - `:help keyword`, `:h keyword` - open help for `keyword`
* 2 - `:saveas file` - save `file` as
* 2 - `:close` - close current pane
* 5 - `K` - open man page for word under the cursor
* 5 - `gf` - open file under cursor (goto file)

## Cursor movement

* 0 - `h` - move cursor left
* 0 - `j` - move cursor down
* 0 - `k` - move cursor up
* 0 - `l` - move cursor right
* 2 - `H` - move to top of screen
* 2 - `M` - move to middle of screen
* 2 - `L` - move to bottom of screen
* 1 - `w` - jump forwards to the start of a word
* 2 - `W` - jump forwards to the start of a word (words can contain punctuation)
* 1 - `e` - jump forwards to the end of a word
* 2 - `E` - jump forwards to the end of a word (words can contain punctuation)
* 3 - `ge` - jump backward to the end of a word
* 4 - `gE` - jump backward to the end of a word (words can contain punctuation)
* 1 - `b` - jump backward to the start of a word
* 2 - `B` - jump backward to the start of a word (words can contain punctuation)
* 2 - `%` - move to matching character (default supported pairs: '()', '{}', '[]'; use *:h matchpairs* in vim for more info). It jumps to the one it finds in the current line
* 1 - `0` - jump to the start of the line
* 2 - `^` - jump to the first non-blank character of the line
* 1 - `$` - jump to the end of the line
* 3 - `g_` - jump to the last non-blank character of the line
* 1 - `gg` - go to the first line of the document
* 1 - `G` - go to the last line of the document
* 2 - `5G` - go to line `5`
* 2 - `:5` - go to line `5` with command
* 3 - `fx` - jump to next occurrence of character `x` in this line
* 3 - `tx` - jump to before next occurrence of character `x` in this line
* 3 - `Fx` - jump to previous occurence of character `x` in this line
* 4 - `Tx` - jump to after previous occurence of character `x` in this line
* 4 - `;` - repeat previous f, t, F or T movement
* 4 - `,` - repeat previous f, t, F or T movement, backward
* 3 - `}` - jump to next paragraph (or function/block, when editing code)
* 3 - `{` - jump to previous paragraph (or function/block, when editing code)
* 4 - `(` - jump to the previous sentence
* 4 - `)` - jump to the next sentence
* 3 - `zz` - cursor on screen to the center
* 3 - `zt` - cursor on screen to top
* 3 - `zb` - cursor on screen to bottom
* 3 - `ctrl-e` - move screen down one line (without moving cursor), same as `+` symbol
* 3 - `ctrl-y` - move screen up one line (without moving cursor), same as `-` symbol
* 2 - `ctrl-b` - move back one full screen (back full page)
* 2 - `ctrl-f` - move forward one full screen (forward full page)
* 2 - `ctrl-d` - move forward 1/2 a screen (down half page)
* 2 - `ctrl-u` - move back 1/2 a screen (up half page)
* 4 - `ctrl-o` - retrace previous cursor position
* 4 - `ctrl-i` - retrace next cursor position

> Tip: Prefix a cursor movement command with a number to repeat it. For example, 4j moves down 4 lines.

## Insert mode, inserting/appending text

* 0 - `i` - insert before the cursor
* 1 - `I` - insert at the beginning of the line
* 1 - `a` - insert (append) after the cursor
* 1 - `A` - insert (append) at the end of the line
* 1 - `o` - append (open) a new line below the current line
* 2 - `O` - append (open) a new line above the current line
* 3 - `ea` - insert (append) at the end of the word (so they can be chained with moves)
* 0 - `Esc` - exit insert mode
* 4 - `gi` - go to the last place where insert mode was finished
* 6 - `ctrl-r REG` - insert the contents of `REG` register in insert mode.

## Editing

* 2 - `r` - replace a single character
* 3 - `R` - start replace mode, similar to insert, but overwrites the characters underneath
* 3 - `J` - join line below to the current one with one space in between
* 4 - `gJ` - join line below to the current one without space in between
* 6 - `gwip` - reflow paragraph
* 2 - `cc` - change (replace) entire line
* 2 - `C`, `c$` - change (replace) to the end of the line
* 3 - `ciw` - change (replace) entire word
* 2 - `cw` - change (replace) to the end of the word
* 5 - `c/hello` - change (replace) until next occurrance of "hello"
* 3 - `s` - delete character and substitute text
* 4 - `xp` - transpose two letters (delete and paste)
* 1 - `u` - undo
* 2 - `:u` - undo in command mode
* 3 - `U` - undo all latest changes on one line
* 2 - `ctrl-r` - redo
* 3 - `:red` - redo in command mode
* 2 - `.` - repeat last command
* 4 - `ctrl-a` - increase a number
* 4 - `ctrl-x` - decrease a number (practice: 4)
* 5 - `gu + movement` - make `movement` lowercase
* 5 - `gU + movement` - make `movement` uppercase
* 5 - `g~ + movement` - toggle case of `movement`
* 7 - `g+` - undo branch forward
* 7 - `g-` - undo branch backward
* 8 - `ea 4h` - undo changes in the last 4 hours
* 8 - `ea 2f` - undo last 2 file states (last 2 buffer writes)
* 8 - `lat 8m` - redo changes in last 8 minutes

## Marking text (visual mode)

* 2 - `v` - start visual mode. (you can mark text, then do a command (like y-yank))
* 2 - `V` - start linewise visual mode
* 4 - `o` - move to other end of marked area
* 3 - `ctrl-v` - start visual block mode
* 5 - `O` - move to other corner of block
* 3 - `aw` - mark a word
* 4 - `as` - mark a sentence
* 4 - `ap` - mark a paragraph
* 4 - `ab` - mark a block with ()
* 4 - `aB` - mark a block with {}
* 4 - `ib` - mark inner block with ()
* 4 - `iB` - mark inner block with {}
* 2 - `Esc` - exit visual mode

> Practice here to select inner block (like this)
> Or {an inner block} of this.

## Visual commands

* 3 - `>` - shift text right
* 3 - `<` - shift text left
* 3 - `y` - yank (copy) marked text
* 3 - `d` - delete marked text
* 4 - `~` - switch case

## Registers

* 5 - `:reg` - show registers content (can append selectors of which registers to show)
* 6 - `"xy` - yank into register `x`
* 6 - `"xp` - paste contents of register `x`
* 7 - `"Xp` - append contents to register `x`

> Tip: Registers are being stored in ~/.viminfo, and will be loaded again on next restart of vim.
> Tip: Register 0 always contains the value of the last yank command.

## Marks

* 4 - `:marks` - list of marks
* 5 - `ma` - set current position for mark `a`
* 5 - `` `a `` - jump to position of mark `a`
* 5 - `'a` - jump to the first non-blank character in the line of mark `a`
* 6 - `` y`a `` - yank text to position of mark `a`
* 7 - `:delm <pattern>` - delete marks. `<pattern>` can be 1 lowercase letter, any number of characters, range of letters or numbers

## Macros

* 7 - `qa` - record macro `a` (it empties that register and appends the keystrokes to it)
* 7 - `q` - stop recording macro
* 7 - `@a` - run macro `a`
* 8 - `@@` - rerun last run macro

## Cut and paste

* 1 - `yy` - yank (copy) a line
* 2 - `2yy` - yank (copy) `2` lines
* 2 - `yw` - yank (copy) the characters of the word from the cursor position to the start of the next word
* 2 - `y$` - yank (copy) to end of line
* 1 - `p` - put (paste) the clipboard after cursor
* 2 - `P` - put (paste) before cursor
* 1 - `dd` - delete (cut) a line
* 2 - `2dd` - delete (cut) `2` lines
* 3 - `diw` - delete (cut) the characters of the whole word
* 2 - `dw` - delete (cut) the characters of the word from the cursor position to the start of the next word
* 2 - `D`, `d$` - delete (cut) to the end of the line
* 1 - `x` - delete (cut) character
* 5 - `viwp` - replace (paste) content of the last used register with the word under the cursor
* 6 - `"/p` - paste the last search
* `":p" - paste the last command

## Exiting

* 0 - `:w` - write (save) the file, but don't exit
* 6 - `:w !sudo tee %` - write out the current file using sudo
* 0 - `:wq`, `:x`, `ZZ` - write (save) and quit
* 0 - `:q` - quit (fails if there are unsaved changes)
* 0 - `:q!`, `ZQ` - quit and throw away unsaved changes
* 4 - `:wqa` - write (save) and quit on all tabs
* 5 - `ctrl-z`, `:st`, `:stop` - suspend vim, start up again with `fg` command (optionally `fg %jobnumber` if multiple jobs are selected). Check running suspended jobs with `jobs` command

## Search and replace

* 2 - `/pattern` - search for `pattern`
* 2 - `?pattern` - search backward for `pattern`
* 6 - `/\vpattern` - 'very magic' `pattern`: non-alphanumeric characters are interpreted as special regex symbols (no escaping needed)
* 2 - `n` - repeat search in same direction
* 2 - `N` - repeat search in opposite direction
* 4 - `ggn` - go to first match (assuming forward search)
* 4 - `GN` - go to last match (assuming forward search)
* 3 - `:%s/old/new/g` - replace all `old` with `new` throughout file
* 4 - `:%s/old/new/gc` - replace all `old` with `new` throughout file with confirmations
* 3 - `:noh` - remove highlighting of search matches
* 3 - `*` - start a search forward with the whole current word under the cursor
* 3 - `#` - start a search backward with the current word under the cursor
* 4 - `g*` - start a search with the word under the cursor but find occurrences that has more content in it. e.g: `rain` finds `rainbow`
* 4 - `g#` - start a search backward with the word under the cursor but find occurrences that has more content in it. e.g: `rain` finds `rainbow`

## Search in multiple files

* 6 - `:vimgrep /pattern/ {file}` - search for `/pattern/` in multiple `{file}`s

> e.g.: `vimgrep /foo/ **/*`

* 6 - `:cn` - jump to the next match
* 6 - `:cp` - jump to the previous match
* 6 - `:copen` - open a window containing the list of matches

## Vim for programmers

* 5 - `gd` - go to local declaration
* 5 - `gD` - go to global declaration

## Working with multiple files

* 3 - `:e` - reload current file
* 4 - `:e file` - edit a `file` in a new buffer
* 5 - `:r file`, `:read file` - insert a `file` into the current location
* 5 - `:0r file`, `:0read file` - insert a `file` before the first line
* 6 - `:r !{cmd}` - execute `{cmd}` and insert its standard output below the cursor
* 4 - `:bnext`, `:bn` - go to the next buffer
* 4 - `:bprev`, `:bp` - go to the previous buffer
* 4 - `:bd` - delete a buffer (close a file)
* 4 - `:ls` - list all open buffers
* 4 - `:sp file` - open a `file` in a new buffer and split window
* 4 - `:vsp file` - open a `file` in a new buffer and vertically split window
* 5 - `:sv file`, `:sview file` - open a `file` in a new buffer, but readonly
* 5 - `:vert sv file` - vertically open a `file` as readonly as a split

## Split window

* 4 - `ctrl-ws` - split window horizontally
* 4 - `ctrl-wv` - split window vertically
* 4 - `ctrl-ww` - switch windows (cycle)
* 4 - `ctrl-wq` - quit a window
* 5 - `ctrl-wr` - rotate two windows (can not do it if the other one is splitted)
* 4 - `ctrl-wh` - move cursor to the left window (vertical split)
* 4 - `ctrl-wl` - move cursor to the right window (vertical split)
* 4 - `ctrl-wj` - move cursor to the window below (horizontal split)
* 4 - `ctrl-wk` - move cursor to the window above (horizontal split)
* 5 - `ctrl-w_` - maximize current window vertically
* 5 - `ctrl-w|` - maximize current window horizontally
* 5 - `ctrl-w=` - make all equal size vertically
* 6 - `:res +/-num`, `numctrl-w+/-` - horizontally resize by `+/-num` of lines or columns
* 6 - `:vert res +/-num`, `numctrl-w</>` - vertically resize by `+/-num` of lines or columns

## Tabs

Tabs should be imagined as layouts. They can show different window arrangements of any buffers.

* 4 - `:tabe file`, `:tabnew`, `:tabnew file` - open a `file` in a new tab
* 5 - `ctrl-wT` - move the current split window into its own tab
* 4 - `gt`, `:tabnext`, `:tabn` - move to the next tab
* 4 - `gT`, `:tabprev`, `:tabp` - move to the previous tab
* 5 - `NUMgt` - move to tab number `NUM`
* 5 - `:tabm NUM`, `:tabmove NUM` - move current tab to the `NUM`th position (indexed from 0)
* 4 - `:tabc`, `:tabclose` - close the current tab and all its windows
* 5 - `:tabo`, `:tabonly` - close all tabs except for the current one
* 6 - `:tabdo command` - run the `command` on all tabs (e.g. `command` = q - closes all opened tabs)

## Extra

* 3 - `ctrl-n` - in insert mode opens up autocomplete
* 4 - `ctrl-g` - show line info
* 5 - `ctrl-o` - in insert mode after this key combo, you can use a command from normal mode, and immediately switch back to the starting mode
* 5 - `:term` - open terminal as a horizontal split buffer.

## Open vim specially

* 3 - `vim file1 file2` - open multiple files (`file1` `file2`) as buffer
* 4 - `vim -p file1 file2` - open multiple files (`file1` `file2`) as tabs
* 4 - `vim -o file1 file2` - open multiple files (`file1` `file2`) as horizontal split
* 4 - `vim -O file1 file2` - open multiple files (`file1` `file2`) as vertical split
* 4 - `vim file +number` - open `file` at linenumber `number`

## Vim sessions

* 6 - `:mks workproject.vim`, `:mksession workproject.vim` - Your current session of open tabs will be stored in a file `workproject.vim`
* 6 - `vim -S workproject.vim` - load up vim with a session called `workproject.vim`
* 6 - `:source workproject.vim` - load vim session to an opened vim called `workproject.vim`
* 7 - `:mks! workproject.vim` - save changed session tabs while you are in the session called `workproject.vim`

> If the filename is omitted then `Session.vim` name will be used

## Command line history

* 5 - `q:` - show prev commands. Close with Ctrl+c
* 5 - `q/` - show prev searches. Close with Ctrl+c
* 4 - `:` - type in any word and press up. It will look for the prev command that started like that

## Folding

* 5 - `za` - toggle folding
* 6 - `:set foldcolumn=NUM` - visualize folds. show `NUM` lines of nested folds per line
* 6 - `zfip` - fold the current paragraph
* 7 - `zf/string` - fold until next occurrance of `string`
* 6 - `zd` - delete fold
* 6 - `zE` - delete all folds
* 7 - `zf20j` - fold the next `20` lines
* 7 - `` zf`a `` - fold until wherever mark `a` is in the document
* 5 - `zR` - open all folds
* 5 - `zM` - close all folds
* 7 - `:mkview` - save folding state
* 7 - `:loadview` - load prev folding state

## Tips and tricks

* 8 - `xi()<esc>P` - wrap brackets around visually selected text (select text in visual mode first)
* 8 - `y/ctrl-r"` - search for visually selected text (select text in visual mode first)
* 7 - `:w !diff % -` - show the diffs with `diff` command since last save. (It saves the output to stdin and loads the differences between the current filename and standard input)
* 8 - `:g/pattern/norm @o` - run the previously recorded `o` macro on all lines that match `pattern`
