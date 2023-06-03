

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


function getAccessedFieldIds(code /*String*/) /*Set[String]*/ {
	const patterns = [/What\(([^\)]+)\)/g, /tdoc.getField\(([^\)]+)\)/g];
	let all_matches = [];
	for (let pattern of patterns) {
		let matches = [...code.matchAll(pattern)];
		for (let match of matches) {
			if (match[1].startsWith("'") && match[1].endsWith("'") && !match[1].slice(1, -1).includes("'")) {
				all_matches.push(match[1].slice(1, -1));
			} else {
				throw "Non-literal encountered in matches for getAccessedFieldIds: " + match;
			}
		}
	}
	let accessedFieldIds = new Set();
	for (let match of all_matches) {
		accessedFieldIds.add(adapter_helper_convert_fieldname_to_id(match));
	}
	return accessedFieldIds;
}
