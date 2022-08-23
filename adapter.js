
// TODO: make a 'field' "Highlighting" which controls highlight color of all elements (--input-background (?))
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


const minVer = true;
const app = {

};
this.info = {
	SheetType: "printer friendly",
	SheetVersion: "v13.1.0",
};

// Load functions

function loadScript(path, callback) {
	const scriptTag = document.createElement("script");
	scriptTag.src = path;
	scriptTag.onload = callback;
	document.body.appendChild(scriptTag);
}

loadScript('_functions/Functions0.js', function() {
loadScript('_variables/Lists.js', function() {
loadScript('_functions/Startup.js');
})})
