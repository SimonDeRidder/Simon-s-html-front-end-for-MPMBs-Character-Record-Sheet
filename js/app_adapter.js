
const minVer = false;
const MPMBImportFunctions_isInstalled = true;
const app = {
	viewerVersion: 9001,

	setTimeOut: function (command /*str*/, millis /*int*/) /*Number*/ {
		return setTimeout(command, millis);
	},

	clearTimeOut: function (timeout /*Number*/) {
		clearTimeout(timeout);
	},

	thermometer: {  // combined status bar and load animation (TODO)
		_text: "",  // TODO: use a status bar in stead
		get text() {
			return this._text;
		},
		set text(new_text /*str*/) {
			console.log(new_text);
			this._text = new_text;
		},
		end: function () { },
	},

	addToolButton: function ({
		cName /*str*/,
		oIcon = null /*Icon Stream*/,
		cExec /*str*/,
		cEnable = "true" /*str*/,
		cMarked = undefined /*str*/,
		cTooltext = "" /*str*/,
		nPos = -1 /*number*/,
		cLabel = "" /*str*/,
	}) {
		// TODO: add a buttons to a decent tool bar
		if (cName == 'ResetButton') {
			return;
		}
		let container = document.getElementById('tempButtonRibbon');
		let buttonParent = document.createElement('div');
		buttonParent.style.width = '100%';
		buttonParent.style.height = '13px';
		let newButton = document.createElement('button');
		newButton.className = "field button nonprintable";
		newButton.id = cName;
		if (oIcon) {
			console.log("Warning: addToolButton with oIcon not implemented:", cName, ":", oIcon);
		}
		newButton.onclick = async function() {
			let res = eval(cExec);
			return new Promise((resolve) => {
				if (res && res.next) {
					res.next(() => {resolve()});
				} else {
					return res;
				}
			});
		};
		if (cEnable != "true") {
			throw "addToolButton with cEnable='", cEnable, "' for element ", cName;
		}
		// cMarked is ignored
		newButton.ariaLabel = cTooltext;
		if (nPos != -1) {
			console.log("Warning: addToolButton with nPos != -1 not implemented:", cName, ":", nPos);
		}
		newButton.innerText = cLabel;

		buttonParent.appendChild(newButton);
		container.appendChild(buttonParent);
	},

	removeToolButton: function ({
		cName /*str*/,
	}) {
		let container = document.getElementById('tempButtonRibbon');
		let el = document.getElementById(cName);
		if (el) {
			container.removeChild(el.parentElement);
			el.parentElement.remove();
			el.remove();
		}
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
			console.log("Warning: alert with oCheckbox not implemented.");
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

	execDialog: async function (
		monitor /*object*/,
		inheritDialog = null /*Dialog*/,
		parentDoc = this /*doc*/,
		resultCallback = null /*function*/,
	) {
		if (
			![
				"EXPERIENCE POINTS DIALOG",
				"ASK USER DIALOG",
				"SIMPLE TEXT DIALOG",
				"CLASS SELECTION DIALOG",
				"SOURCE SELECTION DIALOG",
				"IMPORT CUSTOM SCRIPT DIALOG",
				"MANUAL CUSTOM SCRIPT DIALOG",
				"CLASSES OR ARCHETYPES SOURCE SELECTION DIALOG",
				"BACKGROUNDS SOURCE SELECTION DIALOG",
				"WEAPONS/ATTACKS SOURCE SELECTION DIALOG",
				"MAGIC ITEMS SOURCE SELECTION DIALOG",
				"SPELLS SOURCE SELECTION DIALOG",
				"SPECIAL COMPANION OPTIONS SOURCE SELECTION DIALOG",
				"PLAYER RACES SOURCE SELECTION DIALOG",
				"BACKGROUND FEATURES SOURCE SELECTION DIALOG",
				"AMMUNITION SOURCE SELECTION DIALOG",
				"ARMORS SOURCE SELECTION DIALOG",
				"FEATS SOURCE SELECTION DIALOG",
				"CREATURES SOURCE SELECTION DIALOG",
				"SUBCLASS SELECTION DIALOG",
				"SET MODIFIER DIALOG",
				"CHANGES ALERT DIALOG",
				"COMPARE DIALOG",
				"ABILITY SCORES DIALOG",
				"NEW COLUMN DIALOG",
				"REMOVE COLUMN DIALOG",
				"SPELL SELECTION DIALOG",
				"SPELL LIST GENERATION DIALOG",
				"FIRST COLUMN DIALOG",
				"Choose the unit system and decimal separator",
				"CARRIED WEIGHT DIALOG",
				"ADD FILE TO ACROBAT INSTALLATION DIALOG",
				"IMPORT FROM PDF DIALOG",
				"Set the Font, the Font Size, and Hide Text Lines",
				"Choose the functions you want to set to manual",
				"Choose the pages you want to print"
			].includes(monitor.description.name)
		) {
			// TODO: remove this if all execDialogs are converted
			// New usage: make caller async, ensure callbacks are connected
			throw "unknown execDialog caller: " + monitor.description.name;
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
		let destroyCallback = null;
		let validateCallback = null;
		let title = "";
		for (let prop in monitor) {
			if (prop == 'description') {
				title = monitor[prop].name;
				body = monitor[prop].elements;
			} else if (prop == 'initialize') {
				initialiseCallback = prop;
			} else if (prop == 'validate') {
				validateCallback = prop;
			} else if (prop == 'commit') {
				buttonCallbacks.set('ok', prop);
			} else if (prop == 'destroy') {
				destroyCallback = prop;
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
			destroyCallback = destroyCallback,
			validateCallback = validateCallback,
		)
	},

	launchURL: function(cURL /*String*/, bNewFrame /*boolean*/) {
		let target = bNewFrame ? '_blank' : '_self';
		window.open(cURL, target, 'noreferrer');
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

const color = {
	transparent: ["T"],
	black: ["G", 0],
	white: ["G", 1],
	red: ["RGB", 1, 0, 0],
	green: ["RGB", 0, 1, 0],
	blue: ["RGB", 0, 0, 1],
	cyan: ["CMYK", 1, 0, 0, 0],
	magenta: ["CMYK", 0, 1, 0, 0],
	yellow: ["CMYK", 0, 0, 1, 0],
	dkGray: ["G", 0.25],
	gray: ["G", 0.5],
	ltGray: ["G", 0.75] ,
};

const border = {
	s: "solid",
	b: "beveled",
	d: "dashed",
	i: "inset",
	u: "underline",
}

function thermoM(text /*String*/, someFlag /*boolean*/) {
	console.log(text);
}


console.println = console.log;
console.show = console.log;

AdapterParsePopUpMenu = function (aParams, resolve) {
	let menu = []
	let currentEvent = event;
	for (let i = 0; i < aParams.length; i++) {
		if (aParams[i] === undefined) {
			continue;
		} else if (aParams[i].cName == '-') {
			menu.push({
				type: ContextMenu.DIVIDER,
			});
		} else {
			if (aParams[i].oSubMenu) {
				menu.push({
					text: aParams[i].cName.replace('&&', '&amp;'),
					enabled: aParams[i].bEnabled,
					sub: AdapterParsePopUpMenu(aParams[i].oSubMenu, resolve),
				});
			} else {
				let returnVal = aParams[i].cReturn ? aParams[i].cReturn : aParams[i].cName;
				let item = {
					text: aParams[i].cName.replace('&&', '&amp;'),
					enabled: aParams[i].bEnabled,
					events: {
						'click': function (event) {
							if (currentEvent && currentEvent.target && currentEvent.target.contextTransfers) {
								for (let targetProp of currentEvent.target.contextTransfers) {
									event.target[targetProp] = currentEvent.target[targetProp];
								}
							}
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
	SheetVersion: "v13.1.13",
	SpellsOnly: false,
};
this.path = "./index.html";
this.documentFileName = "index.html";

this.getField = function (field /*str|AdapterClassFieldReference*/) /*AdapterClassFieldReference|AdapterClassImageReference|null*/ {
	if (field.constructor.name == 'AdapterClassFieldReference') {
		return field;
	}
	if (field.startsWith('SaveIMG.') && (field != 'SaveIMG.Patreon')) {
		return adapter_helper_get_saveimg_field(field.replace(/^SaveIMG\./, ''))
	}
	let field_id = adapter_helper_convert_fieldname_to_id(field);
	if (field_id.endsWith('.alphabeta')) {
		// for Stealth Disadv/Stealth_Disadv (see Functions2:7633), TODO find out what to do with this.
		field_id = field_id.replace(/.alphabeta$/, '');
	}
	return adapter_helper_reference_factory(field_id);
};

this.calculateNow = function () {
	initialCalculationEvents();
};

this.resetForm = function (aFields = null /*String|[String]|null*/) {
	if (!aFields) {
		throw "aFields is null in resetForm";
	}
	if (typeof aFields === 'string') {
		aFields = [aFields];
	}
	let elementAdapter, element_type, changed;
	for (let field of aFields) {
		try {
			elementAdapter = adapter_helper_reference_factory(adapter_helper_convert_fieldname_to_id(field));
		} catch (error) {
			console.log("Error resetting fields: ", field);
			return;
		}
		for (let element of elementAdapter.html_elements) {
			element_type = element.getAttribute('type');
			changed = false;
			if ((element_type == 'text') | (element_type == 'number')) {
				if ('default' in element.dataset) {
					if (element.value != element.dataset.default) {
						changed = true;
					}
					element.value = element.dataset.default;
				} else {
					console.log("element without default value: '" + element.id + "', resetting to empty");
					if (element.value != "") {
						changed = true;
					}
					element.value = "";
				}
			}
			else if (element_type == 'checkbox') {
				if ('default' in element.dataset) {
					let defaultBool = (element.dataset.default == 'true') ? true : false;
					if (element.checked != defaultBool) {
						changed = true;
					}
					element.checked = defaultBool;
				} else {
					console.log("element without default value: '" + element.id + "', resetting to false");
					if (element.checked) {
						changed = true;
					}
					element.checked = false;
				}
			}
			else {
				if ('default' in element.dataset) {
					if (element.value != element.dataset.default) {
						changed = true;
					}
					element.value = element.dataset.default;
				} else {
					console.log("element without default value: '" + element.id + "', resetting to empty");
					if (element.value != "") {
						changed = true;
					}
					element.value = "";
				}
			}
			if (changed) {
				element.dispatchEvent(new Event('change'));
			}
		}
	}
};


this.exportDataObject = function(data /*Object*/) {
	//creating an invisible element
	var element = document.createElement('a');
	element.setAttribute('href', "documents/" + data.cName);
	element.setAttribute('download', data.cName);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	// window.location.href = "documents/" + data.cName;
}


this.getTemplate = function(cName /*String*/) /*AdapterClassPage*/ {
	return new AdapterClassPage(cName);
}


this.deletePages = function(nStart /*Number*/, nEnd /*Number*/) {
	if (nEnd) {
		throw "deletePages not implemented for multiple pages, nEnd specified:", nEnd;
	}
	console.log("Deleting page ", nStart);
	let page = globalPageInventory[nStart];
	// remove page
	rootDeletePage(nStart);
	// remove button
	let buttonContainerElement = document.getElementById('button-container');
	for (let button of buttonContainerElement.children) {
		if (button.dataset.page == page.id) {
			buttonContainerElement.removeChild(button);
		}
	}
}


this.getPrintParams = function() /*Object*/ {
	return {
		constants: {
			interactionLevel: {full: 0},
			duplexTypes: {
				DuplexFlipLongEdge: 0,
				Simplex: 1,
			}
		}
	}
}


this.print_ = function(printOptions /*Object*/) {
	let pagesIndexesToPrint = [];
	printOptions.printRange.forEach((printEntry) => {
		if (!pagesIndexesToPrint.includes(printEntry[0])) {
			pagesIndexesToPrint.push(printEntry[0]);
		}
	});

	let pageIDsToHide = [];
	let lastToPrint = null;
	for (let index in globalPageInventory) {
		if (!pagesIndexesToPrint.includes(Number(index))) {
			pageIDsToHide.push(globalPageInventory[index].id);
		} else {
			lastToPrint = globalPageInventory[index].id;
		}
	}

	let tempCssAddition = "@media print {\n";
	for (let pageID of pageIDsToHide) {
		tempCssAddition += "\t#" + pageID + " {display: none!important;}\n";
	}
	if (lastToPrint != null) {
		tempCssAddition += "\t#" + lastToPrint + " {break-after: avoid!important;page-break-after: avoid!important;}\n";
	}
	tempCssAddition += "}";

	let tempStyleSheet = document.createElement("style");
	tempStyleSheet.innerText = tempCssAddition;
	document.head.appendChild(tempStyleSheet);

	window.print();

	tempStyleSheet.remove();
}


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


const util = {
	readFileIntoStream: async function(cDIPath /*String*/, bEncodeBase64 /*bool*/) /*AdapterClassReadStream*/ {
		if (bEncodeBase64) {
			throw "readFileIntoStream with bEncodeBase64 not implemented.";
		}
		if (cDIPath) {
			throw "readFileIntoStream with cDIPath not implemented.";
		}
		return new Promise((resolve, reject) => {
			let elm = document.createElement('input');
			elm.style.visibility='hidden';
			elm.setAttribute('type', 'file');
			elm.addEventListener('change', function () {
				if (elm.files && elm.files.length > 0) {
					var file = elm.files[0];
					var reader = new FileReader();
					elm.value = '';
					reader.onload = function(e) {
						resolve(new AdapterClassReadStream(reader.result));
						elm.remove();
					};
				}
				reader.readAsText(file);
			});
			elm.click();
		});
	},

	stringFromStream: async function(oStream /*AdapterClassReadStream*/) /*String*/ {
		if (oStream.constructor.name != 'AdapterClassReadStream') {
			throw "stringFromStream not implemented for type " + oStream.constructor.name;
		}
		return await oStream.read();
	},

	printd: function(cFormat /*String|Number*/, oDate /*Date*/, bXFAPicture /*boolean*/) /*String*/ {
		if (typeof cFormat == 'Number') {
			throw "printd with Number-type cFormat not implemented";
		}
		if (bXFAPicture) {
			throw "printd with bXFAPicture not implemented";
		}
		return (
			cFormat
			.replace(/(?<!\\)mmmm/g, '#$$$$#')
			.replace(/(?<!\\)mmm/g, '#$$$#')
			.replace(/(?<!\\)mm/g, ("0" + (oDate.getMonth() + 1)).slice(-2))
			.replace(/(?<!\\)m/g, String(oDate.getMonth() + 1))
			.replace(/(?<!\\)dddd/g, '#%%%%#')
			.replace(/(?<!\\)ddd/g, '#%%%#')
			.replace(/(?<!\\)dd/g, ("0" + oDate.getDate()).slice(-2))
			.replace(/(?<!\\)d/g, String(oDate.getDate()))
			.replace(/(?<!\\)yyyy/g, String(oDate.getFullYear()))
			.replace(/(?<!\\)yy/g, String(oDate.getFullYear()).slice(-2))
			.replace(/(?<!\\)HH/g, ("0" + oDate.getHours()).slice(-2))
			.replace(/(?<!\\)H/g, String(oDate.getHours()))
			.replace(/(?<!\\)hh/g, ("0" + (((oDate.getHours() + 11) % 12) - 1)).slice(-2))
			.replace(/(?<!\\)h/g, String(((oDate.getHours() + 11) % 12) - 1))
			.replace(/(?<!\\)ss/g, ("0" + oDate.getSeconds()).slice(-2))
			.replace(/(?<!\\)s/g, String(oDate.getSeconds()))
			.replace(/(?<!\\)tt/g, (oDate.getHours() >=12 ? 'pm' : 'am'))
			.replace(/(?<!\\)t/g, (oDate.getHours() >=12 ? 'p' : 'a'))
			.replace(/#$$$$#/g, oDate.toString().split(' ')[1])
			.replace(/#$$$#/g, oDate.toString().split(' ')[1].slice(0, 3))
			.replace(/#%%%%#/g, oDate.toString().split(' ')[0])
			.replace(/#%%%#/g, oDate.toString().split(' ')[0].slice(0, 3))
		);
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
		} else if ((typeof this[i]) == 'boolean') {
			str += this[i] ? "true" : "false";
		} else if ((typeof this[i]) == "object") {
			str += adapter_helper_recursive_toSource(this[i]);
		} else {
			throw "unsupported element type in array toSource: " + (typeof this[i]);
		}
	}
	return "[" + str + "]";
}


Object.defineProperty(Object.prototype, 'toSource', {
	value: function() {
		return adapter_helper_recursive_toSource(this);
	},
	enumerable: false,
});


// Adapter classes

class AdapterClassFieldReference {
	constructor(html_elements /*[HTMLElement]*/) {
		this.html_elements = html_elements;
	}

	get submitName() /*String*/ {
		let submitName_ = this.html_elements[0].dataset.submit_name;
		if (submitName_ == undefined) {
			return "";
		}
		if (
			!isNaN(submitName_)
			&& this.html_elements[0].classList.contains('submitnumber')
		) {
			return Number(submitName_);
		}
		return submitName_;
	}

	set submitName(new_submitName /*String*/) {
		this.html_elements[0].dataset.submit_name = new_submitName;
	}

	get name() /*String*/ {
		let id_ = this.html_elements[0].id.replace(/#\d$/, '');
		if (!id_) {
			return "";
		}
		return adapter_helper_convert_id_to_fieldname(id_);
	}

	get value() /*String|Number|Boolean*/ {
		let value_;
		if (['input', 'select', 'textarea'].includes(this.html_elements[0].tagName.toLowerCase())) {
			value_ = this.html_elements[0].value;
		} else {
			value_ = this.html_elements[0].getAttribute('value');
		}
		if (value_ === undefined || value_ == null) {
			return "";
		}
		if (
			!isNaN(value_)
			&& (
				(
					this.html_elements[0].hasAttribute('type')
					&& this.html_elements[0].getAttribute('type').toLowerCase() == 'number'
				)
				|| this.html_elements[0].classList.contains('isNumber')
			)
		) {
			return Number(value_);
		}
		if (value_ == 'true') {
			return true;
		}
		if (value_ == 'false') {
			return false;
		}
		if (this.html_elements[0].classList.contains('die')) {
			return ('' + value_).replace(/^\s*d/, '').replace(/\s*[+-]\s*\d+\s*$/, '')
		}
		return value_;
	}

	set value(new_value /*String|[String]*/) {
		if ((new_value != null) && (new_value.constructor === Array)) {
			new_value = new_value.join(',');
		}
		let changed = false;
		if (['input', 'select', 'textarea'].includes(this.html_elements[0].tagName.toLowerCase())) {
			if (this.html_elements[0].value != new_value) {
				changed = true;
			}
			if (
				(this.html_elements[0].tagName.toLowerCase() == 'input')
				&& (this.html_elements[0].getAttribute('type')?.toLowerCase() == 'number')
				&& isNaN(new_value)
			) {
				// try to strip a unit from the number
				new_value = new_value.replace(/^\s*(-?\d+\.?\d*)\s*[a-zA-Z]+$/, '$1');
			}
			this.html_elements[0].value = new_value;
		} else {
			if (this.html_elements[0].getAttribute('value') != new_value) {
				changed = true;
			}
			this.html_elements[0].setAttribute('value', new_value);
		}
		if (changed) {
			this.html_elements[0].dispatchEvent(new Event('change'));
		}
	}

	get userName() /*str*/ {
		let userName_ = this.html_elements[0].getAttribute('aria-label');
		if (!userName_) {
			return "";
		}
		return userName_;
	}

	set userName(new_userName /*str*/) {
		this.html_elements[0].setAttribute('aria-label', new_userName);
	}

	get display() /*int*/ {
		let visibility = this.html_elements[0].style.visibility;
		if (visibility === null) {
			visibility = 'visible';
		}
		let nonPrintable = this.html_elements[0].classList.contains('nonprintable');
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
			for (let element of this.html_elements) {
				element.style.visibility = 'hidden';
			}
		} else {
			for (let element of this.html_elements) {
				element.style.visibility = 'visible';
			}
			if (newDisplay == display.noPrint) {
				for (let element of this.html_elements) {
					element.classList.add('nonprintable');
				}
			} else {
				for (let element of this.html_elements) {
					element.classList.remove('nonprintable');
				}
			}
			for (let element of this.html_elements) {
				element.dispatchEvent(new Event('displayShow'));
			}
		}
	}

	get type() /*str*/ {
		switch (this.html_elements[0].tagName.toLowerCase()) {
			case 'button':
				return 'button';
			case 'select':
				return 'combobox';
			case 'input':
				switch (this.html_elements[0].type) {
					case 'button':
						return 'button';
					case 'checkbox':
						return 'checkbox';
					case 'radio':
						return 'radiobutton';
					default:
						if (this.html_elements[0].getAttribute('list')) {
							return 'combobox';
						}
						return 'text';
				}
			default:
				return 'text';
		}
	}

	get currentValueIndices() /*int*/ {
		if (this.html_elements[0].tagName.toLowerCase() == 'select') {
			return this.html_elements[0].selectedIndex;
		} else if ((this.html_elements[0].tagName.toLowerCase() == 'input') && (this.html_elements[0].getAttribute('list'))) {
			let selectedIndex = -1;
			let value = this.html_elements[0].value.trim().toLowerCase();
			let counter = 0;
			for (let optionElement of this.html_elements[0].list.options) {
				if (value == optionElement.innerText.trim().toLowerCase()) {
					selectedIndex = counter;
					break;
				}
				counter += 1;
			}
			return selectedIndex;
		} else {
			throw "get currentValueIndices on non-combobox " + String(this.html_elements[0].id);
		}
	}

	set currentValueIndices(newIndex /*int*/) {
		if (this.html_elements[0].tagName.toLowerCase() == 'select') {
			this.html_elements[0].selectedIndex = newIndex;
		} else if ((this.html_elements[0].tagName.toLowerCase() == 'input') && (this.html_elements[0].getAttribute('list'))) {
			let listElement = document.getElementById(this.html_elements[0].getAttribute('list'));
			if (listElement) {
				if (newIndex == -1) {
					this.html_elements[0].value = "";
				} else {
					this.html_elements[0].value = listElement.children[newIndex].value;
				}
			} else {
				throw "Cannot find datalist element " + String(this.html_elements[0].getAttribute('list'));
			}
		} else {
			throw "set currentValueIndices on non-combobox " + String(this.html_elements[0].id);
		}
	}

	get page() /*Number*/ {
		if (this.html_elements[0].dataset.page == undefined) {
			return -1;
		}
		return Number(this.html_elements[0].dataset.page);
	}

	get rect() /*[Number]*/ {
		let boundingRect = adapter_helper_get_rect(this.html_elements[0]);
		return [
			boundingRect.left * 3.0 / 4.0,
			boundingRect.top * 3.0 / 4.0,
			boundingRect.right * 3.0 / 4.0,
			boundingRect.bottom * 3.0 / 4.0,
		]
	}

	set rect(newRect /*[Number]*/) {
		let currentBoundingRect = adapter_helper_get_rect(this.html_elements[0]);
		let leftDiff = (newRect[0] * 4 / 3) - currentBoundingRect.left;
		let topDiff = (newRect[1] * 4 / 3) - currentBoundingRect.top;
		let diff = {
			left: leftDiff,
			top: topDiff,
			width: (newRect[2] * 4 / 3) - currentBoundingRect.right - leftDiff,
			height: (newRect[3] * 4 / 3) - currentBoundingRect.bottom - topDiff,
		}
		let currentVal, valueMatch;
		for (let styleType of Object.keys(diff)) {
			if (Math.abs(diff[styleType]) > 0.01) {
				currentVal = this.html_elements[0].style[styleType];
				valueMatch = currentVal.match(/^\s*(-?\d+\.?\d*)\s*px\s*$/);
				if (valueMatch == null) {
					throw (
						"Tried to change element style '"
						+ styleType
						+ "' for element '"
						+ this.html_elements[0].id
						+ "', but that style is not defined."
					);
				}
				this.html_elements[0].style[styleType] = "" + (Number(valueMatch[1]) + diff[styleType]) + "px";
			}
		}
	}

	set fillColor(color /*[char, ...]*/ ) {
		let bgColor = adapter_helper_convert_colour(color);
		for (let el of this.html_elements) {
			el.style.backgroundColor = bgColor;
		}
	}

	set lineWidth(width /*Number*/ ) {
		for (let el of this.html_elements) {
			el.style.borderWidth = String(width) + 'px';
		}
	}

	set strokeColor(color /*[char, ...]*/ ) {
		let bgColor = adapter_helper_convert_colour(color);
		for (let el of this.html_elements) {
			el.style.borderColor = bgColor;
		}
	}

	set borderStyle(style /*String*/ ) {
		let borderStyle = null;
		if (['solid', 'beveled'].includes(style)) {
			borderStyle = 'solid';
		}
		if (borderStyle == null) {
			throw "Setting unimplemented border style:", style;
		}
		for (let el of this.html_elements) {
			el.style.borderStyle = borderStyle;
		}

	}

	get setVal() /*String*/ {
		let setVal_ = this.html_elements[0].dataset.setVal;
		if (setVal_ == undefined) {
			return "";
		}
		return setVal_;
	}

	set setVal(new_setVal /*String*/) {
		this.html_elements[0].dataset.setVal = new_setVal;
	}

	get defaultValue() /*String*/ {
		let defaultValue = this.html_elements[0].dataset.default;
		if (defaultValue == undefined) {
			throw "calling defaultValue when none is set for " + this.html_elements[0].id;
		}
		return defaultValue;
	}

	toSource() /*str*/ {
		return this.html_elements[0].toSource();
	}

	isBoxChecked(nWidget /*int*/) /*Number*/ {
		if (this.html_elements[nWidget].checked) {
			return 1;
		}
		else {
			return 0;
		}
	}

	checkThisBox(nWidget /*int*/, bCheckIt = true /*boolean*/) {
		let changed = false;
		if (Number(this.html_elements[nWidget].checked) != Number(bCheckIt)) {
			changed = true;
		}
		this.html_elements[nWidget].checked = bCheckIt;
		if (changed) {
			this.html_elements[nWidget].dispatchEvent(new Event('click'));
		}
	}

	getItems() /*[str|[str;2]]*/ {
		if ((this.html_elements[0].tagName.toLowerCase() != 'input') || !this.html_elements[0].hasAttribute('list')) {
			throw "called getItems on unsupported element type: " + this.html_elements[0].tagName.toLowerCase();
		}
		let listElement = document.getElementById(this.html_elements[0].getAttribute('list'));
		let items = [];
		for (let optionElement of listElement.children) {
			let id_ = optionElement.value;
			let value = optionElement.innerText;
			if (id_ == value) {
				items.push(id_);
			} else {
				if ((value.trim() == "") && (id_.trim() != "")) {
					throw "getItems found empty value for nonempty id in option for", listElement;
				}
				items.push([id_, value]);
			}
		}
		return items;
	}

	setItems(oArray /*[str|[str;2]]*/) {
		if ((this.html_elements[0].tagName.toLowerCase() != 'input') || !this.html_elements[0].hasAttribute('list')) {
			throw "called setItems on unsupported element type: " + this.html_elements[0].tagName.toLowerCase();
		}
		let listElement = document.getElementById(this.html_elements[0].getAttribute('list'));
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
		this.html_elements[0].style.backgroundImage = "url(" + icon + ")";
		this.html_elements[0].dataset.customUrl = false;
	}

	buttonImportIcon(cPath /*String*/, nPage /*Number*/) {
		if (cPath) {
			throw "buttonImportIcon with cPath not implemented.";
		}
		if (nPage) {
			throw "buttonImportIcon with nPage not implemented.";
		}
		let elm = document.createElement('input');
		elm.style.visibility='hidden';
		elm.setAttribute('type', 'file');
		let thisElement = this.html_elements[0];
		elm.addEventListener('change', function () {
			if (elm.files && elm.files.length > 0) {
				let reader = new FileReader();
				reader.onload = function(e) {
					thisElement.style.backgroundImage = "url(" + reader.result + ")";
					thisElement.dataset.customUrl = true;
				};
				reader.readAsDataURL(elm.files[0]);
			}
			elm.remove();
		});
		elm.click();
	}

	buttonGetCaption() /*String*/ {
		return this.html_elements[0].innerText;
	}

	buttonSetCaption(cCaption /*String*/, nFace /*Number*/) {
		for (let element of this.html_elements) {
			element.innerText = cCaption;
		}
	}

	setAction(actionType /*String*/, actionStr /*String*/) {
		if (actionStr == '') {  // do nothing
			return;
		}
		if (actionType != 'Calculate') {  // do nothing
			throw "Unknown action type for setAction: " + actionType;
		}
		// TODO: remove is_known stuff when we're confident enough in the change rule matching
		let is_known = false;
		for (let abi of ['Cha', 'Str', 'Dex', 'Con', 'Wis', 'Int', 'HoS']) {
			for (let pattern of [
				"event.value = Math.max(1, What('$$ABI$$ Mod'));",
				"event.value = What('$$ABI$$ Mod');",
				"event.value = Math.max(1, tDoc.getField('$$ABI$$ Mod').value);",
				"event.value = 1 + What('$$ABI$$ Mod');",
				"event.value = Math.max(2, Number(What('$$ABI$$ Mod')) * 2);",
				"event.value = What('$$ABI$$ Mod') + 5;",
				"event.value = What('$$ABI$$ Mod') + 6;",
				"event.value = Math.max(1 + 0, What('$$ABI$$ Mod') + 0);",
				"event.value = Math.max(1 + 1, What('$$ABI$$ Mod') + 1);",
				"event.value = Math.max(1 + 2, What('$$ABI$$ Mod') + 2);",
				"event.value = Math.max(1 + 3, What('$$ABI$$ Mod') + 3);",
				"event.value = Math.max(1 + 4, What('$$ABI$$ Mod') + 4);",
			]) {
				if (pattern.replace('$$ABI$$', abi) == actionStr) {
					is_known = true;
				}
			}
		}
		if (
			[
				"var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = What('Limited Feature Used ' + FieldNmbr); var DCmod = Number(usages) * 5; event.value = (isNaN(Number(usages)) || usages === '') ? 'DC  ' : 'DC ' + Number(10 + DCmod);",
				'event.value = "As a reaction when a ranged weapon attack hits me while I\'m wearing these gloves, I can reduce the damage by 1d10 + " + Number(What("Dex Mod")) + " (my Dexterity modifier). This only works if I have a free hand. If I reduce the damage to 0, I can catch the missile if it is small enough for me to hold in that hand.";',
				"event.value = How('Proficiency Bonus');",
				"event.value = Number(How('Proficiency Bonus'))*2",
				"event.value = Number(How('Proficiency Bonus'));",
				"event.value = Math.max(1, tDoc.getField('Proficiency Bonus').submitName);",
				"event.value = 'As a reaction when I take damage from a creature that is within 10 ft of me, I can have it take 2d8 force damage and push it up to 10 ft away from me. If it succeeds a Strength save DC ' + (8 + Number(How('Proficiency Bonus')) + Number(What('Int Mod'))) + ' (8 + Prof Bonus + Int mod), it halves the damage and isn't pushed. I can do this my Proficiency Bonus per long rest. [+1 Intelligence]';",
				"event.value = 'As a reaction when I take damage from a creature that is within 10 ft of me, I can have it take 2d8 force damage and push it up to 10 ft away from me. If it succeeds a Strength save DC ' + (8 + Number(How('Proficiency Bonus')) + Number(What('Wis Mod'))) + ' (8 + Prof Bonus + Wis mod), it halves the damage and isn't pushed. I can do this my Proficiency Bonus per long rest. [+1 Wisdom]';",
				"event.value = 'As a reaction when I take damage from a creature that is within 10 ft of me, I can have it take 2d8 force damage and push it up to 10 ft away from me. If it succeeds a Strength save DC ' + (8 + Number(How('Proficiency Bonus')) + Number(What('Cha Mod'))) + ' (8 + Prof Bonus + Cha mod), it halves the damage and isn't pushed. I can do this my Proficiency Bonus per long rest. [+1 Charisma]';",
				"event.value = '0 m';",
				"event.value = '0 ft';",
				"var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = What('Limited Feature Used ' + FieldNmbr); var useMult = isNaN(Number(usages)) || !Number(usages) ? 1 : Math.pow(10, usages); var charLvl = What('Character Level'); var total = (Math.round(charLvl * useMult) * 10); total = total > 1000000 ? total / 1000000 + 'M' : total > 1000 ? total / 1000 + 'k' : total; event.value = total + ' gp';",
				"event.value = Math.floor(classes.known['dawnforgedcast-alchemist'].level/2) + What('Int Mod');",
				"event.value = Math.floor(classes.known['dawnforgedcast-alchemist'].level/2) + 3 + tDoc.getField('Int Mod').value;",
				"event.value = ''; event.target.setAction('Calculate', ''); event.target.submitName = '';",
				"event.value = !classes.known.warlock ? '' : (1 + classes.known.warlock.level) + 'd6';",
				"event.value = !event.value || event.value == 'Resets to 1 after ' ? 1 : event.value;",
				"event.value = event.value.toString().replace(/ ?per ?/i, '');",
				"event.value = 'I learn two conducting techniques of my choice from those available to the College of the Maestro. The saving throw DC for this is ' + (8 + How('Proficiency Bonus') + What('Cha Mod')) + ' (8 + proficiency bonus + Cha mod). I gain one bardic inspiration die (d6), which I regain when I finish a short rest.';",
				"event.value = 'I can spend 10 minutes inspiring up to 6 friendly creatures within 30 feet who can see or hear and can understand me. Each gains lvl (' + What('Character Level') + ') + Cha mod (' + What('Cha Mod') + \") temporary hit points. One can't gain temporary hit points from this feat again until after a short rest.\";",
				"event.value = \"I can ably create written ciphers that others can't decipher unless I teach them, they succeed on an Intelligence check DC \" + (What('Int') + Number(How('Proficiency Bonus'))) + ' (Intelligence score + proficiency bonus), or they use magic to decipher it. I learn three languages of my choice. [+1 Intelligence]';",
				"event.value = 'I learn two maneuvers of my choice from those available to the Battle Master (2nd page \"Choose Feature\" button). The saving throw DC for this is ' + (8 + Number(How('Proficiency Bonus')) + Math.max(Number(What('Str Mod')), Number(What('Dex Mod')))) + ' (8 + proficiency bonus + Str/Dex mod). I gain one superiority die (d6), which I regain when I finish a short rest.';",
				"event.value = 'I can use my Breath Weapon to roar instead. Chosen creatures within 30 ft that see and hear me must make a DC ' + (8 + Number(How('Proficiency Bonus')) + Number(What('Cha Mod'))) + ' Wis save (8 + Prof Bonus + Cha mod) or be frightened of me for 1 min. A target can repeat the save whenever it takes damage. [+1 Str, Con, or Cha]';",
				'event.value = "As a bonus action, I can use Bolstering Rally on myself or an ally within 30 ft that I can see and can see or hear me. They gain 1d8 + " + (Number(How("Proficiency Bonus")) + Number(What("Con Mod"))) + " temporary hit points (1d8 + proficiency bonus + Constitution modifier). I can do this my proficiency bonus per long rest. [+1 Constitution]";',
				'event.value = "As a bonus action, I can use Bolstering Rally on myself or an ally within 30 ft that I can see and can see or hear me. They gain 1d8 + " + (Number(How("Proficiency Bonus")) + Number(What("Wis Mod"))) + " temporary hit points (1d8 + proficiency bonus + Wisdom modifier). I can do this my proficiency bonus per long rest. [+1 Wisdom]";',
				'event.value = "As a bonus action, I can use Bolstering Rally on myself or an ally within 30 ft that I can see and can see or hear me. They gain 1d8 + " + (Number(How("Proficiency Bonus")) + Number(What("Cha Mod"))) + " temporary hit points (1d8 + proficiency bonus + Charisma modifier). I can do this my proficiency bonus per long rest. [+1 Charisma]";',
				'event.value = "Once per turn, when I hit a creature with a weapon attack, I can have it make a Wisdom save DC " + (8 + Number(How("Proficiency Bonus")) + Number(What("Int Mod"))) + " (8 + Prof Bonus + Int mod) or be frightened of me until my next turn ends. On a successful save, the target has disadv. on its next attack before its next turn ends. I can do this my proficiency bonus per long rest. [+1 Int]";',
				'event.value = "Once per turn, when I hit a creature with a weapon attack, I can have it make a Wisdom save DC " + (8 + Number(How("Proficiency Bonus")) + Number(What("Wis Mod"))) + " (8 + Prof Bonus + Wis mod) or be frightened of me until my next turn ends. On a successful save, the target has disadv. on its next attack before its next turn ends. I can do this my proficiency bonus per long rest. [+1 Wis]";',
				'event.value = "Once per turn, when I hit a creature with a weapon attack, I can have it make a Wisdom save DC " + (8 + Number(How("Proficiency Bonus")) + Number(What("Cha Mod"))) + " (8 + Prof Bonus + Cha mod) or be frightened of me until my next turn ends. On a successful save, the target has disadv. on its next attack before its next turn ends. I can do this my proficiency bonus per long rest. [+1 Cha]";',
			].includes(actionStr)
		) {
			is_known = true;
		}
		if (!is_known) {
			throw (
				"setAction called for '" + actionType + "', with unknown non-empty value '" + actionStr + "'. "
				+ "Make sure the code analyser above is functioning properly, then add it to whitelist."
			);
		}
		let accessedFieldIds = getAccessedFieldIds(actionStr);
		let currentFieldId = this.html_elements[0].id;
		let changeEventName;
		for (let fieldID of accessedFieldIds) {
			changeEventName = fieldID + '_change';
			if (!(changeEventName in EventType)) {
				throw "Could not find change event for field id " + fieldID;
			}
			eventManager.add_listener(EventType[changeEventName], function() {
				let theElement = document.getElementById(currentFieldId);
				let theElementAdapter = new AdapterClassFieldReference([theElement]);
				let theReturnValue = theElementAdapter.value;
				eval(actionStr.replace("event.target", "theElementAdapter").replace("event.value", "theReturnValue").replace("isn't", "isn&apos;t"));
				theElementAdapter.value = theReturnValue.replace("&apos;", "'");
			})
		}
	}

	setFocus() {
		let parent = this.html_elements[0];
		while (!parent.classList.contains('page')) {
			parent = parent.parentElement;
		}
		let page_id = parent.id;

		let buttonContainer = document.getElementById('button-container');
		for (let child of buttonContainer.children) {
			if (child.dataset.page == page_id) {
				child.click();
			}
		}
		this.html_elements[0].focus();
	}

	deleteRemVal() {
		delete this.html_elements[0].dataset.remVal;
	}

	getArray() /*[AdapterClassFieldReference]*/ {
		var childFields = [];
		for (let element of this.html_elements) {
			childFields.push(new AdapterClassFieldReference([element]));
		}
		return childFields;
	}

	getItemAt(nIdx /*Number*/, bExportValue /*Boolean*/) /*String*/{
		if ((this.html_elements[0].tagName.toLowerCase() == 'input') && this.html_elements[0].hasAttribute('list')) {
			throw "getItemAt for input-list type not implemented yet: " + this.html_elements[0].id;
		} else if (this.html_elements[0].tagName.toLowerCase() == 'select') {
			if (nIdx == -1) {
				nIdx = this.html_elements[0].options.length - 1;
			}
			let option = this.html_elements[0].options[nIdx];
			if (option) {
				if (bExportValue) {
					return option.getAttribute('value');
				} else {
					return option.innerText;
				}
			} else {
				throw "no option with index", nIdx, "for element", this.html_elements[0].index;
			}
		} else {
			throw "getItemAt called for unsupported type: " + this.html_elements[0].tagName.toLowerCase() + " (" + this.html_elements[0].id + ")";
		}
	}

	browseForFileToSubmit() {
		let elm = document.createElement('input');
		elm.style.visibility='hidden';
		elm.setAttribute('type', 'file');
		let thisElement = this.html_elements[0];
		elm.addEventListener('change', function () {
			if (elm.files && elm.files.length > 0) {
				var tmpPath = URL.createObjectURL(elm.files[0])
				thisElement.value = tmpPath;
				if (thisElement.dataset.tempUrl) {
					URL.revokeObjectURL(thisElement.dataset.tempUrl);
				}
				thisElement.dataset.tempUrl = tmpPath;

			}
			elm.remove();
		});
		elm.click();
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


class AdapterClassReadStream {
	constructor(fileContent /*String*/) {
		this.fileContent = fileContent;
	}

	async read() /*string*/ {
		return this.fileContent;
	}
}

class AdapterClassPage {
	constructor(type /*String*/, prefix = null /* String|null */) {
		if (type == 'pstat') {
			this.page_ = 'pages/page_stats.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Stats";
			this.buttonIDPrefix_ = 'tabbuttonstat';
			this.pageIdPrefix = 'pstat';
			this.buttonFollower = 'tabbuttonfeaq';
			this.isTempl = false;
		} else if (type == 'pfeaq') {
			this.page_ = 'pages/page_features_equipment.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Features & Equipment";
			this.buttonIDPrefix_ = 'tabbuttonfeaq';
			this.pageIdPrefix = 'pfeaq';
			this.buttonFollower = 'tabbuttonnofe';
			this.isTempl = false;
		} else if (type == 'pnofe') {
			this.page_ = 'pages/page_notes_feats.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Notes & Feats";
			this.buttonIDPrefix_ = 'tabbuttonnofe';
			this.pageIdPrefix = 'pnofe';
			this.buttonFollower = 'tabbuttonback';
			this.isTempl = false;
		} else if ((type == 'ASoverflow') || type.startsWith('povertempl')) {
			this.page_ = 'pages/page_overflow.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Overflow";
			this.buttonIDPrefix_ = 'tabbuttonover';
			this.pageIdPrefix = 'povertempl';
			this.buttonFollower = 'tabbuttonback';
			this.isTempl = false;
		} else if (type == 'pback') {
			this.page_ = 'pages/page_appearance_background.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Background";
			this.buttonIDPrefix_ = 'tabbuttonback';
			this.pageIdPrefix = 'pback';
			this.buttonFollower = 'tabbuttoncomp';
			this.isTempl = false;
		} else if ((type == 'AScomp') || type.startsWith('pcomptempl')) {
			this.page_ = 'pages/page_companion.html';
			this.prefix_ = (prefix == null) ? 'P#.AScomp.': prefix;
			this.buttonPrefix_ = "Companion";
			this.buttonIDPrefix_ = 'tabbuttoncomp';
			this.pageIdPrefix = 'pcomptempl';
			this.buttonFollower = 'tabbuttonnote';
			this.isTempl = (type == 'pcomptempl') ? false: true;
		} else if ((type == 'WSfront') || type.startsWith('pwildtempl')) {
			this.page_ = 'pages/page_wildshape.html';
			this.prefix_ = (prefix == null) ? 'P#.WSfront.': prefix;
			this.buttonPrefix_ = "Wildshape";
			this.buttonIDPrefix_ = 'tabbuttonwild';
			this.pageIdPrefix = 'pwildtempl';
			this.buttonFollower = 'tabbuttonnote';
			this.isTempl = (type == 'pwildtempl') ? false: true;
		} else if (type == 'pnote') {
			this.page_ = 'pages/page_notes.html';
			this.prefix_ = (prefix == null) ? 'P5.ASnotes.': prefix;
			this.buttonPrefix_ = "Notes";
			this.buttonIDPrefix_ = 'tabbuttonnote';
			this.pageIdPrefix = 'pnote';
			this.buttonFollower = 'tabbuttonrefe';
			this.isTempl = false;
		} else if ((type == 'SSfront') || type.startsWith('pspellstempl')) {
			this.page_ = 'pages/page_spells.html';
			this.prefix_ = (prefix == null) ? 'P#.SSfront.': prefix;
			this.buttonPrefix_ = "Spells";
			this.buttonIDPrefix_ = 'tabbuttonspel';
			this.pageIdPrefix = 'pspellstempl';
			this.buttonFollower = 'tabbuttonrefe';
			this.isTempl = (type == 'pspellstempl') ? false: true;
		} else if ((type == 'SSmore') || type.startsWith('pspelmotempl')) {
			this.page_ = 'pages/page_spells_more.html';
			this.prefix_ = (prefix == null) ? 'P#.SSmore.': prefix;
			this.buttonPrefix_ = "Spells";
			this.buttonIDPrefix_ = 'tabbuttonspmo';
			this.pageIdPrefix = 'pspelmotempl';
			this.buttonFollower = 'tabbuttonrefe';
			this.isTempl = (type == 'pspelmotempl') ? false: true;
		} else if (type == 'prefe') {
			this.page_ = 'pages/page_reference.html';
			this.prefix_ = (prefix == null) ? '': prefix;
			this.buttonPrefix_ = "Reference";
			this.buttonIDPrefix_ = 'tabbuttonrefe';
			this.pageIdPrefix = 'prefe';
			this.buttonFollower = null;
			this.isTempl = false;
		} else {
			throw "Unimplemented page template type:", type;
		}
		this.type = type;
		this.hidden_ = true;
	}

	get hidden() /*boolean*/ {
		return this.hidden_;
	}

	set hidden(newVal /*boolean*/) {
		throw "Unimplemented: setting hidden on template directly (add logic to add page)";
		this.hidden_ = newVal;
	}

	get name() /*String*/ {
		return this.type;
	}

	async spawn(nPage = 0 /*Number|null*/, bRename = true /*boolean*/, bOverlay = true /*boolean*/, oXObject = null /*Any*/) {
		// nPage (optional) The 0-based index of the page number after which or on which the new page will be created,
		//                  depending on the value of bOverlay. The default is 0.
		// bRename (optional) Specifies whether form fields on the page should be renamed. The default is true.
		// bOverlay (optional) If true (the default), the template is overlaid on the specified page.
		//                     If false, it is inserted as a new page before the specified page.
		//                     To append a page to the document,
		//                     set bOverlay to false and set nPage to the number of pages in the document.
		//                     Note: For certified documents or documents with “Advanced Form Features rights”),
		//                           the bOverlay parameter is disabled.
		//                           A template cannot be overlaid for these types of documents.
		// oXObject (optional, Acrobat 6.0) The value of this parameter is the return value of an earlier call to spawn.
		if (oXObject) {
			throw "Unimplemented: AdapterClassTemplate.spawn with oXObject";
		}
		if (bOverlay) {
			throw "Unimplemented: AdapterClassTemplate.spawn with bOverlay = true";
		}


		let index = 1;
		if (this.isTempl) {
			if (this.pageIdPrefix == 'pspelmotempl') {
				index += 1;
			}
			while (document.getElementById(this.pageIdPrefix + '_' + String(index)) != null) {
				index += 1;
			}
		}

		let prefix, buttonName;
		if (index == 1) {
			buttonName = this.buttonPrefix_;
		} else {
			buttonName = this.buttonPrefix_ + " (" + String(index) + ")";
		}
		if (!bRename) {
			prefix = "";
		} else {
			prefix = this.prefix_.replace('P#', 'P' + String(nPage));
		}

		let pageID = this.pageIdPrefix + ((this.isTempl) ? '_' + String(index) : '');
		let pageElement = document.getElementById(pageID);
		if (this.pageIdPrefix == 'povertempl' && pageElement != null) {
			editRecursive(pageElement, nPage, prefix="");
			insertIntoInventory(pageElement, nPage);
		} else {
			// insert page
			let pageWrapperElement = document.getElementById('page-wrapper');
			pageElement = document.createElement('div');
			pageElement.id = pageID;
			pageElement.className = 'page';
			pageElement.setAttribute('page-url', this.page_);
			pageElement.setAttribute('page-prefix', prefix);
			pageWrapperElement.appendChild(pageElement);
			await insertPage(pageID, nPage, prefix=prefix);
		}
		if (this.buttonIDPrefix_) {
			// insert button
			let buttonContainerElement = document.getElementById('button-container');
			let buttonElement = document.createElement('button');
			buttonElement.id = this.buttonIDPrefix_ + ((this.isTempl) ? '_' + String(index) : '');
			buttonElement.dataset.page = pageID;
			buttonElement.onclick = function() {openPage(this)};
			buttonElement.className = 'tablink';
			buttonElement.innerText = buttonName;
			buttonContainerElement.insertBefore(buttonElement, document.getElementById(this.buttonFollower));
		}
		await setSheetVersion();
	}
}


class AdapterClassBookmark {
	constructor() {}

	set color (newColor /*[char, ...]*/) {}
	set style (newColor /*Number*/) {}
}

// Other tdoc functions


this.bookmarkRoot = {
	children: [
		{
			children: [
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
				new AdapterClassBookmark(),
			],
		}
	],
};


// Current... adapters

class UserImportedFilesAdapter {
	constructor(args) {
		for (let arg in args) {
			this[arg] = args[arg];
		}
	}

	toSource() {
		let scrString = "new UserImportedFilesAdapter({";
		for (let file in this) {
			scrString += "\"" + adapter_helper_escape_string_for_toSource(file) + "\":\"" + adapter_helper_escape_string_for_toSource(this[file]) + "\",";
		}
		return scrString + "})";
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


let CurrentFeatureChoicesKeys = ['classes', 'background', 'background feature', 'race', 'feats', 'items', 'magic', 'bonus'];
class CurrentFeatureChoicesAdapter {
	constructor(args) {
		for (let arg of CurrentFeatureChoicesKeys) {
			this[arg] = (args[arg] === undefined) ? {} : args[arg];
		}
	}

	toSource() {
		let scrString = "new CurrentFeatureChoicesAdapter({";
		for (let key in this) {
			scrString += "'" + key + "':" + adapter_helper_recursive_toSource(this[key]) + ",";
		}
		return scrString + "})";
	}
}


class CurrentSourcesAdapter {
	constructor(
		firstTime,
		globalKnown,
		globalExcl,
		classExcl,
		classExclDefault,
		racesExcl,
		racesExclDefault,
		backgrExcl,
		backgrExclDefault,
		backFeaExcl,
		backFeaExclDefault,
		featsExcl,
		featsExclDefault,
		weapExcl,
		weapExclDefault,
		armorExcl,
		armorExclDefault,
		ammoExcl,
		ammoExclDefault,
		magicitemExcl,
		magicitemExclDefault,
		spellsExcl,
		spellsExclDefault,
		creaExcl,
		creaExclDefault,
		compExcl,
		compExclDefault,
		gearExcl,
		gearExclDefault
	) {
		this.firstTime = (firstTime === undefined) ? false : firstTime;
		this.globalKnown = (globalKnown === undefined) ? [] : globalKnown;
		this.globalExcl = (globalExcl === undefined) ? [] : globalExcl;
		this.classExcl = (classExcl === undefined) ? [] : classExcl;
		this.classExclDefault = (classExclDefault === undefined) ? [] : classExclDefault;
		this.racesExcl = (racesExcl === undefined) ? [] : racesExcl;
		this.racesExclDefault = (racesExclDefault === undefined) ? [] : racesExclDefault;
		this.backgrExcl = (backgrExcl === undefined) ? [] : backgrExcl;
		this.backgrExclDefault = (backgrExclDefault === undefined) ? [] : backgrExclDefault;
		this.backFeaExcl = (backFeaExcl === undefined) ? [] : backFeaExcl;
		this.backFeaExclDefault = (backFeaExclDefault === undefined) ? [] : backFeaExclDefault;
		this.featsExcl = (featsExcl === undefined) ? [] : featsExcl;
		this.featsExclDefault = (featsExclDefault === undefined) ? [] : featsExclDefault;
		this.weapExcl = (weapExcl === undefined) ? [] : weapExcl;
		this.weapExclDefault = (weapExclDefault === undefined) ? [] : weapExclDefault;
		this.armorExcl = (armorExcl === undefined) ? [] : armorExcl;
		this.armorExclDefault = (armorExclDefault === undefined) ? [] : armorExclDefault;
		this.ammoExcl = (ammoExcl === undefined) ? [] : ammoExcl;
		this.ammoExclDefault = (ammoExclDefault === undefined) ? [] : ammoExclDefault;
		this.magicitemExcl = (magicitemExcl === undefined) ? [] : magicitemExcl;
		this.magicitemExclDefault = (magicitemExclDefault === undefined) ? [] : magicitemExclDefault;
		this.spellsExcl = (spellsExcl === undefined) ? [] : spellsExcl;
		this.spellsExclDefault = (spellsExclDefault === undefined) ? [] : spellsExclDefault;
		this.creaExcl = (creaExcl === undefined) ? [] : creaExcl;
		this.creaExclDefault = (creaExclDefault === undefined) ? [] : creaExclDefault;
		this.compExcl = (compExcl === undefined) ? [] : compExcl;
		this.compExclDefault = (compExclDefault === undefined) ? [] : compExclDefault;
		this.gearExcl = (gearExcl === undefined) ? [] : gearExcl;
		this.gearExclDefault = (gearExclDefault === undefined) ? [] : gearExclDefault;
	}

	toSource() {
		return (
			"new CurrentSourcesAdapter("
			+ "firstTime=" + adapter_helper_recursive_toSource(this.firstTime) + ","
			+ "globalKnown=" + adapter_helper_recursive_toSource(this.globalKnown) + ","
			+ "globalExcl=" + adapter_helper_recursive_toSource(this.globalExcl) + ","
			+ "classExcl=" + adapter_helper_recursive_toSource(this.classExcl) + ","
			+ "classExclDefault=" + adapter_helper_recursive_toSource(this.classExclDefault) + ","
			+ "racesExcl=" + adapter_helper_recursive_toSource(this.racesExcl) + ","
			+ "racesExclDefault=" + adapter_helper_recursive_toSource(this.racesExclDefault) + ","
			+ "backgrExcl=" + adapter_helper_recursive_toSource(this.backgrExcl) + ","
			+ "backgrExclDefault=" + adapter_helper_recursive_toSource(this.backgrExclDefault) + ","
			+ "backFeaExcl=" + adapter_helper_recursive_toSource(this.backFeaExcl) + ","
			+ "backFeaExclDefault=" + adapter_helper_recursive_toSource(this.backFeaExclDefault) + ","
			+ "featsExcl=" + adapter_helper_recursive_toSource(this.featsExcl) + ","
			+ "featsExclDefault=" + adapter_helper_recursive_toSource(this.featsExclDefault) + ","
			+ "weapExcl=" + adapter_helper_recursive_toSource(this.weapExcl) + ","
			+ "weapExclDefault=" + adapter_helper_recursive_toSource(this.weapExclDefault) + ","
			+ "armorExcl=" + adapter_helper_recursive_toSource(this.armorExcl) + ","
			+ "armorExclDefault=" + adapter_helper_recursive_toSource(this.armorExclDefault) + ","
			+ "ammoExcl=" + adapter_helper_recursive_toSource(this.ammoExcl) + ","
			+ "ammoExclDefault=" + adapter_helper_recursive_toSource(this.ammoExclDefault) + ","
			+ "magicitemExcl=" + adapter_helper_recursive_toSource(this.magicitemExcl) + ","
			+ "magicitemExclDefault=" + adapter_helper_recursive_toSource(this.magicitemExclDefault) + ","
			+ "spellsExcl=" + adapter_helper_recursive_toSource(this.spellsExcl) + ","
			+ "spellsExclDefault=" + adapter_helper_recursive_toSource(this.spellsExclDefault) + ","
			+ "creaExcl=" + adapter_helper_recursive_toSource(this.creaExcl) + ","
			+ "creaExclDefault=" + adapter_helper_recursive_toSource(this.creaExclDefault) + ","
			+ "compExcl=" + adapter_helper_recursive_toSource(this.compExcl) + ","
			+ "compExclDefault=" + adapter_helper_recursive_toSource(this.compExclDefault) + ","
			+ "gearExcl=" + adapter_helper_recursive_toSource(this.gearExcl) + ","
			+ "gearExclDefault=" + adapter_helper_recursive_toSource(this.gearExclDefault)
			+ ")"
		)
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


// Helper functions
function adapter_helper_convert_fieldname_to_id(field_name /*str*/) /*str*/ {
	return field_name.replace(/ /g, "_");
};

function adapter_helper_convert_id_to_fieldname(id /*str*/) /*str*/ {
	return id.replace(/_/g, " ").replace(/#\d+$/, "");
};

function adapter_helper_recursive_toSource(object /*any*/) /*str*/ {
	if (object === undefined) {
		return "undefined";
	} else if (Object.prototype.toString.call(object) === "[object Array]") {
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
	} else if (object.constructor.name == 'RegExp') {
		return "new RegExp('" + object.toInnerString() + "')";
	} else if (typeof object == "object") {
		// testing that this is DOM
		if (object.nodeType && typeof object.toSource == "function") {
			return object.toSource(true);
		} else { // check that this is a literal
			if (object instanceof Date) {
				return "new Date(" + object.toString() + ")"
			} else {
				// it is an object literal
				let result = "Object({";
				let first = true;
				let key;
				for (let var_ in object) {
					if (!first) {
						result += ",";
					}
					key = adapter_helper_escape_string_for_toSource(var_);
					result += "\"" + key + "\":" + adapter_helper_recursive_toSource(object[var_]);
					first = false;
				}
				result += "})";
				return result;
			}
		}
	} if (typeof object === 'string' || object instanceof String) {
		return "\"" + adapter_helper_escape_string_for_toSource(object) + "\"";
	} else {
		return String(object);
	}
};

function adapter_helper_escape_string_for_toSource(string /*String*/) /*String*/ {
	return string
		.replace(/\\/g, "\\\\")
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/"/g, "\\\"");
}

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

function adapter_helper_reference_factory(field_id /*String*/) /*AdapterClassFieldReference|AdapterClassFieldContainterReference|null*/ {
	let element = document.getElementById(field_id);
	let elements = [];
	if ((element == null ) || (!element.classList.contains('field'))) {
		// No single element by this id, look for "child elements" that start with the id as prefix
		[...document.getElementsByClassName('field')].forEach(element => {
			if (element.id.match(new RegExp("^" + field_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "(?:\.|#)?.*"))) {
				elements.push(element);
			}
		});
		if (elements.length == 0) {
			// try removing '.1' at the end (for .rect)
			if (field_id.endsWith('.1')) {
				element = document.getElementById(field_id.replace(/\.1$/, ''));
				if ((element != null ) && element.classList.contains('field')) {
					elements.push(element);
				}
			}
			if (elements.length == 0) {
				if (
					[
						'nothing',
						'AdvLog.Options',
						'Attack.1.Description_Tooltip',
						'Attack.2.Description_Tooltip',
						'Attack.3.Description_Tooltip',
						'Attack.4.Description_Tooltip',
						'Attack.5.Description_Tooltip',
						'AdvLogS.Background_Faction.Text',
						'AdvLog.HeaderIcon',
					].includes(field_id)
				) {
					return null
				} else if (field_id == 'Comp.Desc.Name') {
					console.log("Warning: bookmark field fallback used:", field_id);
					elements.push(document.getElementById('P4.AScomp.' + field_id)); // bookmark field
				} else if (field_id == 'Notes.Left') {
					console.log("Warning: bookmark field fallback used:", field_id);
					elements.push(document.getElementById('P5.ASnotes.' + field_id)); // bookmark field
				} else {
					throw "null element: " + field_id;
				}
			}
		}
	} else {
		elements.push(element);
	}
	return new AdapterClassFieldReference(html_elements=elements);
}

function adapter_helper_get_saveimg_field(img_name /*String*/) /*AdapterClassImageReference|null*/ {
	if (img_name.startsWith('Faction.')) {
		// e.g. 'Faction.The Emerald Enclave.symbol'
		let type_ = img_name.toLowerCase().match(/\.(symbol|banner|icon)$/)[1]
		let bare_name = img_name.replace(/^Faction\./, '').replace(/\.(symbol|banner|icon)$/, '').toLowerCase().replace(/(?:\s+|^)the(?:\s+|$)/g, ' ').replace(/(?:\s+|^)of(?:\s+|$)/g, ' ').replace(/ /g, '').replace("'", "");
		let img_path = 'img/factions/' + type_ + '/' + bare_name + '.svg';
		if (adapter_helper_UrlExists(img_path)) {
			return new AdapterClassImageReference(img_path);
		} else {
			return null;
		}
	} else if (img_name.startsWith('ClassIcon.')) {
		// e.g. 'ClassIcon.artificer'
		let theClass = img_name.toLowerCase().match(/\.([ a-zA-Z]+)$/)[1].toLowerCase().replace(/ /g, '').replace("'", "");
		let img_path = 'img/class/icon/' + theClass + '.svg';
		if (adapter_helper_UrlExists(img_path)) {
			return new AdapterClassImageReference(img_path);
		} else {
			return null;
		}
	} else if (img_name.startsWith('ALicon.')) {
		// e.g. ALicon.tod
		let theAL = img_name.toLowerCase().match(/\.([ a-zA-Z]+)$/)[1].toLowerCase().replace(/ /g, '').replace("'", "");
		let img_path = 'img/adventure_league/' + theAL + '.svg';
		if (adapter_helper_UrlExists(img_path)) {
			return new AdapterClassImageReference(img_path);
		} else {
			return null;
		}
	} else if (img_name == 'ClickMeIcon') {
		return new AdapterClassImageReference('img/page_stats/header_icons/blank.svg');
	} else if (img_name == 'EmptyIcon') {
		return new AdapterClassImageReference('');
	} else if (img_name.startsWith('SpellSlots.')) {
		return new AdapterClassImageReference('');
	} else if (img_name.startsWith('Spells.')) {
		return new AdapterClassImageReference('img/page_spells/checks/' + img_name.toLowerCase().match(/\.([a-z0-9]+)$/)[1] + '.svg');
	}
	throw "unknown SaveIMG type: " + String(img_name);
}

function adapter_helper_UrlExists(url /*String*/) /*boolean*/ {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status != 404;
}

function adapter_helper_get_prefix_from_script(postPrefix /*String*/) /*String*/ {
	let elementQueue = new Queue();
	for (let childElement of document.currentScript.parentElement.childNodes) {
		if (childElement instanceof HTMLElement) {
			elementQueue.enqueue(childElement);
		}
	}

	let prefix = "";
	while (!elementQueue.isEmpty) {
		let currentElement = elementQueue.dequeue();
		if (currentElement.classList.contains('field') || (currentElement.tagName.toLowerCase() == 'datalist')) {
			let CompIndex = currentElement.id.indexOf(postPrefix);
			if (CompIndex != -1) {
				prefix = currentElement.id.slice(0, CompIndex);
				break;
			}
		}
		for (let childElement of currentElement.childNodes) {
			if (childElement instanceof HTMLElement) {
				elementQueue.enqueue(childElement);
			}
		}
	}
	return prefix;
}


function adapter_helper_get_rect(element /*HTMLElement*/) /*DOMRect*/ {
	let rect = this.html_elements[0].getBoundingClientRect();
	if (
		(rect.left == 0.0) && (rect.top == 0.0) && (rect.right == 0.0) && (rect.bottom == 0.0)
	) {
		// fall back to getting from style
		let top = Number(element.style.top.replace(/\s*px\s*$/, ''));
		let left = Number(element.style.left.replace(/\s*px\s*$/, ''));
		let height = Number(element.style.height.replace(/\s*px\s*$/, ''));
		let width = Number(element.style.width.replace(/\s*px\s*$/, ''));
		if (isNaN(top) || isNaN(left) || isNaN(height) || isNaN(width)) {
			throw "Fallback for rect failed, make sure to set top, left, height and width for " + element.id;
		}
		rect = new DOMRect(left, top, width, height);
	}
	return rect;
}


function adapter_helper_convert_colour(color /*[char, ...]*/) /*String|null*/ {
	let bgColor = null;
	if (color[0] == 'T') {
		bgColor = "none";
	} else if (color[0] == 'G') {
		if (color[1] == 0) {
			bgColor = "black";
		} else if (color[1] == 0.25) {
			bgColor = "lightgrey";
		} else if (color[1] == 0.5) {
			bgColor = "grey";
		} else if (color[1] == 0.75) {
			bgColor = "darkgrey";
		} else if (color[1] == 1) {
			bgColor = "white";
		}
	} else if (color[0] == 'RGB') {
		bgColor = "rgb(" + String(color[1]*255) + ", " + String(color[2]*255) + ", " + String(color[3]*255) + ")";
	}
	if (bgColor == null) {
		throw "Setting unimplemented color:", color;
	}
	return bgColor;
}


function adapter_helper_keystroke1(
	element /*HTMLElement*/,
	allowDec /*boolean*/,
	allowNegative /*boolean*/,
	value /*String*/,
	change /*String*/,
	isFinal /*boolean*/
) {
	let current_selection;
	if (event.target.selectionStart) {
		current_selection = [event.target.selectionStart, event.target.selectionEnd];
	} else {
		current_selection = adapter_helper_get_number_field_selection();
	}
	change = change ? change : '';
	let origLen = change.length;
	let selStart = current_selection[0];
	let selEnd = current_selection[1];
	let rc = keystroke1(allowDec, allowNegative, value, change, selStart-change.length, selEnd, isFinal);
	if (!rc) {
		element.value = element.value.substring(0,selStart-origLen)+element.value.substring(selEnd);
	} else {
		element.value = element.value.substring(0,selStart-origLen)+change+element.value.substring(selEnd);
	}
}


function adapter_helper_save_all() {
	// save page inventory
	let pageElmnt;
	let pages = [];
	for (page_number in globalPageInventory) {
		pageElmnt = globalPageInventory[page_number];
		pages.push({
			page_number: page_number,
			page_id: pageElmnt.id,
			page_prefix: pageElmnt.getAttribute('page-prefix'),
		})
	}

	// save field elements
	let elements = [];
	for (element of document.getElementsByTagName("*")) {
		if (element.classList.contains('field')) {
			if (element.parentElement.parentElement.id != 'tempButtonRibbon') {
				elements.push(adapter_helper_serialise_field(element));
			}
		}
	}

	// jsonify and save
	let saveData = "data:application/json;base64," + btoa(escapeUnicode(JSON.stringify({
		pages: pages,
		elements: elements,
	})));
	let elm = document.createElement('a');
	elm.style.visibility='hidden';
	elm.setAttribute('href', saveData);
	elm.setAttribute("download", "save.json");
	elm.click();
}


function adapter_helper_load() {
	async function apply_contents(saveData) {
		// stop calculations
		noSheetUpdate = !IsNotReset || !IsNotImport;
		app.calculate = false;
		tDoc.calculate = false;
		tDoc.delay = true;

		// set pages
		let pages = saveData.pages;
		while (Object.keys(globalPageInventory).length > 0) {
			this.deletePages(1);
		}
		let pageAdapter;
		let pageNum = 1;
		let templPages = [];
		for (page_info of pages) { // .sort((a, b) => a.page_number - b.page_number)) {
			pageAdapter = new AdapterClassPage(page_info.page_id, page_info.page_prefix);
			if (pageAdapter.isTempl) {
				templPages.push([pageAdapter, pageNum]);
			} else {
				await pageAdapter.spawn(nPage=pageNum, bRename=true, bOverlay=false);
			}
			pageNum += 1;
		}
		// add template pages last so their buttons are in the "right" place
		for (let pageAdapterInfo of templPages) {
			await pageAdapterInfo[0].spawn(nPage=pageAdapterInfo[1], bRename=true, bOverlay=false);
		}

		// set stat page to open by default and open it
		let statButton = document.getElementById('tabbuttonstat');
		if (statButton) {
			statButton.classList.add('defaultOpen');
			statButton.click();
		}
		makeSaveLoadButtons();

		// set fields
		for (let element of saveData.elements) {
			adapter_helper_deserialise_field(element);
		}

		// initialise global variables etc.
		InitializeEverything(noButtons=false, noVars=false);

		// continue calculations
		calcCont();
	}

	// load file and apply contents
	var input = document.createElement('input');
	input.type = 'file';
	// input.setAttribute('accept', "application/json");
	input.onchange = e => { 
		let file = e.target.files[0]; 
		let reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = readerEvent => {
			apply_contents(JSON.parse(unescapeUnicode(readerEvent.target.result)));
		}
	}
	input.click();
}


function adapter_helper_serialise_field(element /*HTMLElement*/) /*Object*/ {
	let fieldVar = this.getField(adapter_helper_convert_id_to_fieldname(element.id));
	if (fieldVar.constructor.name != 'AdapterClassFieldReference') {
		throw "adapter_helper_serialise_field not implemented for field type '" + String(typeof fieldVar) + "', constructor '" + fieldVar.constructor.name + "'";
	}
	let result = {name: fieldVar.name};
	if (['User_Imported_Files', 'User_Script'].includes(element.id)) {
		result.value = btoa(escapeUnicode(element.getAttribute('value')));
		return result;
	}
	let submit_name = fieldVar.submitName;
	if (submit_name != "") {
		result.submitName = submit_name;
	}
	let value = fieldVar.value;
	if (value != element.dataset.default) {
		result.value = value;
	}
	let useName = fieldVar.useName;
	if (useName != "") {
		result.useName = useName;
	}
	let display = fieldVar.display;
	if (display != 0) {
		result.display = display;
	}
	if (fieldVar.type == 'combobox') {
		if (element.tagName.toLowerCase() == 'input') {
			result.items = fieldVar.getItems();
		} else {
			result.currentValueIndices = fieldVar.currentValueIndices;
		}
	}
	if (['checkbox', 'radiobutton'].includes(fieldVar.type)) {
		result.boxChecked = fieldVar.isBoxChecked(0);
	}
	if (element.dataset.customUrl) {
		result.image_data = element.style.backgroundImage.replace(/^url\(\"/, '').replace(/\"\)$/, '');
	}
	if (is_movable_field(result.name)) {
		result.rect = fieldVar.rect;
	}
	return result;
}


function adapter_helper_deserialise_field(element_info /*Object*/) {
	let fieldVar = this.getField(element_info.name);
	if (fieldVar.constructor.name!= 'AdapterClassFieldReference') {
		throw "adapter_helper_serialise_field not implemented for field type '" + String(typeof fieldVar) + "', constructor '" + fieldVar.constructor.name + "'";
	}
	if (element_info.name == 'User Script') {
		fieldVar.html_elements[0].setAttribute('value', unescapeUnicode(atob(element_info.value)));
		return;
	}
	fieldVar.submitName = element_info.submitName ? element_info.submitName : "";
	if (element_info.value) {
		set_value_no_dispatch(fieldVar, element_info.value);
	}
	fieldVar.useName = element_info.useName ? element_info.useName : "";
	fieldVar.display = element_info.display ? element_info.display : 0;
	if (fieldVar.type == 'combobox') {
		if (fieldVar.html_elements[0].tagName.toLowerCase() == 'input') {
			fieldVar.setItems(element_info.items);
		} else {
			fieldVar.currentValueIndices = element_info.currentValueIndices;
		}
	}
	if (['checkbox', 'radiobutton'].includes(fieldVar.type)) {
		fieldVar.checkThisBox(0, element_info.boxChecked);
	}
	if (element_info.image_data) {
		fieldVar.buttonSetIcon(element_info.image_data);
		fieldVar.html_elements[0].dataset.customUrl = true;
	}
	if (element_info.rect) {
		fieldVar.rect = element_info.rect;
	}
}


function set_value_no_dispatch(fieldVar, new_value) {
	if ((new_value != null) && (new_value.constructor === Array)) {
		new_value = new_value.join(',');
	}
	if (['input', 'select', 'textarea'].includes(this.html_elements[0].tagName.toLowerCase())) {
		if (
			(fieldVar.html_elements[0].tagName.toLowerCase() == 'input')
			&& (fieldVar.html_elements[0].getAttribute('type')?.toLowerCase() == 'number')
			&& isNaN(new_value)
		) {
			// try to strip a unit from the number
			new_value = new_value.replace(/^\s*(-?\d+\.?\d*)\s*[a-zA-Z]+$/, '$1');
		}
		fieldVar.html_elements[0].value = new_value;
	} else {
		fieldVar.html_elements[0].setAttribute('value', new_value);
	}
}


function is_movable_field(fieldName /*String*/) /*boolean*/ {
	if ([
		"Text.SaveDC.1",
		"Image.SaveDCarrow.1",
		"Image.SaveDC.1",
		"Spell DC 1 Mod",
		"Spell DC 1 Bonus"
	].includes(fieldName)) {
		return true;
	}
	for (
		let prefix of [
			"Adventuring Gear Row ",
			"Extra.Gear Row ",
			"Extra.Magic Item ",
			"Extra.Magic Item Note "
		]
	) {
		if (fieldName.startsWith()) {
			return true;
		}
	}
	for (
		let infix of [
			"spellsgloss.Image",
			"spellsdiv.Image.",
			"spellsdiv.Text.",
			"spellshead.Image.Header.Left.",
			"spellshead.Text.header.",
			"spellshead.ability.",
			"spellshead.attack.",
			"spellshead.dc.",
			"spellshead.Image.prepare.",
			"spellshead.prepare.",
			"spellshead.class.",
			"BlueText.spellshead.attack.",
			"BlueText.spellshead.dc.",
			"BlueText.spellshead.prepare.",
		]
	) {
		if (fieldName.indexOf(infix) != -1) {
			return true;
		}
	}
	return false;
}


function escapeUnicode(uText /*String*/) /*String*/ {
	let result = "";
	for(let i = 0; i < uText.length; i++){
		// Assumption: all characters are < 0xffff
		let num = uText[i].charCodeAt(0);
		if (num < 127) {
			result += uText[i];
		} else {
			result += "\\u" + ("000" + num.toString(16)).substr(-4);
		}
	}
	return result;
}


function unescapeUnicode(lText /*String*/) /*String*/ {
	let result = "";
	for(let i = 0; i < lText.length; i++){
		if (/\\u[0-9a-fA-F]{4}/.test(lText.slice(i, i + 6))) {
			result += String.fromCharCode(Number("0x" + lText.slice(i+2, i + 6)));
			i += 5;
		} else {
			result += lText[i]
		}
	}
	return result;
}

