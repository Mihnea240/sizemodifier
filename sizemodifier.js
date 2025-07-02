import cusromDrag from "customdrag";

export class SizeModifier extends HTMLElement {

	static styleSheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(/*css*/`
			:host {
				display: block;
				background-color: transparent;
				user-select: none;
				flex: 0 0 5px;
			}
			:host([direction="row"]){
				width: 5px;
				height: 100%;
				cursor: ew-resize;
			}
			:host([direction="column"]){
				width: 100%;
				height: 5px;
				cursor: ns-resize;
			}
		`);
		return sheet;
	})();

	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		shadow.adoptedStyleSheets = [SizeModifier.styleSheet];
		
		this.direction = 0;
		this.sibling_data = [];
		this.index_in_siblings = 0;
 		this.property_to_update = "flex-basis";

		cusromDrag(this, {
			onstart: this.onDragStart.bind(this),
			onmove: this.onDrag.bind(this),
			onend: () => {
				this.removeAttribute("active");
				document.body.style.cursor = "default";
			}
		})

	}
	onDragStart(ev) {
		this.setDirection();
		this.property_to_update = this.getUpdateProperty();
		this.freezeSiblingSize(true);
		this.setAttribute("active", "");
		
		document.body.style.cursor = this.direction ? "ew-resize" : "ns-resize";
		window.getSelection()?.removeAllRanges();

		return true;
	}

	onDrag(ev, deltaX, deltaY) {
		if (this.rafId) return;

		this.rafId = requestAnimationFrame(() => {
			let offset = this.direction ? deltaX : deltaY;
			let previous = this.getPreviousTarget(offset);
			let next = this.getNextTarget(-offset);
			
			// if ((previous && previous.element && previous.size + offset < previous.min) ||
			// (next && next.element && next.size - offset < next.min)) {
			// 	this.rafId = null;
			// 	return;
			// }
			if (!this.validateSizeChange(previous, offset) || !this.validateSizeChange(next, -offset))
				return this.rafId = null;

			if (previous?.element)
				previous.element.style[this.property_to_update] = `${parseInt(previous.size += offset)}px`;
			
			if (next?.element)
				next.element.style[this.property_to_update] = `${parseInt(next.size -= offset)}px`;
			
			// let a1 = previous?.element;
			// let a2 = next?.element;
			// if (offset > 0 && next?.element && next.size - offset < next.min) a1=null;
			// if (offset < 0 && previous?.element && previous.size + offset < previous.min) a2 = null;

			// if (a1)
			// 	previous.element.style[this.property_to_update] = `${parseInt(previous.size += offset)}px`;

			// if (a2)
			// 	next.element.style[this.property_to_update] = `${parseInt(next.size -= offset)}px`;

			
			this.rafId = null;
		});
	}

	validateSizeChange(data, offset) {
		if (!data || !data.element) return false;
		
		if(parseInt(data.size + offset) < data.min) return false;

		if (parseInt(data.size + offset) > data.max) return false;

		return true;
	}

	probeSiblings() {
		let parent = this.parentElement, i = 0;
		if (!parent) return;

		let buffer = new Array(parent.children.length);

		for (let child of parent.children) {
			if (child === this) this.index_in_siblings = i;
			else if (child instanceof SizeModifier) continue;

			let bounds = child.getBoundingClientRect();
			let style = getComputedStyle(child);

			buffer[i++] = {
				element: child,
				size: this.direction ? bounds.width : bounds.height,
				min: (this.direction ? parseFloat(style.minWidth) : parseFloat(style.minHeight)) || 0,
				max: (this.direction ? parseFloat(style.maxWidth) : parseFloat(style.maxHeight)) || Infinity
			};
		}
		buffer.length = i;
		return this.sibling_data = buffer;
	}

	getPreviousTarget(direction = 0) {
		for (let i = this.index_in_siblings - 1; i >= 0; i--) {
			let target = this.sibling_data[i];
			if (Math.floor(target.size + direction) > target.min) {
				return target;
			}
		}
		return this.sibling_data[this.index_in_siblings - 1];
	}
	getNextTarget(direction = 0) {
		for (let i = this.index_in_siblings + 1; i < this.sibling_data.length; i++) {
			let target = this.sibling_data[i];
			if (Math.floor(target.size + direction) > target.min) {
				return target;
			}
		}
		return this.sibling_data[this.index_in_siblings + 1];
	}

	getUpdateProperty() {
		let prop = this.getAttribute("updates");
		if (!prop) return;
		switch (prop) {
			case "width": case "height": return this.direction ? "width" : "height";
			case "flex-basis": return "flex-basis";
			default:
				console.warn(`SizeModifier: Unsupported update property "${prop}". Defaulting to "width".`);
				return "width";
		}
	}

	setDirection() {
		// Detect parent display and set direction attribute
		const parent = this.parentElement;
		if (!parent) return;

		const style = getComputedStyle(parent);

		if (style.display.includes("flex")) {
			this.direction = style.flexDirection === "column" ? 0 : 1;
		} else if (style.display.includes("grid")) {	
			this.direction = style.gridAutoFlow.includes("column") ? 1 : 0;
		} else {
			this.direction = this.getAttribute("direction") === "column" ? 0 : 1;
		}

		this.setAttribute("direction", this.direction ? "row" : "column");
	}

	freezeSiblingSize(recalculate = false) {
		if (recalculate) this.probeSiblings();
		requestAnimationFrame(() => {
	
			for (const data of this.sibling_data) {
				if (!data.element) continue;
	
				data.element.style[this.property_to_update] = `${parseInt(data.size)}px`;
			}
		});
			
	}

	connectedCallback() {
		this.setAttribute("draggable", "false");

		if (!this.hasAttribute("updates")) {
			this.setAttribute("updates", "width");
		}
		requestAnimationFrame(() => {
			this.setDirection();
		});
	}
}
customElements.define("size-modifier", SizeModifier);