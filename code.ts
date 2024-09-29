// This file holds the main code for plugins.

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  // Set the background of each design page to #1E1E1E
  figma.root.children.forEach(page => {
    if (page.type === 'PAGE') {
      page.backgrounds = [
        { type: 'SOLID', color: { r: 0.118, g: 0.118, b: 0.118 } } // 1E1E1E in RGB (normalized)
      ];
    }
  });

  // Display a notification message
  figma.notify('Hey, try me in FigJam next!');

  // Close the plugin after execution
  figma.closePlugin();
}

// Runs this code if the plugin is run in FigJam
if (figma.editorType === 'figjam') {
  // Size of the rectangle to cover the entire board
  const rectSize = 300000;

  // Function to create a semi-transparent black rectangle
  function createTransparentRectangle(page: PageNode, opacity: number) {
    const backgroundRect = figma.createRectangle();
    backgroundRect.resizeWithoutConstraints(rectSize, rectSize);
    
    // Transparent black fill with given opacity
    backgroundRect.fills = [{ 
      type: 'SOLID', 
      color: { r: 0, g: 0, b: 0 }, 
      opacity: opacity // Set transparency level
    }];

    // Center the rectangle on the canvas (assuming 0,0 as the center point)
    backgroundRect.x = -rectSize / 2;
    backgroundRect.y = -rectSize / 2;

    // Insert the rectangle at the back of all layers (index 0)
    page.insertChild(0, backgroundRect);

    // Lock the rectangle to prevent user interaction
    backgroundRect.locked = true;
  }

  // Apply the background rectangles to every page
  figma.root.children.forEach(page => {
    if (page.type === 'PAGE') {
      // Create three overlapping transparent rectangles to darken the board
      createTransparentRectangle(page, 0.5); // First rectangle
      createTransparentRectangle(page, 0.5); // Second rectangle
      createTransparentRectangle(page, 0.5); // Third rectangle
    }
  });

  // Close the plugin after execution
  figma.closePlugin();
}
