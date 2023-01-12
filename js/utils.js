

function createEnum(values) {
	const enumObject = {};
	for (const val of values) {
		enumObject[val] = val;
	}
	return Object.freeze(enumObject);
}


function addElementNode(
	tag /*str*/,
	parent /*Node*/,
	text /*str*/,
	id /*str*/,
	className /*str*/,
	style=null /*Object*/,
) {
	let el = document.createElement(tag);
	if (text) {
		el.innerHTML = text;
	}
	if (id) {
		el.id = id;
	}
	if (className) {
		el.className = className;
	}
	if (style) {
		for(prop in style) {
			el.style[prop] = style[prop];
		}
	}
	parent.appendChild(el);
	return el;
}
