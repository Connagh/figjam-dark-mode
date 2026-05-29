# FigJam Dark Mode

A FigJam plugin that simulates a dark mode background on your board.

## How it works

Running the plugin places a large, locked black transparent rectangle behind all your content. Run it again to remove it.

- **Dark mode on:** a dark overlay is added behind everything on the current page.
- **Dark mode off:** run the plugin again and the overlay is removed.

The overlay is locked so you can work on top of it without accidentally selecting or moving it.

## Note on layer order

If any of your content appears behind the dark mode overlay, right-click it and select **Bring to front**. This can happen with content that was added before the plugin was run, or content that was manually moved to the back.

## Removal

Running the plugin again is the easiest way to remove the overlay. Alternatively, you can:

- **Undo** immediately after applying (`Cmd+Z` / `Ctrl+Z`)
- **Unlock and delete** the dark background rectangle in the layers panel
- **Restore** your file via Version History (File → Show Version History)

## Development

```bash
npm install
npm run build   # compile code.ts → code.js once
npm run watch   # recompile on save
```

Import `manifest.json` into Figma Desktop via:
**Right-click canvas → Plugins → Development → Import plugin from manifest…**
