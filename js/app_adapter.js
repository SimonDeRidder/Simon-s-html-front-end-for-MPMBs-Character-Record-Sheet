
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


console.println = console.log;
console.show = console.log;

AdapterParsePopUpMenu = function (aParams, resolve) {
	let menu = []
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
	if (field_id.endsWith('.alphabeta')) {
		// for Stealth Disadv/Stealth_Disadv (see Functions2:7633), TODO find out what to do with this.
		field_id = field_id.replace(/.alphabeta$/, '');
	}
	return adapter_helper_reference_factory(field_id);
};

this.calculateNow = function () {
	// TODO: does nothing for now, we don't pause calculations (see also calcStop and calcCont)
};

this.resetForm = function (aFields = null /*String|[String]|null*/) {
	if (!aFields) {
		throw "aFields is null in resetForm";
	}
	if (typeof aFields === 'string') {
		aFields = [aFields];
	}
	aFields.forEach(field => {
		console.log("resetting '" + field + "'");
		let element = adapter_helper_reference_factory(adapter_helper_convert_fieldname_to_id(field)).html_elements[0];
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
		} else {
			throw "unsupported element type in array toSource:" + (typeof this[i]);
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
		if (!submitName_) {
			return "";
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
		if (value_ === undefined) {
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
			return ('' + value_).replace(/^\s*d/, '').replace(/\s*\+\s*\d+\s*$/, '')
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
			console.log(
				"warning: executing currentValueIndices for input list",
				this.html_elements[0].id,
				", make sure all innerText is matchable"
			);
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
				this.html_elements[0].value = listElement.children[newIndex].value;
			} else {
				throw "Cannot find datalist element " + String(this.html_elements[0].getAttribute('list'));
			}
		} else {
			throw "set currentValueIndices on non-combobox " + String(this.html_elements[0].id);
		}
	}

	get page() /*Number*/ {
		return this.html_elements[0].dataset.page;
	}

	get rect() /*[Number]*/ {
		let boundingRect = this.html_elements[0].getBoundingClientRect();
		return [
			boundingRect.left * 3.0 / 4.0,
			boundingRect.top * 3.0 / 4.0,
			boundingRect.right * 3.0 / 4.0,
			boundingRect.bottom * 3.0 / 4.0,
		]
	}

	set rect(newRect /*[Number]*/) {
		let currentBoundingRect = this.html_elements[0].getBoundingClientRect();
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
			this.html_elements[nWidget].dispatchEvent(new Event('change'));
		}
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
	}

	setAction(actionType /*String*/, actionStr /*String*/) {
		if (actionStr == '') {  // do nothing
			return;
		}
		if (actionType != 'Calculate') {  // do nothing
			throw "Unknown action type for setAction: " + actionType;
		}
		if (
			[
				"event.value = Math.max(1, What('Cha Mod'));",
				"event.value = 1 + What('Cha Mod');",
				"var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = What('Limited Feature Used ' + FieldNmbr); var DCmod = Number(usages) * 5; event.value = (isNaN(Number(usages)) || usages === '') ? 'DC  ' : 'DC ' + Number(10 + DCmod);",
				'event.value = "As a reaction when a ranged weapon attack hits me while I\'m wearing these gloves, I can reduce the damage by 1d10 + " + Number(What("Dex Mod")) + " (my Dexterity modifier). This only works if I have a free hand. If I reduce the damage to 0, I can catch the missile if it is small enough for me to hold in that hand.";',
			].includes(actionStr)
		) {  // TODO: remove when we're confident enough in the change rule matching
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
					event.target.name = adapter_helper_convert_id_to_fieldname(theElement.id);
					eval(actionStr);
					theElement.value = event.value;
				})
			}
		} else {
			throw (
				"setAction called for '" + actionType + "', with unknown non-empty value '" + actionStr + "'. "
				+ "Make sure the code analyser above is functioning properly, then add it to whitelist."
			);
		}
	}

	setFocus() {
		this.html_elements[0].focus();
	}

	deleteRemVal() {
		delete this.html_elements[0].dataset.remVal;
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


class AdapterClassReadStream {
	constructor(fileContent /*String*/) {
		this.fileContent = fileContent;
	}

	async read() /*string*/ {
		return this.fileContent;
	}
}


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
			scrString += "'" + file + "':`" + this[file] + "`,";
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
				let result = "Object({";
				let first = true;
				for (let var_ in object) {
					if (!first) {
						result += ",";
					}
					result += "'" + var_ + "':" + adapter_helper_recursive_toSource(object[var_]);
					first = false;
				}
				result += "})";
				return result;
			}
		}
	} if (typeof object === 'string' || object instanceof String) {
		return "'" + object + "'";
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

function adapter_helper_reference_factory(field_id /*String*/) /*AdapterClassFieldReference|AdapterClassFieldContainterReference|null*/ {
	let element = document.getElementById(field_id);
	let elements = [];
	if ((element == null ) || (!element.classList.contains('field'))) {
		// No single element by this id, look for "child elements" that start with the id as prefix
		[...document.getElementsByClassName('field')].forEach(element => {
			if (element.id.match(new RegExp("^" + field_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "(?![a-zA-Z0-9])"))) {
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
				if (['AdvLog.Options'].includes(field_id)) {
					return null
				} else if (field_id == 'Comp.Desc.Name') {
					elements.push(document.getElementById('P4.AScomp.' + field_id)); // bookmark field
				} else if (field_id == 'Notes.Left') {
					elements.push(document.getElementById('P5.ASnotes.' + field_id)); // bookmark field
				} else {
					throw "null element: " + field_id;
				}
			}
		}
	} else {
		elements.push(element);
	}
	if (field_id.startsWith('Template.extras.')) {
		let values = (new AdapterClassFieldReference(elements)).value.split(",");
		if ((values.length == 1) && (values[0] == "")) {
			values = [];
		}
		return new AdapterClassTemplateReference(values);
	}
	return new AdapterClassFieldReference(html_elements=elements);
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
