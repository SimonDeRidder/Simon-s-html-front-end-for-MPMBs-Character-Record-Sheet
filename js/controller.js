
// TODO: Make a field "Whiteout.Standard.0" that controls the lines in multi-line inputs fields (I think)
// TODO: connect "Color.Theme"
// TODO: "SaveIMG.Header.Left." + colour, "SaveIMG.Divider." + colour
// TODO: find a way to show tooltips
// TODO: connect "Extra.Layers Button", "Buttons"
// TODO: rename adapter_helper_* and AdapterClass* to more reasonable things
// TODO: switch to <select> for all non-customisable dropdowns
// TODO: connect thermoM to floating fade-out status message
// TODO: revamp number formatting (keystroke[12] and format[12])
// TODO: make sure setting setVal on magic items/feats triggers a calculation (see doDropDownValCalcWithChoices) (change event should suffice)
// TODO: make sure field getters in CurrentEvals.hp trigger calculation of (Comp.Use.)HP.Max
// TODO: set default values up to P4.AScomp.Comp.Type
// TODO: parse CurrentEvals stuff for proper event triggering
// TODO: find a way to import from pdf (MPMBOpenFile in DirectImport)

// Load functions

function loadScript(path /*str*/) /*Promise*/ {
	return new Promise(function (resolve, reject) {
		const scriptElement = document.createElement("script");
		scriptElement.src = path;
		scriptElement.onload = () => resolve(scriptElement);
		document.body.appendChild(scriptElement);
	});
}

function makeSaveLoadButtons() {
	return new Promise(function (resolve, reject) {
		app.addToolButton({
			cName: "save",
			oIcon: null,
			cExec: "adapter_helper_save_all()",
			cLabel: "Save"
		});
		app.addToolButton({
			cName: "load",
			oIcon: null,
			cExec: "adapter_helper_load()",
			cLabel: "Load"
		});
		resolve();
	});
}

function initialCalculationEvents() {
	// First set CurrentWeapons (errors otherwise)
	FindWeapons();
	FindCompWeapons(undefined, 'P4.AScomp.');
	// trigger AC calculation
	document.getElementById('AC_Armor_Bonus').dispatchEvent(new Event('change'));
	// trigger Adventuring_Gear_Location_Subtotal_* and Adventuring_Gear_Weight_Subtotal_* calculation
	document.getElementById('Adventuring_Gear_Amount_1').dispatchEvent(new Event('change'));
	document.getElementById('Adventuring_Gear_Amount_19').dispatchEvent(new Event('change'));
	document.getElementById('Adventuring_Gear_Amount_37').dispatchEvent(new Event('change'));
	document.getElementById('Extra.Gear_Amount_1#1').dispatchEvent(new Event('change'));
	document.getElementById('P4.AScomp.Comp.eqp.Gear_Amount_1').dispatchEvent(new Event('change'));
	// trigger ability mods calculation (and ST calculation) and AC_Dexterity_Modifier calculation (and all skills) (and Attack.i.To Hit)
	document.getElementById('Con').dispatchEvent(new Event('change'));
	document.getElementById('Cha').dispatchEvent(new Event('change'));
	document.getElementById('Dex').dispatchEvent(new Event('change'));
	document.getElementById('Int').dispatchEvent(new Event('change'));
	document.getElementById('HoS').dispatchEvent(new Event('change'));
	document.getElementById('Str').dispatchEvent(new Event('change'));
	document.getElementById('Wis').dispatchEvent(new Event('change'));
	// trigger weight texts
	document.getElementById('Unit_System').dispatchEvent(new Event('change'));
}

loadScript('_functions/AbilityScores_old.js')
	.then(script => loadScript('_functions/AbilityScores.js'))
	.then(script => loadScript('_functions/ClassSelection.js'))
	.then(script => loadScript('_functions/DomParser.js'))
	.then(script => loadScript('_functions/Functions0.js'))
	.then(script => loadScript('import_utils/overwrite_Functions0.js'))
	.then(script => loadScript('_functions/Functions1.js'))
	.then(script => loadScript('_functions/Functions2.js'))
	.then(script => loadScript('_functions/Functions3.js'))
	.then(script => loadScript('_functions/FunctionsImport.js'))
	.then(script => loadScript('_functions/FunctionsResources.js'))
	.then(script => loadScript('_functions/FunctionsSpells.js'))
	.then(script => loadScript('_functions/Shutdown.js'))
	.then(script => loadScript('_variables/Icons.js'))
	.then(script => loadScript('_variables/Lists.js'))
	.then(script => loadScript('_variables/ListsBackgrounds.js'))
	.then(script => loadScript('_variables/ListsClasses.js'))
	.then(script => loadScript('_variables/ListsCompanions.js'))
	.then(script => loadScript('_variables/ListsCreatures.js'))
	.then(script => loadScript('_variables/ListsFeats.js'))
	.then(script => loadScript('_variables/ListsGear.js'))
	.then(script => loadScript('_variables/ListsMagicItems.js'))
	.then(script => loadScript('_variables/ListsPsionics.js'))
	.then(script => loadScript('_variables/ListsRaces.js'))
	.then(script => loadScript('_variables/ListsSources.js'))
	.then(script => loadScript('_variables/ListsSpells.js'))
	.then(script => makeSaveLoadButtons())
	.then(script => loadScript('_functions/Startup.js'));
	// .then(script => loadScript('import_utils/overwrite_Startup.js'))
	// .then(script => initialCalculationEvents());
