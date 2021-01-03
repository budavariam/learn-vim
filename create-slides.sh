#!/bin/bash

echo "..prepare cleanup on finish"
trap 'rm ./style.css ./tmp.md' EXIT

echo "..create front matter for slides"
header=$(cat << 'END'
---
theme: "white"
transition: "none"
highlightTheme: "monokai"
customTheme: "style"
slideNumber: false
center: false
title: "Vim cheatsheet"
---

END
)

echo "..create style overrites"
cat > style.css << 'END'
.reveal {
    font-size: 12px;
}

.reveal code {
    color: red;
}

section {
    overflow-y: scroll;
    max-height: 100vh;
}
END

echo "..create slides base"
cat <(echo "$header") ./vim-cheatsheet.md | sed -e 's/^##/---\n\n##/' > tmp.md

echo "..serve slides"
revealjs-cli -s -o ./tmp.md