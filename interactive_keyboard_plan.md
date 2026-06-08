# Implementation Plan: Interactive Keyboard & Enhanced UI Filters

## Overview
This document outlines the steps to implement a color-coded category system, an interactive virtual keyboard modal, and improved filter selectors for the `ui-cheatsheet` React application.

This plan can be picked up by an LLM agent to systematically implement the requested features.

## 1. Implement Section Color-Coding
**Goal:** Assign a distinct, harmonious color to each Vim category to serve as cognitive landmarks.

**Files to Modify:**
- `ui-cheatsheet/src/data.json` or `ui-cheatsheet/src/App.jsx`
- `ui-cheatsheet/tailwind.config.js` (if custom colors are needed)

**Implementation Steps:**
1. **Define a Color Map:** In `App.jsx` or a new `constants.js`, map each known category (e.g., Navigation, Editing, Visual Mode) to a Tailwind color (e.g., `bg-green-500`, `border-green-500`, etc.).
2. **Update Category Headers:** Modify the `h2` headers in `App.jsx` to replace the hardcoded blue dot (`<span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>`) with the category's mapped color.
3. **Update Table of Contents (ToC):** Pass the color map to `TableOfContents.jsx` and use it to add subtle color dots or tinted text to the ToC items.
4. **Update Cards (Optional but recommended):** Add a very subtle left border or background tint to the individual command cards based on their category.

## 2. Add Interactive Keyboard Modal
**Goal:** Add `react-simple-keyboard` to visually show key mappings and how modifier keys change them.

**Files to Modify:**
- `ui-cheatsheet/package.json`
- `ui-cheatsheet/src/App.jsx`
- New file: `ui-cheatsheet/src/components/KeyboardModal.jsx`

**Implementation Steps:**
1. **Install Dependency:** Run `npm install react-simple-keyboard` in `ui-cheatsheet`.
2. **Create KeyboardModal Component:**
   - Initialize `Keyboard` from `react-simple-keyboard`.
   - Setup state for modifier keys (Shift, Ctrl) and update the `layoutName` accordingly to show alternate keys.
   - Attach a physical keyboard listener (`useEffect` with `keydown`/`keyup`) to automatically depress visual keys when the user presses physical keys.
   - Use the button theme API in `react-simple-keyboard` (`buttonTheme`) to color-code keys based on the Section Color-Coding defined in Step 1.
3. **Map Data to Keyboard:**
   - Parse `preparedData` to build an index mapping physical keys (e.g., `h`, `H`, `{ctrl}d`) to their respective commands.
   - When a key is pressed (virtually or physically), look up the command in the index and display its description in a panel below the keyboard.
4. **Integrate into App.jsx:** Add a "Keyboard View" button next to the "Vimtutor" and "Memorize" buttons. Clicking it opens the `KeyboardModal`.

## 3. Enhance Filter Selectors
**Goal:** Replace or augment the existing filter controls with a cleaner, more robust selector system (allowing users to view *only* specific sections or lists).

**Files to Modify:**
- `ui-cheatsheet/src/App.jsx`

**Implementation Steps:**
1. **Consolidate State:** Review existing states (`showUnknownOnly`, `levelRange`, `search`, `collapsedCategories`). Add a `filterMode` state: `['all', 'learned', 'unlearned', 'memorize']`.
2. **Add Category Filter:** Add an `activeSectionFilter` state (default `null`). When set, only that specific category is rendered.
3. **UI Updates:**
   - Above the search bar or beside it, introduce a set of segmented controls or toggle pills for: `All | Unlearned | Memorize`.
   - Add a dropdown for "Category Filter" to allow isolating a single category (reduces visual overload significantly).
   - Ensure these filters work cohesively with the existing text search.

## Verification
- Test all filters to ensure data is correctly hidden/shown.
- Open the keyboard modal and press physical `Shift` / `Ctrl` keys to verify layout transitions.
- Verify color contrast for category colors in both Light and Dark modes.
