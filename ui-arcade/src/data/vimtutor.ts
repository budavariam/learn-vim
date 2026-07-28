// ── Types & section metadata ──────────────────────────────────────────────────

import type { ChallengeConfig } from '../engine/types'

export type VimTutorChapter = 1 | 2

export interface VimTutorSection {
  id: string
  title: string
  description: string
}

export interface VimTutorConfig extends ChallengeConfig {
  chapter: VimTutorChapter
  sections: string[] // empty = all sections
}

export const CHAPTER1_SECTIONS: VimTutorSection[] = [
  { id: '1.1', title: 'Lesson 1.1', description: 'Moving cursor, exiting, inserting, appending' },
  { id: '1.2', title: 'Lesson 1.2', description: 'Deletion commands and undo' },
  { id: '1.3', title: 'Lesson 1.3', description: 'Put, replace, and change' },
  { id: '1.4', title: 'Lesson 1.4', description: 'File status, search, and substitute' },
  { id: '1.5', title: 'Lesson 1.5', description: 'External commands and writing files' },
  { id: '1.6', title: 'Lesson 1.6', description: 'Open, append, replace, yank, options' },
  { id: '1.7', title: 'Lesson 1.7', description: 'Help system and command completion' },
]

export const CHAPTER2_SECTIONS: VimTutorSection[] = [
  { id: '2.1', title: 'Lesson 2.1', description: 'Text objects, registers, and marks' },
]

export const SECTIONS_BY_CHAPTER: Record<VimTutorChapter, VimTutorSection[]> = {
  1: CHAPTER1_SECTIONS,
  2: CHAPTER2_SECTIONS,
}

const DIVIDER = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'

/** Return the chapter text filtered to the given section IDs (empty = all). */
export function getFilteredContent(chapter: VimTutorChapter, sections: string[]): string {
  const text = chapter === 1 ? VIMTUTOR_CHAPTER1 : VIMTUTOR_CHAPTER2
  if (sections.length === 0) return text

  const parts = text.split(DIVIDER)
  // parts[0] = intro header, parts[last] may contain "This concludes"
  const intro = parts[0]
  const outro = parts[parts.length - 1]
  const body = parts.slice(1, parts.length - 1)

  const filtered = body.filter(chunk => {
    return sections.some(id => {
      // Match sub-lesson like "Lesson 1.2." and summary like "Lesson 1.2 "
      return new RegExp(`Lesson\\s+${id.replace('.', '\\.')}[. ]`).test(chunk)
    })
  })

  return [intro, ...filtered, outro].join(DIVIDER)
}

// ── Raw chapter content ───────────────────────────────────────────────────────

export const VIMTUTOR_CHAPTER1 = `\
===============================================================================
=    W e l c o m e   t o   t h e   V I M   T u t o r    -    Version 1.7      =
===============================================================================
=\t\t\t       C H A P T E R   ONE\t\t\t      =
===============================================================================

     Vim is a very powerful editor that has many commands, too many to
     explain in a tutor such as this.  This tutor is designed to describe
     enough of the commands that you will be able to easily use Vim as
     an all-purpose editor.
     The approximate time required to complete the tutor is 30 minutes,
     depending upon how much time is spent with experimentation.

     ATTENTION:
     The commands in the lessons will modify the text.  Make a copy of this
     file to practice on (if you started "vimtutor" this is already a copy).

     It is important to remember that this tutor is set up to teach by
     use.  That means that you need to execute the commands to learn them
     properly.  If you only read the text, you will forget the commands!
     Now, make sure that your Caps-Lock key is NOT depressed and press
     the   j   key enough times to move the cursor so that lesson 1.1.1
     completely fills the screen.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\tLesson 1.1.1:  MOVING THE CURSOR


   ** To move the cursor, press the h,j,k,l keys as indicated. **
\t     ^
\t     k\t\t    Hint:  The h key is at the left and moves left.
       < h\t l >\t\t   The l key is at the right and moves right.
\t     j\t\t\t   The j key looks like a down arrow.
\t     v
  1. Move the cursor around the screen until you are comfortable.

  2. Hold down the down key (j) until it repeats.
     Now you know how to move to the next lesson.

  3. Using the down key, move to lesson 1.1.2.

NOTE: If you are ever unsure about something you typed, press <ESC> to place
      you in Normal mode.  Then retype the command you wanted.

NOTE: The cursor keys should also work.  But using hjkl you will be able to
      move around much faster, once you get used to it.  Really!

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t    Lesson 1.1.2: EXITING VIM


  !! NOTE: Before executing any of the steps below, read this entire lesson!!

  1. Press the <ESC> key (to make sure you are in Normal mode).

  2. Type:\t:q! <ENTER>.
     This exits the editor, DISCARDING any changes you have made.

  3. Get back here by executing the command that got you into this tutor. That
     might be:  vimtutor <ENTER>

  4. If you have these steps memorized and are confident, execute steps
     1 through 3 to exit and re-enter the editor.

NOTE:  :q! <ENTER>  discards any changes you made.  In a few lessons you
       will learn how to save the changes to a file.

  5. Move the cursor down to lesson 1.1.3.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.1.3: TEXT EDITING - DELETION


\t\t   ** Press  x  to delete the character under the cursor. **

  1. Move the cursor to the line below marked --->.

  2. To fix the errors, move the cursor until it is on top of the
     character to be deleted.

  3. Press the\tx  key to delete the unwanted character.

  4. Repeat steps 2 through 4 until the sentence is correct.

---> The ccow jumpedd ovverr thhe mooon.

  5. Now that the line is correct, go on to lesson 1.1.4.

NOTE: As you go through this tutor, do not try to memorize, learn by usage.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t      Lesson 1.1.4: TEXT EDITING - INSERTION


\t\t\t** Press  i  to insert text. **

  1. Move the cursor to the first line below marked --->.

  2. To make the first line the same as the second, move the cursor on top
     of the character BEFORE which the text is to be inserted.

  3. Press  i  and type in the necessary additions.

  4. As each error is fixed press <ESC> to return to Normal mode.
     Repeat steps 2 through 4 to correct the sentence.

---> There is text misng this .
---> There is some text missing from this line.

  5. When you are comfortable inserting text move to lesson 1.1.5.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.1.5: TEXT EDITING - APPENDING


\t\t\t** Press  A  to append text. **

  1. Move the cursor to the first line below marked --->.
     It does not matter on what character the cursor is in that line.

  2. Press  A  and type in the necessary additions.

  3. As the text has been appended press <ESC> to return to Normal mode.

  4. Move the cursor to the second line marked ---> and repeat
     steps 2 and 3 to correct this sentence.

---> There is some text missing from th
     There is some text missing from this line.
---> There is also some text miss
     There is also some text missing here.

  5. When you are comfortable appending text move to lesson 1.1.6.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.1.6: EDITING A FILE

\t\t\t    ** Use  :wq  to save a file and exit. **

  !! NOTE: Before executing any of the steps below, read this entire lesson!!

  1.  If you have access to another terminal, do the following there.
      Otherwise, exit this tutor as you did in lesson 1.1.2:  :q!

  2. At the shell prompt type this command:  vim file.txt <ENTER>
     'vim' is the command to start the Vim editor, 'file.txt' is the name of
     the file you wish to edit.  Use the name of a file that you can change.

  3. Insert and delete text as you learned in the previous lessons.

  4. Save the file with changes and exit Vim with:  :wq <ENTER>

  5. If you have quit vimtutor in step 1 restart the vimtutor and move down to
     the following summary.

  6. After reading the above steps and understanding them: do it.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.1 SUMMARY


  1. The cursor is moved using either the arrow keys or the hjkl keys.
\t h (left)\tj (down)       k (up)\t    l (right)

  2. To start Vim from the shell prompt type:  vim FILENAME <ENTER>

  3. To exit Vim type:\t   <ESC>   :q!\t <ENTER>  to trash all changes.
\t     OR type:\t   <ESC>   :wq\t <ENTER>  to save the changes.

  4. To delete the character at the cursor type:  x

  5. To insert or append text type:
\t i   type inserted text   <ESC>\t\tinsert before the cursor
\t A   type appended text   <ESC>         append after the line

NOTE: Pressing <ESC> will place you in Normal mode or will cancel
      an unwanted and partially completed command.

Now continue with lesson 1.2.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\tLesson 1.2.1: DELETION COMMANDS


\t\t\t       ** Type  dw  to delete a word. **

  1. Press  <ESC>  to make sure you are in Normal mode.

  2. Move the cursor to the line below marked --->.

  3. Move the cursor to the beginning of a word that needs to be deleted.

  4. Type   dw\t to make the word disappear.

  NOTE: The letter  d  will appear on the last line of the screen as you type
\tit.  Vim is waiting for you to type  w .  If you see another character
\tthan  d  you typed something wrong; press  <ESC>  and start over.

---> There are a some words fun that don't belong paper in this sentence.

  5. Repeat steps 3 and 4 until the sentence is correct and go to lesson 1.2.2.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t      Lesson 1.2.2: MORE DELETION COMMANDS


\t\t   ** Type  d$\tto delete to the end of the line. **

  1. Press  <ESC>  to make sure you are in Normal mode.

  2. Move the cursor to the line below marked --->.

  3. Move the cursor to the end of the correct line (AFTER the first . ).

  4. Type    d$    to delete to the end of the line.

---> Somebody typed the end of this line twice. end of this line twice.


  5. Move on to lesson 1.2.3 to understand what is happening.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.2.3: ON OPERATORS AND MOTIONS


  Many commands that change text are made from an operator and a motion.
  The format for a delete command with the  d  delete operator is as follows:

  \td   motion

  Where:
    d      - is the delete operator.
    motion - is what the operator will operate on (listed below).

  A short list of motions:
    w - until the start of the next word, EXCLUDING its first character.
    e - to the end of the current word, INCLUDING the last character.
    $ - to the end of the line, INCLUDING the last character.

  Thus typing  de  will delete from the cursor to the end of the word.

NOTE:  Pressing just the motion while in Normal mode without an operator will
       move the cursor as specified.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.2.4: USING A COUNT FOR A MOTION


\t   ** Typing a number before a motion repeats it that many times. **

  1. Move the cursor to the start of the line below marked --->.

  2. Type  2w  to move the cursor two words forward.

  3. Type  3e  to move the cursor to the end of the third word forward.

  4. Type  0  (zero) to move to the start of the line.

  5. Repeat steps 2 and 3 with different numbers.

---> This is just a line with words you can move around in.

  6. Move on to lesson 1.2.5.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t     Lesson 1.2.5: USING A COUNT TO DELETE MORE


\t\t   ** Typing a number with an operator repeats it that many times. **

  In the combination of the delete operator and a motion mentioned above you
  insert a count before the motion to delete more:
\t d   number   motion

  1. Move the cursor to the first UPPER CASE word in the line marked --->.

  2. Type  d2w  to delete the two UPPER CASE words.

  3. Repeat steps 1 and 2 with a different count to delete the consecutive
     UPPER CASE words with one command.

--->  this ABC DE line FGHI JK LMN OP of words is Q RS TUV cleaned up.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t Lesson 1.2.6: OPERATING ON LINES


\t\t\t   ** Type  dd   to delete a whole line. **

  Due to the frequency of whole line deletion, the designers of Vi decided
  it would be easier to simply type two d's to delete a line.

  1. Move the cursor to the second line in the phrase below.
  2. Type  dd  to delete the line.
  3. Now move to the fourth line.
  4. Type   2dd   to delete two lines.

--->  1)  Roses are red,
--->  2)  Mud is fun,
--->  3)  Violets are blue,
--->  4)  I have a car,
--->  5)  Clocks tell time,
--->  6)  Sugar is sweet
--->  7)  And so are you.

Doubling to operate on a line also works for operators mentioned below.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t Lesson 1.2.7: THE UNDO COMMAND


\t\t   ** Press  u\tto undo the last commands,   U  to fix a whole line. **

  1. Move the cursor to the line below marked ---> and place it on the
     first error.
  2. Type  x  to delete the first unwanted character.
  3. Now type  u  to undo the last command executed.
  4. This time fix all the errors on the line using the  x  command.
  5. Now type a capital  U  to return the line to its original state.
  6. Now type  u  a few times to undo the  U  and preceding commands.
  7. Now type CTRL-R (keeping CTRL key pressed while hitting R) a few times
     to redo the commands (undo the undos).

---> Fiix the errors oon thhis line and reeplace them witth undo.

  8. These are very useful commands.  Now move on to the lesson 1.2 Summary.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.2 SUMMARY

  1. To delete from the cursor up to the next word type:        dw
  2. To delete from the cursor up to the end of the word type:  de
  3. To delete from the cursor to the end of a line type:       d$
  4. To delete a whole line type:                               dd

  5. To repeat a motion prepend it with a number:   2w
  6. The format for a change command is:
               operator   [number]   motion
     where:
       operator - is what to do, such as  d  for delete
       [number] - is an optional count to repeat the motion
       motion   - moves over the text to operate on, such as  w (word),
\t\t  e (end of word),  $ (end of the line), etc.

  7. To move to the start of the line use a zero:  0

  8. To undo previous actions, type:           u  (lowercase u)
     To undo all the changes on a line, type:  U  (capital U)
     To undo the undos, type:                  CTRL-R

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t Lesson 1.3.1: THE PUT COMMAND


\t       ** Type\tp  to put previously deleted text after the cursor. **

  1. Move the cursor to the first line below marked --->.

  2. Type  dd  to delete the line and store it in a Vim register.

  3. Move the cursor to the c) line, ABOVE where the deleted line should go.

  4. Type   p   to put the line below the cursor.

  5. Repeat steps 2 through 4 to put all the lines in correct order.

---> d) Can you learn too?
---> b) Violets are blue,
---> c) Intelligence is learned,
---> a) Roses are red,



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t       Lesson 1.3.2: THE REPLACE COMMAND


\t       ** Type  rx  to replace the character at the cursor with  x . **

  1. Move the cursor to the first line below marked --->.

  2. Move the cursor so that it is on top of the first error.

  3. Type   r\tand then the character which should be there.

  4. Repeat steps 2 and 3 until the first line is equal to the second one.

--->  Whan this lime was tuoed in, someone presswd some wrojg keys!
--->  When this line was typed in, someone pressed some wrong keys!

  5. Now move on to lesson 1.3.3.

NOTE: Remember that you should be learning by doing, not memorization.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\tLesson 1.3.3: THE CHANGE OPERATOR


\t\t   ** To change until the end of a word, type  ce . **

  1. Move the cursor to the first line below marked --->.

  2. Place the cursor on the  u  in  lubw.

  3. Type  ce  and the correct word (in this case, type  ine ).

  4. Press <ESC> and move to the next character that needs to be changed.

  5. Repeat steps 3 and 4 until the first sentence is the same as the second.

---> This lubw has a few wptfd that mrrf changing usf the change operator.
---> This line has a few words that need changing using the change operator.

Notice that  ce  deletes the word and places you in Insert mode.
             cc  does the same for the whole line.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t       Lesson 1.3.4: MORE CHANGES USING c


\t     ** The change operator is used with the same motions as delete. **

  1. The change operator works in the same way as delete.  The format is:

         c    [number]   motion

  2. The motions are the same, such as   w (word) and  $ (end of line).

  3. Move the cursor to the first line below marked --->.

  4. Move the cursor to the first error.

  5. Type  c$  and type the rest of the line like the second and press <ESC>.

---> The end of this line needs some help to make it like the second.
---> The end of this line needs to be corrected using the  c$  command.

NOTE:  You can use the Backspace key to correct mistakes while typing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.3 SUMMARY


  1. To put back text that has just been deleted, type   p .  This puts the
     deleted text AFTER the cursor (if a line was deleted it will go on the
     line below the cursor).

  2. To replace the character under the cursor, type   r   and then the
     character you want to have there.

  3. The change operator allows you to change from the cursor to where the
     motion takes you.  eg. Type  ce  to change from the cursor to the end of
     the word,  c$  to change to the end of a line.

  4. The format for change is:

\t c   [number]   motion

Now go on to the next lesson.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t  Lesson 1.4.1: CURSOR LOCATION AND FILE STATUS

  ** Type CTRL-G to show your location in the file and the file status.
     Type  G  to move to a line in the file. **

  NOTE: Read this entire lesson before executing any of the steps!!

  1. Hold down the Ctrl key and press  g .  We call this CTRL-G.
     A message will appear at the bottom of the page with the filename and the
     position in the file.  Remember the line number for Step 3.

NOTE:  You may see the cursor position in the lower right corner of the screen
       This happens when the 'ruler' option is set (see  :help 'ruler'  )

  2. Press  G  to move you to the bottom of the file.
     Type  gg  to move you to the start of the file.

  3. Type the number of the line you were on and then  G .  This will
     return you to the line you were on when you first pressed CTRL-G.

  4. If you feel confident to do this, execute steps 1 through 3.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\tLesson 1.4.2: THE SEARCH COMMAND


\t     ** Type  /  followed by a phrase to search for the phrase. **

  1. In Normal mode type the  /  character.  Notice that it and the cursor
     appear at the bottom of the screen as with the  :\tcommand.

  2. Now type 'errroor' <ENTER>.  This is the word you want to search for.

  3. To search for the same phrase again, simply type  n .
     To search for the same phrase in the opposite direction, type  N .

  4. To search for a phrase in the backward direction, use  ?  instead of  / .

  5. To go back to where you came from press  CTRL-O  (Keep Ctrl down while
     pressing the letter o).  Repeat to go back further.  CTRL-I goes forward.

--->  "errroor" is not the way to spell error;  errroor is an error.
NOTE: When the search reaches the end of the file it will continue at the
      start, unless the 'wrapscan' option has been reset.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t   Lesson 1.4.3: MATCHING PARENTHESES SEARCH


\t\t      ** Type  %  to find a matching ),], or } . **

  1. Place the cursor on any (, [, or { in the line below marked --->.

  2. Now type the  %  character.

  3. The cursor will move to the matching parenthesis or bracket.

  4. Type  %  to move the cursor to the other matching bracket.

  5. Move the cursor to another (,),[,],{ or } and see what  %  does.

---> This ( is a test line with ('s, ['s ] and {'s } in it. ))


NOTE: This is very useful in debugging a program with unmatched parentheses!



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t      Lesson 1.4.4: THE SUBSTITUTE COMMAND


\t\t** Type  :s/old/new/g  to substitute 'new' for 'old'. **

  1. Move the cursor to the line below marked --->.

  2. Type  :s/thee/the <ENTER>  .  Note that this command only changes the
     first occurrence of "thee" in the line.

  3. Now type  :s/thee/the/g .  Adding the  g  flag means to substitute
     globally in the line, change all occurrences of "thee" in the line.

---> thee best time to see thee flowers is in thee spring.

  4. To change every occurrence of a character string between two lines,
     type   :#,#s/old/new/g    where #,# are the line numbers of the range
                               of lines where the substitution is to be done.
     Type   :%s/old/new/g      to change every occurrence in the whole file.
     Type   :%s/old/new/gc     to find every occurrence in the whole file,
     \t\t\t       with a prompt whether to substitute or not.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.4 SUMMARY


  1. CTRL-G  displays your location in the file and the file status.
             G  moves to the end of the file.
     number  G  moves to that line number.
            gg  moves to the first line.

  2. Typing  /\tfollowed by a phrase searches FORWARD for the phrase.
     Typing  ?\tfollowed by a phrase searches BACKWARD for the phrase.
     After a search type  n  to find the next occurrence in the same direction
     or  N  to search in the opposite direction.
     CTRL-O takes you back to older positions, CTRL-I to newer positions.

  3. Typing  %\twhile the cursor is on a (,),[,],{, or } goes to its match.

  4. To substitute new for the first old in a line type    :s/old/new
     To substitute new for all 'old's on a line type\t   :s/old/new/g
     To substitute phrases between two line #'s type\t   :#,#s/old/new/g
     To substitute all occurrences in the file type\t   :%s/old/new/g
     To ask for confirmation each time add 'c'\t\t   :%s/old/new/gc

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\tLesson 1.5.1: HOW TO EXECUTE AN EXTERNAL COMMAND


\t\t   ** Type  :!\tfollowed by an external command to execute that command. **

  1. Type the familiar command\t:  to set the cursor at the bottom of the
     screen.  This allows you to enter a command-line command.

  2. Now type the  !  (exclamation point) character.  This allows you to
     execute any external shell command.

  3. As an example type   ls   following the ! and then hit <ENTER>.  This
     will show you a listing of your directory, just as if you were at the
     shell prompt.  Or use  :!dir  if ls doesn't work.

NOTE:  It is possible to execute any external command this way, also with
       arguments.

NOTE:  All  :  commands must be finished by hitting <ENTER>
       From here on we will not always mention it.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t      Lesson 1.5.2: MORE ON WRITING FILES


\t     ** To save the changes made to the text, type  :w FILENAME  **

  1. Type  :!dir  or  :!ls  to get a listing of your directory.
     You already know you must hit <ENTER> after this.

  2. Choose a filename that does not exist yet, such as TEST.

  3. Now type:\t :w TEST   (where TEST is the filename you chose.)

  4. This saves the whole file (the Vim Tutor) under the name TEST.
     To verify this, type    :!dir  or  :!ls   again to see your directory.

NOTE: If you were to exit Vim and start it again with  vim TEST , the file
      would be an exact copy of the tutor when you saved it.

  5. Now remove the file by typing (Windows):   :!del TEST
\t\t\t\tor (Unix):\t:!rm TEST


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t    Lesson 1.5.3: SELECTING TEXT TO WRITE


\t\t** To save part of the file, type  v  motion  :w FILENAME **

  1. Move the cursor to this line.

  2. Press  v  and move the cursor to the fifth item below.  Notice that the
     text is highlighted.

  3. Press the  :  character.  At the bottom of the screen  :'<,'> will appear.

  4. Type  w TEST  , where TEST is a filename that does not exist yet.  Verify
     that you see  :'<,'>w TEST  before you press <ENTER>.

  5. Vim will write the selected lines to the file TEST.  Use  :!dir  or  :!ls
     to see it.  Do not remove it yet!  We will use it in the next lesson.

NOTE:  Pressing  v  starts Visual selection.  You can move the cursor around
       to make the selection bigger or smaller.  Then you can use an operator
       to do something with the text.  For example,  d  deletes the text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t   Lesson 1.5.4: RETRIEVING AND MERGING FILES


\t       ** To insert the contents of a file, type  :r FILENAME  **

  1. Place the cursor just above this line.

NOTE:  After executing Step 2 you will see text from lesson 1.5.3.  Then move
       DOWN to see this lesson again.

  2. Now retrieve your TEST file using the command   :r TEST   where TEST is
     the name of the file you used.
     The file you retrieve is placed below the cursor line.

  3. To verify that a file was retrieved, cursor back and notice that there
     are now two copies of lesson 1.5.3, the original and the file version.

NOTE:  You can also read the output of an external command.  For example,
       :r !ls  reads the output of the ls command and puts it below the
       cursor.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.5 SUMMARY


  1.  :!command  executes an external command.

      Some useful examples are:
\t (Windows)\t  (Unix)
\t  :!dir\t\t   :!ls\t\t   -  shows a directory listing.
\t  :!del FILENAME   :!rm FILENAME   -  removes file FILENAME.

  2.  :w FILENAME  writes the current Vim file to disk with name FILENAME.

  3.  v  motion  :w FILENAME  saves the Visually selected lines in file
      FILENAME.

  4.  :r FILENAME  retrieves disk file FILENAME and puts it below the
      cursor position.

  5.  :r !dir  reads the output of the dir command and puts it below the
      cursor position.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t Lesson 1.6.1: THE OPEN COMMAND


 ** Type  o  to open a line below the cursor and place you in Insert mode. **

  1. Move the cursor to the first line below marked --->.

  2. Type the lowercase letter  o  to open up a line BELOW the cursor and place
     you in Insert mode.

  3. Now type some text and press <ESC> to exit Insert mode.

---> After typing  o  the cursor is placed on the open line in Insert mode.

  4. To open up a line ABOVE the cursor, simply type a capital\tO , rather
     than a lowercase  o.  Try this on the line below.

---> Open up a line above this by typing O while the cursor is on this line.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\tLesson 1.6.2: THE APPEND COMMAND


\t     ** Type  a  to insert text AFTER the cursor. **

  1. Move the cursor to the start of the first line below marked --->.

  2. Press  e  until the cursor is on the end of  li .

  3. Type an  a  (lowercase) to append text AFTER the cursor.

  4. Complete the word like the line below it.  Press <ESC> to exit Insert
     mode.

  5. Use  e  to move to the next incomplete word and repeat steps 3 and 4.

---> This li will allow you to pract appendi text to a line.
---> This line will allow you to practice appending text to a line.

NOTE:  a, i and A all go to the same Insert mode, the only difference is where
       the characters are inserted.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t    Lesson 1.6.3: ANOTHER WAY TO REPLACE


\t      ** Type a capital  R  to replace more than one character. **

  1. Move the cursor to the first line below marked --->.  Move the cursor to
     the beginning of the first  xxx .

  2. Now press  R  and type the number below it in the second line, so that it
     replaces the xxx .

  3. Press <ESC> to leave Replace mode.  Notice that the rest of the line
     remains unmodified.

  4. Repeat the steps to replace the remaining xxx.

---> Adding 123 to xxx gives you xxx.
---> Adding 123 to 456 gives you 579.

NOTE:  Replace mode is like Insert mode, but every typed character deletes an
       existing character.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\tLesson 1.6.4: COPY AND PASTE TEXT

\t  ** Use the  y  operator to copy text and  p  to paste it **

  1. Move to the line below marked ---> and place the cursor after "a)".

  2. Start Visual mode with  v  and move the cursor to just before "first".

  3. Type  y  to yank (copy) the highlighted text.

  4. Move the cursor to the end of the next line:  j$

  5. Type  p  to put (paste) the text.  Then type:  a second <ESC> .

  6. Use Visual mode to select " item.", yank it with  y , move to the end of
     the next line with  j$  and put the text there with  p .

--->  a) this is the first item.
      b)

  NOTE: You can also use  y  as an operator:  yw  yanks one word,
        yy  yanks the whole line, then  p  puts that line.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t    Lesson 1.6.5: SET OPTION


\t  ** Set an option so a search or substitute ignores case **

  1. Search for 'ignore' by entering:  /ignore <ENTER>
     Repeat several times by pressing  n .

  2. Set the 'ic' (Ignore case) option by entering:   :set ic

  3. Now search for 'ignore' again by pressing  n
     Notice that Ignore and IGNORE are now also found.

  4. Set the 'hlsearch' and 'incsearch' options:  :set hls is

  5. Now type the search command again and see what happens:  /ignore <ENTER>

  6. To disable ignoring case enter:  :set noic

NOTE:  To remove the highlighting of matches enter:   :nohlsearch
NOTE:  If you want to ignore case for just one search command, use  \\c
       in the phrase:  /ignore\\c <ENTER>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.6 SUMMARY

  1. Type  o  to open a line BELOW the cursor and start Insert mode.
     Type  O  to open a line ABOVE the cursor.

  2. Type  a  to insert text AFTER the cursor.
     Type  A  to insert text after the end of the line.

  3. The  e  command moves to the end of a word.

  4. The  y  operator yanks (copies) text,  p  puts (pastes) it.

  5. Typing a capital  R  enters Replace mode until  <ESC>  is pressed.

  6. Typing ":set xxx" sets the option "xxx".  Some options are:
  \t'ic' 'ignorecase'\tignore upper/lower case when searching
\t'is' 'incsearch'\tshow partial matches for a search phrase
\t'hls' 'hlsearch'\thighlight all matching phrases
     You can either use the long or the short option name.

  7. Prepend "no" to switch an option off:   :set noic

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t       Lesson 1.7.1: GETTING HELP


\t\t\t      ** Use the on-line help system **

  Vim has a comprehensive on-line help system.  To get started, try one of
  these three:
\t- press the <HELP> key (if you have one)
\t- press the <F1> key (if you have one)
\t- type   :help <ENTER>

  Read the text in the help window to find out how the help works.
  Type  CTRL-W CTRL-W   to jump from one window to another.
  Type    :q <ENTER>    to close the help window.

  You can find help on just about any subject, by giving an argument to the
  ":help" command.  Try these (don't forget pressing <ENTER>):

\t:help w
\t:help c_CTRL-D
\t:help insert-index
\t:help user-manual
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t      Lesson 1.7.2: CREATE A STARTUP SCRIPT


\t\t\t\t  ** Enable Vim features **

  Vim has many more features than Vi, but most of them are disabled by
  default.  To start using more features you should create a "vimrc" file.

  1. Start editing the "vimrc" file.  This depends on your system:
\t:e ~/.vimrc\t\tfor Unix
\t:e ~/_vimrc\t\tfor Windows

  2. Now read the example "vimrc" file contents:
\t:r $VIMRUNTIME/vimrc_example.vim

  3. Write the file with:
\t:w

  The next time you start Vim it will use syntax highlighting.
  You can add all your preferred settings to this "vimrc" file.
  For more information type  :help vimrc-intro

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t     Lesson 1.7.3: COMPLETION


\t\t      ** Command line completion with CTRL-D and <TAB> **

  1. Make sure Vim is not in compatible mode:  :set nocp

  2. Look what files exist in the directory:  :!ls   or  :!dir

  3. Type the start of a command:  :e

  4. Press  CTRL-D  and Vim will show a list of commands that start with "e".

  5. Type  d<TAB>  and Vim will complete the command name to ":edit".

  6. Now add a space and the start of an existing file name:  :edit FIL

  7. Press <TAB>.  Vim will complete the name (if it is unique).

NOTE:  Completion works for many commands.  Just try pressing CTRL-D and
       <TAB>.  It is especially useful for  :help .

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\t\t\t\t       Lesson 1.7 SUMMARY


  1. Type  :help  or press <F1> or <HELP>  to open a help window.

  2. Type  :help cmd  to find help on  cmd .

  3. Type  CTRL-W CTRL-W  to jump to another window.

  4. Type  :q  to close the help window.

  5. Create a vimrc startup script to keep your preferred settings.

  6. When typing a  :  command, press CTRL-D to see possible completions.
     Press <TAB> to use one completion.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This concludes Chapter 1 of the Vim Tutor.  Consider continuing with
  Chapter 2 which covers registers, marks and the use of text objects.

  It was intended to give a brief overview of the Vim editor, just enough to
  allow you to use the editor fairly easily. It is far from complete as Vim
  has many many more commands.

  Read the user manual next: ":help user-manual".

  For further reading and studying, this book is recommended:
\tVim - Vi Improved - by Steve Oualline
\tPublisher: New Riders
  The first book completely dedicated to Vim.  Especially useful for beginners.
  There are many examples and pictures.
  See https://iccf-holland.org/click5.html

  This book is older and more about Vi than Vim, but also recommended:
\tLearning the Vi Editor - by Linda Lamb
\tPublisher: O'Reilly & Associates Inc.
  It is a good book to get to know almost anything you want to do with Vi.
  The sixth edition also includes information on Vim.

  This tutorial was written by Michael C. Pierce and Robert K. Ware,
  Colorado School of Mines using ideas supplied by Charles Smith,
  Colorado State University.  E-mail: bware@mines.colorado.edu.

  Modified for Vim by Bram Moolenaar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

export const VIMTUTOR_CHAPTER2 = `\
===============================================================================
=    W e l c o m e   t o   t h e   V I M   T u t o r    -    Version 1.7      =
===============================================================================
=\t\t\t    C H A P T E R   TWO\t\t\t\t      =
===============================================================================

     Hic Sunt Dracones: if this is your first exposure to vim and you
     intended to avail yourself of the introductory chapter, kindly type
     :q!<ENTER> and run vimtutor for Chapter 1 instead.

     The approximate time required to complete this chapter is 8-10 minutes,
     depending upon how much time is spent with experimentation.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.1: MASTERING TEXT OBJECTS

   ** Operate on logical text blocks with precision using text objects **

  1. Practice word operations:
     - Place cursor on any word in the line below
     - Type  diw  to delete INNER word (word without surrounding space)
     - Type  daw  to delete A WORD (including trailing whitespace)
     - Try with other operators:  ciw  (change),  yiw  (yank),  gqiw  (format)

---> Practice on: "Vim's", (text_object), and 'powerful' words here.

  2. Work with bracketed content:
     - Put cursor inside any () {} [] <> pair below
     - Type  di(  or  dib  (delete inner bracket)
     - Type  da(  or  dab  (delete around brackets)
     - Try same with  i"/a"  for quotes,  it/at  for HTML/XML tags

---> Test cases: {curly}, [square], <angle>, and "quoted" items.

  3. Paragraph and sentence manipulation:
     - Use  dip  to delete inner paragraph (cursor anywhere in paragraph)
     - Use  vap  to visually select entire paragraph
     - Try  das  to delete a sentence (works between .!? punctuation)

  4. Advanced combinations:
     - ciwnew<ESC>    - Change current word to "new"
     - yss"<ESC>      - Wrap entire line in quotes (vim-surround plugin style)
     - gUit           - Uppercase inner HTML tag content
     - va"p           - Select quoted text and paste over it

---> Final exercise: (Modify "this" text) by [applying {various} operations]<

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.2: THE NAMED REGISTERS


         ** Store two yanked words concurrently and then paste them **

  1. Move the cursor to the line below marked --->

  2. Navigate to any point on the word 'Edward' and type   "ayiw

MNEMONIC: into register(") named (a) (y)ank (i)nner (w)ord

  3. Navigate forward to the word 'cookie' (fk or 2fc or $2b or /co<ENTER>)
     and type   "byiw

  4. Navigate to any point on the word 'Vince' and type   ciw<CTRL-R>a<ESC>

MNEMONIC: (c)hange (i)nner (w)ord with <contents of (r)egister> named (a)

  5. Navigate to any point on the word 'cake' and type   ciw<CTRL-R>b<ESC>

--->  a) Edward will henceforth be in charge of the cookie rations
      b) In this capacity, Vince will have sole cake discretionary powers

NOTE: Delete also works into registers, i.e. "sdiw will delete the word under
      the cursor into register s.

REFERENCE: \tRegisters \t:h registers
\t\tNamed Registers :h quotea
\t\tMotion \t\t:h motion.txt<ENTER> /inner<ENTER>
\t\tCTRL-R\t\t:h insert<ENTER> /CTRL-R<ENTER>

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.3: THE EXPRESSION REGISTER


\t     ** Insert the results of calculations on the fly **

  1. Move the cursor to the line below marked --->

  2. Navigate to any point on the supplied number

  3. Type ciw<CTRL-R> followed by  =60*60*24<ENTER>

  4. On the next line, enter insert mode and add today's date with
     <CTRL-R> followed by  =system('date')<ENTER>

NOTE: All calls to system are OS dependent, e.g. on Windows use
      system('date /t')   or  :r!date /t

---> I have forgotten the exact number of seconds in a day, is it 84600?
     Today's date is:

NOTE: the same can be achieved with :pu=system('date')
      or, with fewer keystrokes :r!date

REFERENCE: \tExpression Register \t:h quote=

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.4: THE NUMBERED REGISTERS


\t** Press  yy and dd to witness their effect on the registers **

  1. Move the cursor to the line below marked --->

  2. yank the zeroth line, then inspect registers with :reg<ENTER>

  3. delete line 0. with "cdd, then inspect registers
     (Where do you expect line 0 to be?)

  4. continue deleting each successive line, inspecting :reg as you go

NOTE: You should notice that old full-line deletions move down the list
      as new full-line deletions are added

  5. Now (p)aste the following registers in order; c, 7, 4, 8, 2. i.e. "7p

---> 0. This
     9. wobble
     8. secret
     7. is
     6. on
     5. axis
     4. a
     3. war
     2. message
     1. tribute

NOTE: Whole line deletions (dd) are much longer lived in the numbered registers
      than whole line yanks, or deletions involving smaller movements

REFERENCE: \tNumbered Registers \t:h quote0

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.5: SPECIAL REGISTERS

 ** Use system clipboard and blackhole registers for advanced editing **

 Note: Clipboard use requires X11/Wayland libraries on Linux systems AND
       a Vim built with "+clipboard" (usually a Huge build). Check with
       ":version"  and ":echo has('clipboard_working')"

  1. Clipboard registers  +  and  *  :
     - "+y  - Yank to system clipboard (e.g. "+yy for current line)
     - "+p  - Paste from system clipboard
     - "* is primary selection on X11 (middle-click), "+ is clipboard

---> Try: "+yy then paste into another application with Ctrl-V or Cmd+V

  2. Blackhole register  _  discards text:
     - "_daw  - Delete word without saving to any register
     - Useful when you don't want to overwrite your default " register
     - Note this is using the "a Word" text object, introduced in a previous
       lession
     - "_dd   - Delete line without saving
     - "_dap  - Delete paragraph without saving
     - Combine with counts: 3"_dw

---> Practice: "_diw on any word to delete it without affecting yank history

  3. Combine with visual selections:
     - Select text with V then "+y
     - To paste from clipboard in insert mode: Ctrl-R +
     - Try opening another application and paste from clipboard

  4. Remember:
     - Clipboard registers work across different Vim instances
     - Clipboard register is not always working
     - Blackhole prevents accidental register overwrites
     - Default " register is still available for normal yank/paste
     - Named registers (a-z) remain private to each Vim session

  5. Clipboard troubleshooting:
     - Check support with :echo has('clipboard_working')
     - 1 means available, 0 means not compiled in
     - On Linux, may need vim-gtk or vim-x11 package
       (check :version output)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1.6: THE BEAUTY OF MARKS

\t           ** Code monkey arithmetic avoidance **

NOTE: a common conundrum when coding is moving around large chunks of code.
      The following technique helps avoid number line calculations associated
      with operations like   "a147d   or   :945,1091d a   or even worse using
      i<CTRL-R> followed by   =1091-945<ENTER>   first

  1. Move the cursor to the line below marked --->

  2. Go to the first line of the function and mark it with   ma

NOTE: exact position on line is NOT important!

  3. Navigate to the end of the line and then the end of the code block
     with   $%

  4. Delete the block into register a with   "ad'a

MNEMONIC: into register(") named (a) put the (d)eletion from the cursor to the
          LINE containing mark(') (a)

  5. Paste the block between BBB and CCC   "ap

NOTE: practice this operation multiple times to become fluent   ma$%"ad'a

---> AAA
     function itGotRealBigRealFast() {
       if ( somethingIsTrue ) {
         doIt()
       }
       // the taxonomy of our function has changed and it
       // no longer makes alphabetical sense in its current position

       // imagine hundreds of lines of code

       // naively you could navigate to the start and end and record or
       // remember each line number
     }
     BBB
     CCC

NOTE: marks and registers do not share a namespace, therefore register a is
      completely independent of mark a. This is not true of registers and
      macros.

REFERENCE: \tMarks \t\t:h marks
\t\tMark Motions \t:h mark-motions  (difference between ' and \`)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

\t\t     Lesson 2.1 SUMMARY


  1. Text objects provide precision editing:
     - iw/aw - inner/around word
     - i[/a[ - inner/around bracket
     - i"/a" - inner/around quotes
     - it/at - inner/around tag
     - ip/ap - inner/around paragraph
     - is/as - inner/around sentence

  2. To store (yank, delete) text into, and retrieve (paste) from, a total of
     26 registers (a-z)
  3. Yank a whole word from anywhere within a word:   yiw
  4. Change a whole word from anywhere within a word:   ciw
  5. Insert text directly from registers in insert mode:   (C-r)a

  6. Insert the results of simple arithmetic operations: <CTRL-R> followed by
     =60*60<ENTER>
     in insert mode
  7. Insert the results of system calls: <CTRL-R> followed by
     =system('ls -1')<ENTER>
     in insert mode

  8. Inspect registers with   :reg
  9. Learn the final destination of whole line deletions: dd in the numbered
     registers, i.e. descending from register 1 - 9.  Appreciate that whole
     line deletions are preserved in the numbered registers longer than any
     other operation
 10. Learn the final destination of all yanks in the numbered registers and
     how ephemeral they are

 11. Place marks from command mode   m[a-zA-Z0-9]
 12. Move line-wise to a mark with   '

 13. Special registers:
     - "+/*  - System clipboard (OS dependent)
     - "_    - Blackhole (discard deleted/yanked text)
     - "=    - Expression register

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This concludes chapter two of the Vim Tutor.  It is a work in progress.

  This chapter was written by Paul D. Parker.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
