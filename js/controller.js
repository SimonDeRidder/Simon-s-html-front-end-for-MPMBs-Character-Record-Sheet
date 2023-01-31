
// TODO: connect Field "SelectFile" to a file picker for import
// TODO: Make a field "Whiteout.Standard.0" that controls the lines in multi-line inputs fields (I think)
// TODO: connect "Color.Theme"
// TODO: "SaveIMG.Header.Left." + colour, "SaveIMG.Divider." + colour
// TODO: find a way to add tooltips for buttons etc
// TODO: connect "Extra.Layers Button", "Buttons"
// TODO: rename adapter_helper_* and AdapterClass* to more reasonable things
// TODO: switch to <select> for all non-customisable dropdowns
// TODO: figure out what to do with SetThisFldVal
// TODO: connect thermoM to floating fade-out status message

// Load functions

function loadScript(path /*str*/) /*Promise*/ {
	return new Promise(function (resolve, reject) {
		const scriptElement = document.createElement("script");
		scriptElement.src = path;
		scriptElement.onload = () => resolve(scriptElement);
		document.body.appendChild(scriptElement);
	});
}

function initialCalculationEvents() {
	// trigger AC calculation
	document.getElementById('AC_Armor_Bonus').dispatchEvent(new Event('change'));
	// trigger AC_Dexterity_Modifier calculation (and all skills) (and Attack.i.To Hit)
	document.getElementById('Dex_Mod').dispatchEvent(new Event('change'));
	// trigger Adventuring_Gear_Location_Subtotal_* and Adventuring_Gear_Weight_Subtotal_* calculation
	document.getElementById('Adventuring_Gear_Amount_1').dispatchEvent(new Event('change'));
	document.getElementById('Adventuring_Gear_Amount_19').dispatchEvent(new Event('change'));
	document.getElementById('Adventuring_Gear_Amount_37').dispatchEvent(new Event('change'));
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
	.then(script => loadScript('import_utils/overwrite_Startup.js'))
	.then(script => initialCalculationEvents());
