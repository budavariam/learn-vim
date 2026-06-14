#!/usr/bin/env bash
# Run vim-learn unit tests.
# Usage: ./nvim-plugin/run_tests.sh   (from repo root)
#        ./run_tests.sh               (from nvim-plugin/)
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
nvim --headless -u NONE -l "$SCRIPT_DIR/tests/runner.lua"
