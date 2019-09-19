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
* [Tips and tricks](#tips-and-tricks)

* multiple sources, like this [great cheatsheet](https://vim.rtorr.com/)

## Global

* `:help keyword` - open help for keyword
* `:saveas file` - save file as
* `:close` - close current pane
* `K` - open man page for word under the cursor
* `gf` - open file under cursor

## Cursor movement

* `h` - move cursor left
* `j` - move cursor down
* `k` - move cursor up
* `l` - move cursor right
* `H` - move to top of screen
* `M` - move to middle of screen
* `L` - move to bottom of screen
* `w` - jump forwards to the start of a word
* `W` - jump forwards to the start of a word (words can contain punctuation)
* `e` - jump forwards to the end of a word
* `E` - jump forwards to the end of a word (words can contain punctuation)
* `ge` - jump backwards to the end of a word
* `gE` - jump backwards to the end of a word (words can contain punctuation)
* `b` - jump backwards to the start of a word
* `B` - jump backwards to the start of a word (words can contain punctuation)
* `%` - move to matching character (default supported pairs: '()', '{}', '[]'; use `:h matchpairs` in vim for more info)
* `0` - jump to the start of the line
* `^` - jump to the first non-blank character of the line
* `$` - jump to the end of the line
* `g_` - jump to the last non-blank character of the line
* `gg` - go to the first line of the document
* `G` - go to the last line of the document
* `5G` - go to line 5
* `fx` - jump to next occurrence of character x in this line
* `tx` - jump to before next occurrence of character x in this line
* `Fx` - jump to previous occurence of character x in this line
* `Tx` - jump to after previous occurence of character x in this line
* `;` - repeat previous f, t, F or T movement
* `,` - repeat previous f, t, F or T movement, backwards
* `}` - jump to next paragraph (or function/block, when editing code)
* `{` - jump to previous paragraph (or function/block, when editing code)
* `zz` - cursor on screen to the center
* `zt` - cursor on screen to top
* `zb` - cursor on screen to bottom
* `Ctrl + e` - move screen down one line (without moving cursor), same as `+` symbol
* `Ctrl + y` - move screen up one line (without moving cursor), same as `-` symbol
* `Ctrl + b` - move back one full screen (back full page)
* `Ctrl + f` - move forward one full screen (forward full page)
* `Ctrl + d` - move forward 1/2 a screen (down half page)
* `Ctrl + u` - move back 1/2 a screen (up half page)
* `Ctrl + o` - retrace previous cursor position`
* `Ctrl + i` - retrace next cursor position`

> Tip Prefix a cursor movement command with a number to repeat it. For example, 4j moves down 4 lines.

## Insert mode, inserting/appending text

* `i` - insert before the cursor
* `I` - insert at the beginning of the line
* `a` - insert (append) after the cursor
* `A` - insert (append) at the end of the line
* `o` - append (open) a new line below the current line
* `O` - append (open) a new line above the current line
* `ea` - insert (append) at the end of the word (they can be chained with moves)
* `Esc` - exit insert mode

## Editing

* `r` - replace a single character
* `R` - start replace mode, similar to insert, but overwrites the characters underneath
* `J` - join line below to the current one with one space in between
* `gJ` - join line below to the current one without space in between
* `gwip` - reflow paragraph
* `cc` - change (replace) entire line
* `C` - change (replace) to the end of the line
* `c$` - change (replace) to the end of the line
* `ciw` - change (replace) entire word
* `cw` - change (replace) to the end of the word
* `s` - delete character and substitute text
* `xp` - transpose two letters (delete and paste)
* `u` - undo
* `Ctrl + r` - redo
* `.` - repeat last command
* `Ctrl + a` - increase a number
* `Ctrl + x` - decrease a number (4)
* `gu` + movement - make it lowercase
* `gU` + movement - make it uppercase
* `g~` + movement - toggle case

## Marking text (visual mode)

* `v` - start visual mode. (you can mark text, then do a command (like y-yank))
* `V` - start linewise visual mode
* `o` - move to other end of marked area
* `Ctrl + v` - start visual block mode
* `O` - move to other corner of block
* `aw` - mark a word
* `ab` - a block with ()
* `aB` - a block with {}
* `ib` - inner block with ()
* `iB` - inner block with {}
* `Esc` - exit visual mode

> Practice here to select inner block (like this )
> Or {an inner block} of this.

## Visual commands

* `>` - shift text right
* `<` - shift text left
* `y` - yank (copy) marked text
* `d` - delete marked text
* `~` - switch case

## Registers

* `:reg` - show registers content (can append selectors of which registers to show)
* `"xy` - yank into register x
* `"xp` - paste contents of register x

> Tip: Registers are being stored in ~/.viminfo, and will be loaded again on next restart of vim.
> Tip: Register 0 contains always the value of the last yank command.

## Marks

* `:marks` - list of marks
* `ma` - set current position for mark A
* ````a``` - jump to position of mark A
* ```y`a``` - yank text to position of mark A
* `:delm <pattern>` - delete marks. Pattern can be 1 lowercase letter, any number of characters, range of letters or numbers

## Macros

* `qa` - record macro a (it empties that register and appends the keystrokes to it)
* `q` - stop recording macro
* `@a` - run macro a
* `@@` - rerun last run macro

## Cut and paste

* `yy` - yank (copy) a line
* `2yy` - yank (copy) 2 lines
* `yw` - yank (copy) the characters of the word from the cursor position to the start of the next word
* `y$` - yank (copy) to end of line
* `p` - put (paste) the clipboard after cursor
* `P` - put (paste) before cursor
* `dd` - delete (cut) a line
* `2dd` - delete (cut) 2 lines
* `dw` - delete (cut) the characters of the word from the cursor position to the start of the next word
* `D` - delete (cut) to the end of the line
* `d$` - delete (cut) to the end of the line
* `x` - delete (cut) character

## Exiting

* `:w` - write (save) the file, but don't exit
* `:w !sudo tee %` - write out the current file using sudo
* `:wq`, `:x`, `ZZ` - write (save) and quit
* `:q` - quit (fails if there are unsaved changes)
* `:q!`, `ZQ` - quit and throw away unsaved changes
* `:wqa` - write (save) and quit on all tabs
* `Ctrl + z` - suspend vim, start up again with `fg` command (optionally `fg %jobnumber` if multiple jobs are selected). Check running suspended jobs with `jobs` command

## Search and replace

* `/pattern` - search for pattern
* `?pattern` - search backward for pattern
* `/\vpattern` - 'very magic' pattern: non-alphanumeric characters are interpreted as special regex symbols (no escaping needed)
* `n` - repeat search in same direction
* `N` - repeat search in opposite direction
* `:%s/old/new/g` - replace all old with new throughout file
* `:%s/old/new/gc` - replace all old with new throughout file with confirmations
* `:noh` - remove highlighting of search matches
* ```*``` - start a search forward with the whole current word under the cursor
* `#` - start a search backwards with the current word under the cursor
* ```g*``` - start a search with the word under the cursor but find occurrances that has more content in it. e.g: `rain` finds `rainbow`
* ```g#``` - same as ```g*``` but backwards

## Search in multiple files

* `:vimgrep /pattern/ {file}` - search for pattern in multiple files

> e.g.:```vimgrep /foo/ **/*```

* `:cn` - jump to the next match
* `:cp` - jump to the previous match
* `:copen` - open a window containing the list of matches

## Vim for programmers

* `gd` - go to local declaration
* `gD` - go to global declaration

## Working with multiple files

* `:e` - reload current file
* `:e file` - edit a file in a new buffer
* `:bnext`, `:bn` - go to the next buffer
* `:bprev`, `:bp` - go to the previous buffer
* `:bd` - delete a buffer (close a file)
* `:ls` - list all open buffers
* `:sp file` - open a file in a new buffer and split window
* `:vsp file` - open a file in a new buffer and vertically split window
* `:sv file` - same as split, but readonly (short for `:sview`)
* `:vert sv file` - vertically open a file as readonly as a split

## Split window

* `Ctrl + ws` - split window horizontally
* `Ctrl + wv` - split window vertically
* `Ctrl + ww` - switch windows (cycle)
* `Ctrl + wq` - quit a window
* `Ctrl + wr` - rotate two windows (can not do it if the other one is splitted)
* `Ctrl + wh` - move cursor to the left window (vertical split)
* `Ctrl + wl` - move cursor to the right window (vertical split)
* `Ctrl + wj` - move cursor to the window below (horizontal split)
* `Ctrl + wk` - move cursor to the window above (horizontal split)
* ```ctrl-w _``` - maximize current window vertically
* `ctrl-w |` - maximize current window horizontally
* `ctrl-w =` - make all equal size
* `:res +/-number` - horizontally resize by number of lines or columns. It can be done one by one with ```Ctrl + w +/-```
* `:vert res +/-number` - vertically resize by number of lines or columns. It can be done one by one with ```Ctrl + w </>```

## Tabs

Tabs should be imagined as layouts. They can show different window arrangements of any buffers.

* `:tabe file`, `:tabnew`, `:tabnew file` - open a file in a new tab
* `Ctrl + wT` - move the current split window into its own tab
* `gt`, `:tabnext`, `:tabn` - move to the next tab
* `gT`, `:tabprev`, `:tabp` - move to the previous tab
* `NUMgt` - move to tab number NUM
* `:tabm NUM` - move current tab to the NUMth position (indexed from 0) (short for tabmove)
* `:tabc` - close the current tab and all its windows (short for tabclose)
* `:tabo` - close all tabs except for the current one (shotr for tabonly)
* `:tabdo command` - run the command on all tabs (e.g. :tabdo q - closes all opened tabs)

## Extra

* `Ctrl + n` - in insert mode opens up autocomplete
* `Ctrl + g` - show line info
* `Ctrl + o` - in Insert mode after this key combo, you can use a command from normal mode, and immediately switch back to the starting mode

## Open vim specially

* `vim file1 file2` - open multiple files as buffer
* `vim -p file1 file2` - open multiple files as tabs
* `vim -o file1 file2` - open multiple files as horizontal split
* `vim -O file1 file2` - open multiple files as vertical split
* `vim file1 +number` - open file at linenumber $number

## Vim sessions

* `:mks header-files-work.vim` - Your current session of open tabs will be stored in a file header-files-work.vim (short for mksession)
* `vim -S header-files-work.vim` - load vim session
* `:source header-files-work.vim` - load vim session to an opened vim
* `:mks! header-files-work.vim` save changed session tabs while you are in the session

> If the filename is omitted then `Session.vim` name will be used

## Command line history

* `q:` - show prev commands. Close with Ctrl+c
* `q/` - show prev searches. Close with Ctrl+c
* `:` - type in any word and press up. It will look for the prev command that started like that

## Tips and tricks

* select text in visual mode then `xi()<esc>P` Wrap brackets around visually selected text

