/**
 * A custom element that provides interactive resizing functionality for adjacent HTML elements.
 * Creates draggable splitters that allow users to resize elements by dragging the divider between them.
 */
export declare class SizeModifier extends HTMLElement {
	/**
	 * Shared stylesheet for all SizeModifier instances
	 */
	static readonly styleSheet: CSSStyleSheet;

	/**
	 * Direction of resizing: 0 for column/vertical, 1 for row/horizontal
	 */
	direction: number;

	/**
	 * Array containing data about sibling elements that can be resized
	 */
	sibling_data: Array<{
		element: HTMLElement;
		size: number;
		min: number;
		max: number;
	}>;

	/**
	 * Index of this SizeModifier among its siblings
	 */
	private index_in_siblings: number;

	/**
	 * CSS property that will be updated during resize operations
	 */
	property_to_update: string;

	/**
	 * RequestAnimationFrame ID for drag operations
	 */
	private rafId?: number;

	constructor();

	/**
	 * Handles the start of a drag operation
	 * @param ev - The drag event
	 * @returns The result of dispatching the before-resize event
	 */
	private onDragStart(ev: Event): boolean;

	/**
	 * Handles drag movement and resizes adjacent elements
	 * @param ev - The drag event
	 * @param deltaX - Horizontal movement delta
	 * @param deltaY - Vertical movement delta
	 */
	private onDrag(ev: Event, deltaX: number, deltaY: number): void;

	/**
	 * Validates if a size change respects both minimum and maximum constraints
	 * @param data - The sibling data object to validate
	 * @param offset - The size change offset to validate
	 * @returns True if the size change is valid, false otherwise
	 */
	validateSizeChange(data: {
		element: HTMLElement;
		size: number;
		min: number;
		max: number;
	} | undefined, offset: number): boolean;

	/**
	 * Analyzes sibling elements to gather size and constraint information
	 * @returns Array of sibling data
	 */
	probeSiblings(): Array<{
		element: HTMLElement;
		size: number;
		min: number;
		max: number;
	}>;

	/**
	 * Gets the previous resizable element relative to this splitter
	 * @param direction - Direction offset for size calculation
	 * @returns Sibling data object or undefined
	 */
	getPreviousTarget(direction?: number): {
		element: HTMLElement;
		size: number;
		min: number;
		max: number;
	} | undefined;

	/**
	 * Gets the next resizable element relative to this splitter
	 * @param direction - Direction offset for size calculation
	 * @returns Sibling data object or undefined
	 */
	getNextTarget(direction?: number): {
		element: HTMLElement;
		size: number;
		min: number;
		max: number;
	} | undefined;

	/**
	 * Determines which CSS property should be updated based on the 'updates' attribute
	 * @returns The CSS property name to update
	 */
	getUpdateProperty(): string;

	/**
	 * Automatically detects and sets the resize direction based on parent layout
	 */
	setDirection(): void;

	/**
	 * Applies calculated sizes to sibling elements
	 * @param recalculate - Whether to recalculate sibling data before applying sizes
	 */
	fixSiblingsSize(recalculate?: boolean): void;

	/**
	 * Called when the element is connected to the DOM
	 */
	connectedCallback(): void;
}

declare global {
	interface HTMLElementTagNameMap {
		'size-modifier': SizeModifier;
	}
}

/**
 * Attributes supported by the SizeModifier element
 */
export interface SizeModifierAttributes {
	/**
	 * Specifies which CSS property to modify when resizing
	 * @default "width"
	 */
	updates?: 'width' | 'height' | 'flex-basis';

	/**
	 * Used for internal styling (usually auto-detected)
	 */
	direction?: 'row' | 'column';

	/**
	 * Indicates when the splitter is actively being dragged (set automatically)
	 */
	active?: '';

	/**
	 * Always set to "false" to prevent default drag behavior
	 */
	draggable?: 'false';
}