/**
 * Returns an Element object representing the element whose id property matches the specified string.
 * @param {string} id - element id
 * @return {object} element object
 */
function getID(id) {
	return document.getElementById(id);
}

/**
 * Returns the first element within the document that matches the specified selector, or group of selectors.
 * @param {string} selector - CSS selector
 * @return {object} element object
 */
function qs(selector) {
	return document.querySelector(selector);
}

/**
 * Adds the specified class value. If these classes already exist in the element's class attribute, they are ignored.
 * @param {object} el - element object
 * @param {string} className - class name
 */
function addClass(el, className) {
	el.classList.add(className);
}

/**
 * Removes the specified class value.
 * @param {object} el - element object
 * @param {string} className - class name
 */
function removeClass(el, className) {
	el.classList.remove(className);
}

/**
 * Sets the text content of a node and its descendants.
 * @param {object} el - element object
 * @param {string} text - text to set
 */
function setText(el, text) {
	el.textContent = text;
}

/**
 * Shows the element by setting the display style to its original value.
 * @param {object} el - element object
 */
function show(el) {
	el.style.display = '';
}

/**
 * Hides the element by setting the display style to 'none'.
 * @param {object} el - element object
 */
function hide(el) {
	el.style.display = 'none';
}

/**
 * Toggles a boolean attribute on the element (such as 'hidden' or 'checked').
 * @param {object} el - element object
 * @param {string} attr - attribute name
 */
function toggleAttribute(el, attr) {
	el.toggleAttribute(attr);
}

/**
 * Sets an attribute on the specified element. If the attribute already exists, the value is updated.
 * @param {object} el - element object
 * @param {string} attr - attribute name
 * @param {string} value - attribute value
 */
function setAttribute(el, attr, value) {
	el.setAttribute(attr, value);
}

/**
 * Returns the value of a specified attribute on the element. If the given attribute does not exist, the value returned will be null.
 * @param {object} el - element object
 * @param {string} attr - attribute name
 * @return {string} attribute value
 */
function getAttribute(el, attr) {
	return el.getAttribute(attr);
}
