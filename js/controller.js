
// TODO: connect Field "SelectFile" to a file picker for import
// TODO: Make a field "Whiteout.Standard.0" that controls the lines in multi-line inputs fields (I think)
// TODO: connect "AdvLog." + L + ".notes" to something
// TODO: when converting fields, convert spaces to '_' and other non-alfanumeric characters to '-' (encountered: '.', '/')
//       see note with https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
// TODO: sort out "Ammo(Left/Right).(Top/Base).i" and relation to bullets (see LoadAmmo function)
// TODO: connect "Color.Theme"
// TODO: "SaveIMG.Header.Left." + colour, "SaveIMG.Divider." + colour
// TODO: find a way to add tooltips for buttons etc
// TODO: connect "Extra.Layers Button", "Buttons"
// TODO: trigger event-based functions like ToggleSkillProf when appropriate
// TODO: connect "Template.extras.AScomp", "Template.extras.ASnotes", "Template.extras.WSfront", "Template.extras.ALlog"
// TODO: rename adapter_helper_* and AdapterClass* to more reasonable things
// TODO: switch to <select> for all dropdowns

const minVer = true;
const app = {
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
	addToolButton: function (
		cName /*str*/,
		oIcon = null /*Icon Stream*/,
		cExec /*str*/,
		cEnable = "true" /*str*/,
		cMarked = "false" /*str*/,
		cTooltext = "" /*str*/,
		nPos = -1 /*number*/,
		cLabel = "" /*str*/,
	) {
		// TODO: add a button to tool bar (make a tool bar)
	},
	alert: function (
		cMsg /*str*/,
		nIcon = 0 /*int*/,
		nType = 0 /*int*/,
		cTitle = "Alert" /*str*/,
		oDoc = null /*doc*/,  // parent
		oCheckbox = null /*object*/,
	) {
		// TODO: create a modal with custom buttons
	}
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

this.getField = function (field_name /*str*/) /*AdapterClassFieldReference|null*/ {
	let field_id = adapter_helper_convert_fieldname_to_id(field_name);
	let element = document.getElementById(field_id);
	if (element == null) {
		console.log("null element:", field_id);
		return null;
	}
	return new AdapterClassFieldReference(
		html_element = element
	);
};

this.calculateNow = function () {
	// TODO: does nothing for now, we don't pause calculations (see also calcStop and calcCont)
};

this.resetForm = function (aFields = null /*fields*/) {
	if (!aFields) {
		console.log("warning: aFields is null in resetForm");
	}
	aFields.forEach(field => {
		let element = document.getElementById(adapter_helper_convert_fieldname_to_id(field));
		let element_type = element.getAttribute('type');
		if ((element_type == 'text') | (element_type == 'number')) {
			element.setAttribute('value', "");
		}
		else if (element_type == 'checkbox') {
			element.checked = false;
		}
		else {
			element.setAttribute('value', "");
		}
	});
};



function AFNumber_Format(nDec /*int*/, sepStyle /*int*/, negStyle /*int*/, currStyle /*int*/, strCurrency /*str*/, bCurrencyPrepend /*boolean*/) /*str*/{
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
	event.value = Number(event.value.replace(',', '.').match(/\d+\.?\d*/)[0]).toLocaleString(locale, options);
};

// Adapter classes

class AdapterClassFieldReference {
	constructor(html_element /*HTMLElement*/) {
		this.html_element = html_element;
		this.submitName = "";
	}

	get submitName() /*str*/ {
		let submitName_ = this.html_element.getAttribute('submitName');
		if (!submitName_) {
			return "";
		}
		return submitName_;
	}

	set submitName(new_submitName /*str*/) {
		this.html_element.setAttribute('submitName', new_submitName);
	}

	get value() /*str*/ {
		let value_ = this.html_element.getAttribute('value');
		if (!value_) {
			return "";
		}
		return value_;
	}

	set value(new_value /*str*/) {
		this.html_element.setAttribute('value', new_value);
	}

	toSource() /*str*/ {
		// console.log(this.html_element.toSource());
		return this.html_element.toSource();
	}

	isBoxChecked(nWidget /*int*/) /*boolean*/ {
		if (nWidget > 0) {
			console.log("warning: isBoxChecked nWidget > 0:", nWidget);
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
			console.log("warning: checkThisBox nWidget > 0:", nWidget);
		}
		this.html_element.checked = bCheckIt;
	}
}

// Helper functions
function adapter_helper_convert_fieldname_to_id(field_name) {
	return field_name.replace(/ /g, "_").replace(/[\./]/g, "-");
};

// Load functions

function loadScript(path, callback) {
	const scriptTag = document.createElement("script");
	scriptTag.src = path;
	scriptTag.onload = callback;
	document.body.appendChild(scriptTag);
}

function initialCalculationEvents() {
	eventManager.handle_event(EventType.AC_calculate);
}

loadScript('_functions/AbilityScores_old.js', function () {
loadScript('_functions/AbilityScores.js', function () {
loadScript('_functions/ClassSelection.js', function () {
loadScript('_functions/DomParser.js', function () {
loadScript('_functions/Functions0.js', function () {
loadScript('import_utils/overwrite_Functions0.js', function () {
loadScript('_functions/Functions1.js', function () {
loadScript('_functions/Functions2.js', function () {
loadScript('_functions/Functions3.js', function () {
loadScript('_functions/FunctionsImport.js', function () {
loadScript('_functions/FunctionsResources.js', function () {
loadScript('_functions/FunctionsSpells.js', function () {
loadScript('_functions/Shutdown.js', function () {
loadScript('import_utils/overwrite_FunctionsSpells.js', function () {
loadScript('_variables/Icons.js', function () {
loadScript('_variables/Lists.js', function () {
loadScript('_variables/ListsBackgrounds.js', function () {
loadScript('_variables/ListsClasses.js', function () {
loadScript('_variables/ListsCompanions.js', function () {
loadScript('_variables/ListsCreatures.js', function () {
loadScript('_variables/ListsFeats.js', function () {
loadScript('_variables/ListsGear.js', function () {
loadScript('_variables/ListsMagicItems.js', function () {
loadScript('_variables/ListsPsionics.js', function () {
loadScript('_variables/ListsRaces.js', function () {
loadScript('_variables/ListsSources.js', function () {
loadScript('_variables/ListsSpells.js', function () {
loadScript('_functions/Startup.js', initialCalculationEvents);
})})})})})})})})})})})})})})})})})})})})})})})})})})});

