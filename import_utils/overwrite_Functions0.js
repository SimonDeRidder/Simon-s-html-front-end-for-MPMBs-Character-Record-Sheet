
function newObj(item) {
	if (!item) { return item; } // null, undefined values check

	var types = [Number, String, Boolean],
		result;

	// normalizing primitives if someone did new String('aaa'), or new Number('444');
	types.forEach(function (type) {
		if (item instanceof type) {
			result = type(item);
		}
	});

	if (typeof result == "undefined") {
		// test for RegExp
		if (item[Symbol.match]) {
			result = item;
		}
	}

	if (typeof result == "undefined") {
		if (Object.prototype.toString.call(item) === "[object Array]") {
			result = [];
			item.forEach(function (child, index, array) {
				result[index] = newObj(child);
			});
		} else if (typeof item == "object") {
			// testing that this is DOM
			if (item.nodeType && typeof item.cloneNode == "function") {
				result = item.cloneNode(true);
			} else if (!item.prototype) { // check that this is a literal
				if (item instanceof Date) {
					result = new Date(item);
				} else {
					// it is an object literal
					result = {};
					for (var i in item) {
						result[i] = newObj(item[i]);
					}
				}
			} else {
				let newItem = {};
				let value;
				for (const key in item) {
					// Prevent self-references to parent object
					if (Object.is(aObject[key], aObject)) continue;
					value = item[key];
					newItem[key] = (typeof value === "object") ? newObj(value) : value;
				}

				return newItem;
			}
		} else {
			result = item;
		}
	}

	return result;
};
