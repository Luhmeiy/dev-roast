# Syntax Highlighting for Code Editor - Specification

## 1. Research Summary

### 1.1 Ray.so Analysis

Ray.so (https://github.com/raycast/ray-so) uses Monaco Editor (the same engine that powers VS Code) for their code editor. Key findings:

- **Framework**: Built with Next.js + TypeScript
- **Editor**: Uses Monaco Editor directly for syntax highlighting
- **Language Detection**: Monaco has built-in language detection based on file extension/URI
- **Features**: Full VS Code editing experience including IntelliSense, line numbers, minimap

### 1.2 Alternative Options Researched

| Option | Bundle Size | Language Support | Auto-Detection | Best For |
|--------|-------------|-------------------|----------------|----------|
| **Monaco Editor** | 5-10MB | 60+ built-in | Via file URI | Full IDE features |
| **CodeMirror 6** | ~300KB core | 100+ (plugins) | Manual + plugins | Lightweight, extensible |
| **highlight.js** | ~30KB core | 192 languages | Built-in | Presentation, not editing |
| **PrismJS** | ~20KB core | ~250 languages | Limited | Simple highlighting |
| **Ace Editor** | ~500KB | 180+ languages | Manual | Balanced option |

### 1.3 Recommended Approach

**Recommended: highlight.js + react-simple-code-editor**

Reasons:
1. **Lightweight** - Core ~30KB vs Monaco's 5-10MB
2. **Just Highlighting** - No editor features, perfect for your use case
3. **Auto-Detection Built-in** - `highlightAuto()` detects language from content
4. **192 Languages** - More than Monaco's 60+
5. **Simple Integration** - Replace textarea with highlighted overlay

**Alternative if you need full editor later**: Monaco Editor via `@monaco-editor/react`

### 1.4 Language Detection Options

**highlight.js** - Use `highlightAuto()` for content-based detection (primary approach)

---

## 2. Feature Specification

### 2.1 Core Requirements

1. **Syntax Highlighting** - Apply proper colors based on language
2. **Auto-Detection** - Guess programming language from pasted code
3. **Manual Selection** - Allow users to explicitly select language
4. **Language Switcher UI** - Dropdown or selector to change language

### 2.2 User Flow

```
User pastes code → System detects language → Applies highlighting
                                              ↓
                              If detection fails → Show manual selector
```

### 2.3 Language Detection Strategy

**Tiered Approach:**
1. **File Extension Detection** - If user pastes content with known extension patterns
2. **Content Heuristics** - Use highlight.js `highlightAuto()` for code analysis
3. **Default Fallback** - Plain text if detection confidence is low

### 2.4 Supported Languages (Initial)

- JavaScript / TypeScript
- Python
- HTML / CSS
- JSON
- Rust
- Go
- Java
- C / C++
- Ruby
- PHP
- SQL
- Markdown
- Shell / Bash

### 2.5 UI Components

1. **Language Selector** - Dropdown in editor toolbar (macOS-style window controls area)
2. **Status Indicator** - Show detected language name
3. **Auto/Manual Toggle** - Option to disable auto-detection

---

## 3. Implementation Notes

### 3.1 Integration with Existing Code

The current `CodeEditor` component uses a simple textarea. Migration path:
1. Replace `<textarea>` with `react-simple-code-editor`
2. Add `highlight.js` for language detection and highlighting
3. Add language selector in the toolbar area (line 13-18)
4. Wire up language detection on value change
5. Show highlighted code as overlay behind transparent textarea

### 3.2 Key Packages

```bash
npm install react-simple-code-editor highlight.js
# react-simple-code-editor: Overlay editor that shows highlighted code behind transparent textarea
# highlight.js: Syntax highlighting + auto language detection
```

---

## 4. Open Questions (Answered)

- [x] Should we support all Monaco languages or limit to popular ones? **→ All languages**
- [x] How should we handle detection confidence? (show confidence indicator?) **→ No indicator needed**
- [x] Should we persist language preference in localStorage? **→ Yes, persist user selection**
- [x] Do we need to support diff editor mode later? **→ May add later, ignore for now**
- [x] What theming options should we expose? (only dark, or light too?) **→ Dark only for now**

---

## 5. Tasks / Todos

- [ ] Install `react-simple-code-editor` and `highlight.js` packages
- [ ] Create `CodeEditorWithHighlight` component (or update existing)
- [ ] Implement language detection using highlight.js `highlightAuto()`
- [ ] Create language selector dropdown UI component
- [ ] Wire up auto-detection on paste/input
- [ ] Style the editor to match current theme (dark, monospace)
- [ ] Test with various programming languages
- [ ] Verify performance with large code snippets