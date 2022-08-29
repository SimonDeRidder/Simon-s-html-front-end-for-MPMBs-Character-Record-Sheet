
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


const minVer = true;
const app = {
	setTimeOut: function(command /*str*/, millis /*int*/) {
		setTimeout(command, millis);
	},
	thermometer: {  // combined status bar and load animation (TODO)
		_text: "",  // TODO: use a status bar in stead
		get text () {
			return this._text;
		},
		set text(new_text /*str*/) {
			this._text = new_text;
		}
	}
};
this.info = {
	SheetType: "printer friendly",
	SheetVersion: "v13.1.0",
};

this.bookmarkRoot = {
	children: [
		{
			children: [],
		}
	],
};

this.getField = function(field_name /*str*/) /*AdapterClassFieldReference|null*/{
	let field_id = adapter_helper_convert_fieldname_to_id(field_name);
	let element = document.getElementById(field_id);
	if (element == null) {
		console.log("null element:", field_id);
		return null;
	}
	return new AdapterClassFieldReference(
		html_element=element
	);
};

this.calculateNow = function () {
	// TODO: does nothing for now, we don't pause calculations (see also calcStop and calcCont)
};

// Adapter classes

class AdapterClassFieldReference {
	constructor(html_element /*HTMLElement*/) {
		this.html_element = html_element;
		this.submitName = "";
	}

	get submitName () /*str*/ {
		let submitName_ = this.html_element.getAttribute('submitName');
		if (!submitName_) {
			return "";
		}
		return submitName_;
	}

	set submitName (new_submitName /*str*/) {
		this.html_element.setAttribute('submitName', new_submitName);
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

loadScript('_functions/Functions3.js', function() {
loadScript('_functions/Functions0.js', function() {
loadScript('_variables/Lists.js', function() {
loadScript('_functions/Functions2.js', function() {
loadScript('_functions/Startup.js');
})})})})
