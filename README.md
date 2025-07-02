# SizeModifier

A lightweight, vanilla JavaScript custom element that provides interactive resizing functionality for adjacent HTML elements. SizeModifier creates draggable splitters that allow users to resize elements by dragging the divider between them.

## Features

- 🎨 **Automatic direction detection** based on parent container layout
- 📱 **Responsive design** with proper cursor indicators
- 🚀 **Performance optimized** with requestAnimationFrame

## Installation

### From GitHub (dist branch)
```bash
npm install github:Mihnea240/sizemodifier#dist
```

### Direct Download
Download the files directly from the repository:
- `sizemodifier.js` - Main component file
- `sizemodifier.d.ts` - TypeScript declarations

### CDN Usage
```html
<script type="module">
  import { SizeModifier } from 'https://cdn.jsdelivr.net/gh/Mihnea240/sizemodifier@dist/sizemodifier.js';
</script>
```



## Basic Usage

Place `<size-modifier>` elements between the elements you want to make resizable. If the parent container is a flex or grid layout, SizeModifier will automatically detect the resizing direction. Otherwise, you can specify the `direction` attribute manually.

**Best Usage is in a flex container**
See [demo](https://mihnea240.github.io/sizemodifier/example)

```html
<div class="flex-container">
  <div class="panel">Panel 1</div>
  <size-modifier></size-modifier>
  <div class="panel">Panel 2</div>
  <size-modifier></size-modifier>
  <div class="panel">Panel 3</div>
</div>
```

## Attributes

### `updates`

Specifies which CSS property to modify when resizing. Defaults to `"width"`.

**Accepted values:**
- `"width"` - Updates the width property
- `"height"` - Updates the height property  
- `"flex-basis"` - Updates the flex-basis property

```html
<size-modifier updates="flex-basis"></size-modifier>
<size-modifier updates="width"></size-modifier>
<size-modifier updates="height"></size-modifier>
```

### `direction`

Manually specify the resize direction. This attribute is primarily used for internal styling and only takes effect in cases where automatic direction detection (from flex or grid containers) does not apply.

**Accepted values:**
- `"row"` - Horizontal resizing (left-right)
- `"column"` - Vertical resizing (up-down)

```html
<size-modifier direction="row"></size-modifier>
<size-modifier direction="column"></size-modifier>
```

## Examples


## CSS Styling

The component comes with default styling but can be customized:

```css
size-modifier {
  background-color: #ccc;
  border: 1px solid #999;
}

size-modifier[active] {
  background-color: #007acc;
}

size-modifier[direction="row"] {
  /* Horizontal splitter styles */
}

size-modifier[direction="column"] {
  /* Vertical splitter styles */
}
```

## Automatic Direction Detection

SizeModifier automatically detects the appropriate resize direction based on the parent container:

- **Flex containers**: Uses `flex-direction` to determine direction
- **Grid containers**: Uses `grid-auto-flow` to determine direction  
- **Other containers**: Falls back to manual `direction` attribute or defaults to horizontal

## Size Constraints

The component respects both minimum and maximum size constraints on resizable elements:

- **Minimum constraints**: Uses CSS `min-width` and `min-height` properties
- **Maximum constraints**: Uses CSS `max-width` and `max-height` properties

```css
.panel {
  min-width: 100px;  /* Won't resize below 100px */
  max-width: 500px;  /* Won't resize above 500px */
  min-height: 50px;  /* Won't resize below 50px */
  max-height: 300px; /* Won't resize above 300px */
}
```

## API Reference

### Methods

- `setDirection()`: Auto-detects and sets the resize direction
- `probeSiblings()`: Finds adjacent elements that can be resized
- `freezeSiblingSize(recalculate)`: Applies calculated sizes to sibling elements, excluding other splitters
- `getPreviousTarget(direction)`: Finds the resizable element before the splitter that can accommodate the specified size change, respecting minimum size constraints
- `getNextTarget(direction)`: Finds the resizable element after the splitter that can accommodate the specified size change, respecting minimum size constraints 