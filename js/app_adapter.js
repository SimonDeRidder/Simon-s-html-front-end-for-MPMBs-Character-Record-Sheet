
const minVer = false;
const app = {
	viewerVersion: 9001,

	setTimeOut: function (command /*str*/, millis /*int*/) {
		setTimeout(command, millis);
	},

	thermometer: {  // combined status bar and load animation (TODO)
		_text: "",  // TODO: use a status bar in stead
		get text() {
			return this._text;
		},
		set text(new_text /*str*/) {
			this._text = new_text;
		},
		end: function () { },
	},

	addToolButton: function ({
		cName /*str*/,
		oIcon = null /*Icon Stream*/,
		cExec /*str*/,
		cEnable = "true" /*str*/,
		cMarked = "false" /*str*/,
		cTooltext = "" /*str*/,
		nPos = -1 /*number*/,
		cLabel = "" /*str*/,
	}) {
		console.log("addToolButton unimplemented, called with name ", cName);
		// TODO: add a button to tool bar (make a tool bar)
	},

	alert: function ({
		cMsg /*str*/,
		nIcon = 0 /*int*/,
		nType = 0 /*int*/,
		cTitle = "Alert" /*str*/,
		oDoc = null /*doc*/,  // parent
		oCheckbox = null /*object*/,
	}) {
		if (nType == 3) {
			throw "alert with nType 3 (Yes-No-Cancel) not implemented.";
		}
		if (oDoc != null) {
			throw "alert with oDoc not implemented.";
		}
		if (oCheckbox != null) {
			throw "alert with oCheckbox not implemented.";
		}
		let message = ((cTitle == "Alert") ? "" : cTitle + "\n\n") + cMsg;
		if (nType == 0) {
			window.alert(message);
			return 1;
		}
		if (window.confirm(message)) {
			return nType == 2 ? 4 : 1;
		} else {
			return nType == 2 ? 3 : 2;
		}
	},

	execDialog: async function (monitor /*object*/, inheritDialog = null /*Dialog*/, parentDoc = this /*doc*/, resultCallback = null /*function*/) {
		if (
			![
				"EXPERIENCE POINTS DIALOG", "ASK USER DIALOG", "SIMPLE TEXT DIALOG", "CLASS SELECTION DIALOG"
			].includes(monitor.description.name)
		) {
			// TODO: remove this if all execDialogs are converted
			// New usage: make caller async, ensure callbacks are connected
			throw "unknown execDialog caller";
		}
		if (inheritDialog != null) {
			throw "inheritDialog not null in execDialog";
		}
		if (parentDoc != this) {
			throw "parentDoc not this in execDialog";
		}

		let body = [];
		let buttonCallbacks = new Map();
		let initialiseCallback = null;
		let title = "";
		for (let prop in monitor) {
			if (prop == 'description') {
				title = monitor[prop].name;
				body = monitor[prop].elements;
			} else if (prop == 'initialize') {
				initialiseCallback = prop;
			} else if (prop == 'validate') {
				throw "validate callback not implemented for execDialog";
			} else if (prop == 'commit') {
				buttonCallbacks.set('ok', prop);
			} else if (prop == 'destroy') {
				throw "destroy callback not implemented for execDialog";
			} else if (typeof (monitor[prop]) == 'function') {
				buttonCallbacks.set(prop, prop);
			}
		}

		return await dialogManager.createDialog(
			title = title,
			body = body,
			monitor = monitor,
			icon = null,
			callbacksToInsert = buttonCallbacks,
			initialiseCallback = initialiseCallback,
		)
	},

	popUpMenuEx: {
		apply: async function (app /*this*/, aParams /*[Object]*/) {
			return new Promise((resolve, reject) => {
				let menu = AdapterParsePopUpMenu(aParams, resolve);
				var menuElement = new ContextMenu(menu);
				menuElement.display(event);
			});
		},
	},
};

const display = {
	visible: 0,
	hidden: 1,
	noPrint: 2,
	noView: 3,
};


AdapterParsePopUpMenu = function (aParams, resolve) {
	let menu = []
	for (let i = 0; i < aParams.length; i++) {
		if (aParams[i].cName == '-') {
			menu.push({
				type: ContextMenu.DIVIDER,
			});
		} else {
			if (aParams[i].oSubMenu) {
				menu.push({
					text: aParams[i].cName,
					enabled: aParams[i].bEnabled,
					sub: AdapterParsePopUpMenu(aParams[i].oSubMenu, resolve),
				});
			} else {
				let returnVal = aParams[i].cReturn ? aParams[i].cReturn : aParams[i].cName;
				let item = {
					text: aParams[i].cName,
					enabled: aParams[i].bEnabled,
					events: {
						'click': function (event) {
							resolve(returnVal);
						},
					},
				}
				if (aParams[i].bMarked) {
					item.icon = '<img src="img/check.svg">';
				}
				menu.push(item);
			}
		}
	}
	return menu;
};


this.info = {
	SheetType: "printer friendly",
	SheetVersion: "v13.1.2",
};

this.bookmarkRoot = {
	children: [
		{
			children: [],
		}
	],
};

this.getField = function (field_name /*str*/) /*AdapterClassFieldReference|AdapterClassImageReference|null*/ {
	if (field_name.startsWith('SaveIMG.') && (field_name != 'SaveIMG.Patreon')) {
		return adapter_helper_get_saveimg_field(field_name.replace(/^SaveIMG\./, ''))
	}
	let field_id = adapter_helper_convert_fieldname_to_id(field_name);
	let element = document.getElementById(field_id);
	if (element == null) {
		if (['AdvLog.Options'].includes(field_id)) {
			return null
		} else {
			throw "null element: " + field_id;
		}
	}
	return adapter_helper_reference_factory(element, field_id);
};

this.calculateNow = function () {
	// TODO: does nothing for now, we don't pause calculations (see also calcStop and calcCont)
};

this.resetForm = function (aFields = null /*fields*/) {
	if (!aFields) {
		throw "aFields is null in resetForm";
	}
	aFields.forEach(field => {
		let element = document.getElementById(adapter_helper_convert_fieldname_to_id(field));
		let element_type = element.getAttribute('type');
		let changed = false;
		if ((element_type == 'text') | (element_type == 'number')) {
			if (element.value != "") {
				changed = true;
			}
			element.value = "";
		}
		else if (element_type == 'checkbox') {
			if (element.checked) {
				changed = true;
			}
			element.checked = false;
		}
		else {
			if (element.value != "") {
				changed = true;
			}
			element.value = "";
		}
		if (changed) {
			element.dispatchEvent(new Event('change'));
		}
	});
};


function AFNumber_Format(nDec /*int*/, sepStyle /*int*/, negStyle /*int*/, currStyle /*int*/, strCurrency /*str*/, bCurrencyPrepend /*boolean*/) /*str*/ {
	// nDec = number of decimals
	// sepStyle = separator style 0 = 1,234.56 / 1 = 1234.56 / 2 = 1.234,56 / 3 = 1234,56 /
	// negStyle = 0 black minus / 1 red minus / 2 parens black / 3 parens red /
	// currStyle = reserved
	// strCurrency = string of currency to display
	// bCurrencyPrepend = true = pre pend / false = post pend
	let locale;
	if (sepStyle < 2) {
		locale = 'en-GB';
	} else {
		locale = 'nl-BE';
	}
	let options = {
		maximumFractionDigits: nDec,
		style: 'decimal',
		useGrouping: ((sepStyle == 0) | (sepStyle == 2)),
	}
	if (strCurrency) {
		options.currency = strCurrency;
		options.style = 'currency';
	}
	if (event.value) {
		event.value = Number(event.value.replace(',', '.').match(/\d+\.?\d*/)[0]).toLocaleString(locale, options);
	} else {
		event.value = '';
	}

};


// standard overrides/additions


Array.prototype.toSource = function () /*str*/ {
	let str = "";
	for (let i = 0; i < this.length; i++) {
		if (str) {
			str += ",";
		}
		if ((typeof this[i]) == 'number') {
			str += String(this[i]);
		} else if ((typeof this[i]) == 'string') {
			str += "'" + this[i] + "'";
		} else {
			throw "unsupported element type in array toSource:" + (typeof this[i]);
		}
	}
	return "[" + str + "]";
}



// Adapter classes

class AdapterClassFieldReference {
	constructor(html_element /*HTMLElement*/) {
		this.html_element = html_element;
	}

	get submitName() /*str*/ {
		let submitName_ = this.html_element.dataset.submit_name;
		if (!submitName_) {
			return "";
		}
		return submitName_;
	}

	set submitName(new_submitName /*str*/) {
		this.html_element.dataset.submit_name = new_submitName;
	}

	get value() /*str*/ {
		let value_;
		if (['input', 'select', 'textarea'].includes(this.html_element.tagName.toLowerCase())) {
			value_ = this.html_element.value;
		} else {
			value_ = this.html_element.getAttribute('value');
		}
		if (value_ === undefined) {
			return "";
		}
		if (
			!isNaN(value_)
			&& (
				(
					this.html_element.hasAttribute('type')
					&& this.html_element.getAttribute('type').toLowerCase() == 'number'
				)
				|| this.html_element.classList.contains('isNumber')
			)
		) {
			return Number(value_);
		}
		return value_;
	}

	set value(new_value /*str*/) {
		let changed = false;
		if (['input', 'select', 'textarea'].includes(this.html_element.tagName.toLowerCase())) {
			if (this.html_element.value != new_value) {
				changed = true;
			}
			this.html_element.value = new_value;
		} else {
			if (this.html_element.getAttribute('value') != new_value) {
				changed = true;
			}
			this.html_element.setAttribute('value', new_value);
		}
		if (changed) {
			this.html_element.dispatchEvent(new Event('change'));
		}
	}

	get userName() /*str*/ {
		let userName_ = this.html_element.getAttribute('aria-label');
		if (!userName_) {
			return "";
		}
		return userName_;
	}

	set userName(new_userName /*str*/) {
		this.html_element.setAttribute('aria-label', new_userName);
	}

	get display() /*int*/ {
		let visibility = this.html_element.style.visibility;
		if (visibility === null) {
			visibility = 'visible';
		}
		let nonPrintable = this.html_element.classList.contains('nonprintable');
		if (visibility == 'hidden') {
			// noView not supported
			return display.hidden;
		} else {
			if (nonPrintable) {
				return display.noPrint;
			} else {
				return display.visible;
			}
		}
	}

	set display(newDisplay /*int*/) {
		if (newDisplay == display.noView) {
			throw "tried to set noView display on element";
		}
		if (newDisplay == display.hidden) {
			this.html_element.style.visibility = 'hidden';
		} else {
			this.html_element.style.visibility = 'visible';
			if (newDisplay == display.noPrint) {
				this.html_element.classList.add('nonprintable');
			}
			this.html_element.dispatchEvent(new Event('displayShow'));
		}
	}

	get type() /*str*/ {
		switch (this.html_element.tagName.toLowerCase()) {
			case 'button':
				return 'button';
			case 'select':
				return 'combobox';
			case 'input':
				switch (this.html_element.type) {
					case 'button':
						return 'button';
					case 'checkbox':
						return 'checkbox';
					case 'radio':
						return 'radiobutton';
					default:
						if (this.html_element.getAttribute('list')) {
							return 'combobox';
						}
						return 'text';
				}
			default:
				return 'text';
		}
	}

	get currentValueIndices() /*int*/ {
		if (this.html_element.tagName.toLowerCase() == 'select') {
			return this.html_element.selectedIndex;
		} else if ((this.html_element.tagName.toLowerCase() == 'input') && (this.html_element.getAttribute('list'))) {
			throw "get currentValueIndices on datalist-input " + String(this.html_element.id);
		} else {
			throw "get currentValueIndices on non-combobox " + String(this.html_element.id);
		}
	}

	set currentValueIndices(newIndex /*int*/) {
		if (this.html_element.tagName.toLowerCase() == 'select') {
			this.html_element.selectedIndex = newIndex;
		} else if ((this.html_element.tagName.toLowerCase() == 'input') && (this.html_element.getAttribute('list'))) {
			let listElement = document.getElementById(this.html_element.getAttribute('list'));
			if (listElement) {
				this.html_element.value = listElement.children[newIndex].value;
			} else {
				throw "Cannot find datalist element " + String(this.html_element.getAttribute('list'));
			}
		} else {
			throw "set currentValueIndices on non-combobox " + String(this.html_element.id);
		}
	}

	get page() /*Number*/ {
		return this.html_element.dataset.page;
	}

	toSource() /*str*/ {
		return this.html_element.toSource();
	}

	isBoxChecked(nWidget /*int*/) /*boolean*/ {
		if (nWidget > 0) {
			throw "isBoxChecked nWidget > 0:" + String(nWidget);
		}
		if (this.html_element.checked) {
			return true;
		}
		else {
			return false;
		}
	}

	checkThisBox(nWidget /*int*/, bCheckIt = true /*boolean*/) {
		if (nWidget > 0) {
			throw "checkThisBox nWidget > 0:" + String(nWidget);
		}
		let changed = false;
		if (this.html_element.checked != bCheckIt) {
			changed = true;
		}
		this.html_element.checked = bCheckIt;
		if (changed) {
			this.html_element.dispatchEvent(new Event('change'));
		}
	}

	setItems(oArray /*[str|[str;2]]*/) {
		if ((this.html_element.tagName.toLowerCase() != 'input') || !this.html_element.hasAttribute('list')) {
			throw "called setItems on unsupported element type: " + this.html_element.tagName.toLowerCase();
		}
		let listElement = document.getElementById(this.html_element.getAttribute('list'));
		while (listElement.lastElementChild) {
			listElement.removeChild(listElement.lastElementChild);
		}
		let id_, name;
		for (let i = 0; i < oArray.length; i++) {
			if (oArray[i].constructor === Array) {
				name = String(oArray[i][1]);
				id_ = String(oArray[i][0]);
			} else {
				name = String(oArray[i]);
				id_ = name;
			}
			let option = document.createElement('option');
			option.value = id_;
			option.innerText = name;
			listElement.appendChild(option);
		}
	}

	buttonSetIcon(icon /*String*/) {
		this.html_element.style.backgroundImage = "url(" + icon + ")";
	}

	setAction(actionType /*String*/, actionStr /*String*/) {
		// TODO: make universal by scanning for `What` and `getField` and adding the change listeners?
		if (actionStr != '') {
			throw (
				"setAction called for '" + actionType + "', with non-empty value '" + actionStr + "'. "
				+ "add an if-clause for the specific target and action, add a script to add the event listener(s) "
				+ "(or expand existing one(s)), eval-ing the actionStr and setting value to event.value."
			);
		}
	}
}


class AdapterClassImageReference {
	constructor(img_url /*String*/) {
		this.img_url = img_url;
	}

	buttonGetIcon() /*String*/ {
		return this.img_url;
	}
}


class AdapterClassFieldContainterReference {
	constructor(html_element /*HTMLElement*/) {
		this.html_element = html_element;
	}

	set submitName(new_submitName /*str*/) {
		throw "set submitName called on field container"
	}

	set value(new_value /*str*/) {
		throw "set value called on field container"
	}

	set userName(new_userName /*str*/) {
		throw "set userName called on field container"
	}

	set display(newDisplay /*int*/) {
		for (let i = 0; i < this.html_element.children.length; i++) {
			let childRef = adapter_helper_reference_factory(this.html_element.children[i], "");
			if (childRef) {
				childRef.display = newDisplay;
			}
		}
	}
}

class AdapterClassTemplateReference {
	constructor(values /*[String]*/) {
		this.values = values;
	}

	get value() /*PreSplitString*/ {
		return new PreSplitString(this.values);
	}
}

class PreSplitString {
	constructor(values /*[String]*/) {
		this.values = values;
	}

	split() /*[String]*/ {
		return this.values;
	}
}

class CurrentProfsAdapter {
	constructor(
		skills, armours, weapons, saves, resistances, languages, tools, savetxts, visions, speeds, specialarmours, carryingcapacitys, advantages
	) {
		this.skill = (skills === undefined) ? {} : skills;
		this.armour = (armours === undefined) ? {} : armours;
		this.weapon = (weapons === undefined) ? {} : weapons;
		this.save = (saves === undefined) ? {} : saves;
		this.resistance = (resistances === undefined) ? {} : resistances;
		this.language = (languages === undefined) ? {} : languages;
		this.tool = (tools === undefined) ? {} : tools;
		this.savetxt = (savetxts === undefined) ? {} : savetxts;
		this.vision = (visions === undefined) ? {} : visions;
		this.speed = (speeds === undefined) ? {} : speeds;
		this.specialarmour = (specialarmours === undefined) ? {} : specialarmours;
		this.carryingcapacity = (carryingcapacitys === undefined) ? {} : carryingcapacitys;
		this.advantage = (advantages === undefined) ? {} : advantages;
	}

	toSource() {
		return (
			"new CurrentProfsAdapter("
			+ "skills=" + adapter_helper_recursive_toSource(this.skill) + ","
			+ "armours=" + adapter_helper_recursive_toSource(this.armour) + ","
			+ "weapons=" + adapter_helper_recursive_toSource(this.weapon) + ","
			+ "saves=" + adapter_helper_recursive_toSource(this.save) + ","
			+ "resistances=" + adapter_helper_recursive_toSource(this.resistance) + ","
			+ "languages=" + adapter_helper_recursive_toSource(this.language) + ","
			+ "tools=" + adapter_helper_recursive_toSource(this.tool) + ","
			+ "savetxts=" + adapter_helper_recursive_toSource(this.savetxt) + ","
			+ "visions=" + adapter_helper_recursive_toSource(this.vision) + ","
			+ "speeds=" + adapter_helper_recursive_toSource(this.speed) + ","
			+ "specialarmours=" + adapter_helper_recursive_toSource(this.specialarmour) + ","
			+ "carryingcapacitys=" + adapter_helper_recursive_toSource(this.carryingcapacity) + ","
			+ "advantages=" + adapter_helper_recursive_toSource(this.advantage)
			+ ")"
		)
	}
}

class ChangesDialogSkipAdapter {
	constructor(
		chXP = false, // experience points
		chAS = false, // ability scores
		chHP = false, // hit points
		chSP = false, // spells
		chSK = false, // skills
		chAT = false, // attack calculations
		chNO = false, // notes additions
		chCO = false, // companion changes
	) {
		this.chXP = chXP;
		this.chAS = chAS;
		this.chHP = chHP;
		this.chSP = chSP;
		this.chSK = chSK;
		this.chAT = chAT;
		this.chNO = chNO;
		this.chCO = chCO;
	}

	toSource() {
		return (
			"new ChangesDialogSkipAdapter("
			+ "chXP=" + adapter_helper_recursive_toSource(this.chXP) + ","
			+ "chAS=" + adapter_helper_recursive_toSource(this.chAS) + ","
			+ "chHP=" + adapter_helper_recursive_toSource(this.chHP) + ","
			+ "chSP=" + adapter_helper_recursive_toSource(this.chSP) + ","
			+ "chSK=" + adapter_helper_recursive_toSource(this.chSK) + ","
			+ "chAT=" + adapter_helper_recursive_toSource(this.chAT) + ","
			+ "chNO=" + adapter_helper_recursive_toSource(this.chNO) + ","
			+ "chCO=" + adapter_helper_recursive_toSource(this.chCO)
			+ ")"
		)
	}
}


// Helper functions
function adapter_helper_convert_fieldname_to_id(field_name /*str*/) /*str*/ {
	return field_name.replace(/ /g, "_");
};

function adapter_helper_convert_id_to_fieldname(id /*str*/) /*str*/ {
	return id.replace(/_/g, " ");
};

function adapter_helper_recursive_toSource(object /*any*/) /*str*/ {
	if (Object.prototype.toString.call(object) === "[object Array]") {
		let result = "[";
		let first = true;
		object.forEach(function (child, index, array) {
			if (!first) {
				result += ",";
			}
			result += adapter_helper_recursive_toSource(child);
			first = false;
		});
		result += "]";
		return result;
	} else if (typeof object == "object") {
		// testing that this is DOM
		if (object.nodeType && typeof object.toSource == "function") {
			return object.toSource(true);
		} else { // check that this is a literal
			if (object instanceof Date) {
				return "new Date(" + object.toString() + ")"
			} else {
				// it is an object literal
				let result = "{";
				let first = true;
				for (let var_ in object) {
					if (!first) {
						result += ",";
					}
					result += var_ + ":" + adapter_helper_recursive_toSource(object[var_]);
					first = false;
				}
				result += "}";
				return result;
			}
		}
	} else {
		return String(object);
	}
};

function adapter_helper_get_number_field_selection() /*[int, int]*/ {
	let sel = window.getSelection();
	let orig_len = sel.toString().length;
	let len = orig_len;
	sel.modify('extend', 'backward', 'character');
	let moveCount = 0;
	// measure selection backwards
	while (len < sel.toString().length) {
		moveCount += 1;
		len = sel.toString().length;
		sel.modify('extend', 'backward', 'character');
	};
	// restore original selection
	for (let i = 0; i < moveCount; i++) {
		sel.modify('extend', 'forward', 'character');
	}
	return [moveCount, moveCount + orig_len];
};

function adapter_helper_reference_factory(element /*HTMLElement*/, field_id /*String*/) /*AdapterClassFieldReference|AdapterClassFieldContainterReference|null*/ {
	if (field_id) {
		if (field_id.startsWith('Template.extras.')) {
			let values = (new AdapterClassFieldReference(element)).value.split(",");
			if ((values.length == 1) && (values[0] == "")) {
				values = [];
			}
			return new AdapterClassTemplateReference(values);
		}
	}
	if (element.classList.contains('field')) {
		return new AdapterClassFieldReference(html_element = element);
	} else if (element.classList.contains('field-container')) {
		return new AdapterClassFieldContainterReference(html_element = element);
	} else {
		return null;
	}
}

function adapter_helper_get_saveimg_field(img_name /*String*/) /*AdapterClassImageReference|null*/ {
	// Faction.The Emerald Enclave.symbol
	if (img_name.startsWith('Faction.')) {
		let bare_name = img_name.replace(/^Faction\./, '').replace(/\.symbol$/, '').toLowerCase().replace(/ /g, '_').replace("'", "");
		if (adapter_helper_UrlExists('img/factions/' + bare_name + '.svg')) {
			return new AdapterClassImageReference('img/factions/' + bare_name + '.svg');
		} else {
			return null;
		}
	}
	throw "unknown SaveIMG type: " + String(img_name);
}

function adapter_helper_UrlExists(url /*String*/) /*boolean*/ {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status != 404;
}
