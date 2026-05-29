// FigJam Dark Mode — smart toggle
//
// Running the plugin toggles a dark overlay on the current FigJam page:
//   - If no overlay is present, one is added (dark mode on).
//   - If an overlay is already present, it is removed (dark mode off).
// A native Figma toast confirms the result and tells the user how to reverse it.

const PLUGIN_DATA_KEY = 'figjam-dark-mode';
const OVERLAY_VALUE = 'overlay';
const OVERLAY_NAME = 'Dark Mode Background';

// Visual darkness identical to the original release. The old version stacked
// three pure-black rectangles at 50% opacity, which composite to a single
// black layer at 1 - 0.5^3 = 0.875 opacity.
const OVERLAY_OPACITY = 0.875;

// Baseline overlay size, matching the original 300000 x 300000 rectangle so the
// look is unchanged for typical boards.
const MIN_SIZE = 300000;

// Extra padding around existing content so the dark area extends beyond it.
const CONTENT_PADDING = 10000;

// Identifies overlays this plugin is responsible for. Recognizes both overlays
// tagged by this version and the untagged legacy rectangles from the original
// release, so users upgrading from the old version can finally remove a
// previously "stuck" background.
function isDarkOverlay(node: SceneNode): boolean {
  if (node.getPluginData(PLUGIN_DATA_KEY) === OVERLAY_VALUE) {
    return true;
  }

  if (
    node.type === 'RECTANGLE' &&
    node.locked &&
    node.width === MIN_SIZE &&
    node.height === MIN_SIZE
  ) {
    const fills = node.fills;
    if (Array.isArray(fills) && fills.length === 1) {
      const fill = fills[0];
      if (
        fill.type === 'SOLID' &&
        fill.color.r === 0 &&
        fill.color.g === 0 &&
        fill.color.b === 0
      ) {
        return true;
      }
    }
  }

  return false;
}

// Bounding box covering every non-overlay node on the page, or null if empty.
function getContentBounds(page: PageNode): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const child of page.children) {
    if (isDarkOverlay(child)) {
      continue;
    }
    const box = child.absoluteBoundingBox;
    if (!box) {
      continue;
    }
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }

  if (minX === Infinity) {
    return null;
  }
  return { minX, minY, maxX, maxY };
}

function addOverlay(page: PageNode): void {
  const bounds = getContentBounds(page);

  let centerX = 0;
  let centerY = 0;
  let size = MIN_SIZE;

  if (bounds) {
    centerX = (bounds.minX + bounds.maxX) / 2;
    centerY = (bounds.minY + bounds.maxY) / 2;
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    size = Math.max(MIN_SIZE, Math.max(contentWidth, contentHeight) + CONTENT_PADDING * 2);
  }

  const rect = figma.createRectangle();
  // Insert at index 0 so the overlay sits behind all existing content.
  page.insertChild(0, rect);
  rect.name = OVERLAY_NAME;
  rect.resizeWithoutConstraints(size, size);
  rect.x = centerX - size / 2;
  rect.y = centerY - size / 2;
  rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: OVERLAY_OPACITY }];
  rect.setPluginData(PLUGIN_DATA_KEY, OVERLAY_VALUE);
  // Lock so the overlay can't be selected or moved by accident.
  rect.locked = true;
}

if (figma.editorType === 'figjam') {
  const page = figma.currentPage;
  const overlays = page.children.filter(isDarkOverlay);

  if (overlays.length > 0) {
    for (const overlay of overlays) {
      overlay.remove();
    }
    figma.closePlugin('Dark mode off. Run again to turn on.');
  } else {
    addOverlay(page);
    figma.closePlugin('Dark mode on. Run again to turn off.');
  }
} else {
  figma.closePlugin();
}
