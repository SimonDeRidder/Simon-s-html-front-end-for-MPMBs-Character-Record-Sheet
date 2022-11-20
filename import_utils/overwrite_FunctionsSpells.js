

//Copied verbatim, with only the following changes:
// - changed copying of AllSpellsMenu to explicit copy to avoid using toSource
function ParseSpellMenu() {
	//define a function for creating the full set of spells-by-level menu for a class
	var createMenu = function(menu, className, fullArray) {
		var nameArray = ["All spells"].concat(spellLevelList);
		var classTemp = {cName : className, oSubMenu : []};
		for (var y = 0; y < fullArray.length; y++) {
			var spellsArray = fullArray[y];
			if (spellsArray.length > 0) {
				var spellsTemp = {cName : nameArray[y], oSubMenu : []};
				for (var i = 0; i < spellsArray.length; i++) {
					spellsTemp.oSubMenu.push({
						cName : SpellsList[spellsArray[i]].name + (SpellsList[spellsArray[i]].ritual ? " (R)" : ""),
						cReturn : "spell" + "#" + spellsArray[i] + "#"
					})
				}
				classTemp.oSubMenu.push(spellsTemp);
			}
		}
		menu.oSubMenu.push(classTemp);
	}

	var amendMenu = function(theMenu, nameChange, extraReturn) {
		theMenu.cName = nameChange;
		for (var a = 0; a < theMenu.oSubMenu.length; a++) {
			if (theMenu.oSubMenu[a].cName === "-") continue;
			for (var b = 0; b < theMenu.oSubMenu[a].oSubMenu.length; b++) {
				if (theMenu.oSubMenu[a].oSubMenu[b].cName === "-") continue;
				for (var c = 0; c < theMenu.oSubMenu[a].oSubMenu[b].oSubMenu.length; c++) {
					if (theMenu.oSubMenu[a].oSubMenu[b].oSubMenu[c].cName === "-") continue;
					theMenu.oSubMenu[a].oSubMenu[b].oSubMenu[c].cReturn += extraReturn;
				}
			}
		}
	}

	var allSpellCasters = [
		"any",
		"-",
		"bard",
		"cleric",
		"druid",
		"paladin",
		"ranger",
		"sorcerer",
		"warlock",
		"wizard",
		"-"
	];

	var moreSpellCasters = [];
	for (var aClass in ClassList) {
		if (aClass === "rangerua") continue;
		if (ClassList[aClass].spellcastingFactor && !(/psionic/i).test(ClassList[aClass].spellcastingFactor)) {
			if (allSpellCasters.indexOf(aClass) === -1 && moreSpellCasters.indexOf(aClass) === -1 && !testSource(aClass, ClassList[aClass], "classExcl")) moreSpellCasters.push(aClass);
		} else {
			var subClasses = ClassList[aClass].subclasses[1];
			for (var SC = 0; SC < subClasses.length; SC++) {
				var aSubClass = subClasses[SC];
				if (ClassSubList[aSubClass].spellcastingFactor && !(/psionic/i).test(ClassSubList[aSubClass].spellcastingFactor) && allSpellCasters.indexOf(aSubClass) === -1 && moreSpellCasters.indexOf(aSubClass) === -1 && !testSource(aSubClass, ClassSubList[aSubClass], "classExcl")) moreSpellCasters.push(aSubClass);
			}
		}
	};

	moreSpellCasters.sort();
	allSpellCasters = allSpellCasters.concat(moreSpellCasters);

	//now see if this newly created list matches the known caster classes
	if (AllCasterClasses && AllCasterClasses.toSource() === allSpellCasters.toSource()) {
		return AddSpellsMenu;
	} else {
		AllCasterClasses = allSpellCasters;
	};

	var AllSpellsMenu = {cName : "without first column", oSubMenu : []};
	for (var s = 0; s < allSpellCasters.length; s++) {
		var aCast = allSpellCasters[s];
		var aObj = ClassList[aCast] ? ClassList[aCast] : (ClassSubList[aCast] ? ClassSubList[aCast] : false);
		if (aCast === "-") {
			AllSpellsMenu.oSubMenu.push({cName : "-"});
			continue;
		}
		var aCastClass = aObj && aObj.spellcastingList ? aObj.spellcastingList : {class : aCast, psionic : false};
		var aCastName = aCast === "any" ? "All spells" : (aObj.fullname ? aObj.fullname : aObj.subname ? aObj.subname : aObj.name) + " spells";

		//get a list of all the spells in the class' spell list and sort it
		var allSpells = CreateSpellList(aCastClass, false);
		allSpells.sort();

		//now make an array with one array for each spell level
		var spellsByLvl = OrderSpells(allSpells, "multi");
		//and add the complete list to as the first of the by level array
		spellsByLvl.unshift(allSpells);

		//now create amenu for this class and add it to the submenu array of AllSpellsMenu
		createMenu(AllSpellsMenu, aCastName, spellsByLvl);
	};

	//start an array of the different menus
	var spellsMenuArray = [AllSpellsMenu];

	var menuExtraTypes = [
		["with a Checkbox", "checkbox"],
		["with an 'Always Prepared' Checkbox", "markedbox"],
		["with 'At Will'", "atwill"],
		["with '1\xD7 Long Rest'", "oncelr"],
		["with '1\xD7 Short Rest'", "oncesr"],
		["Ask me for the first column", "askuserinput"]
	]
	//add a menu with a changed name
	for (var e = 0; e < menuExtraTypes.length; e++) {
		var aMenu = newObj(AllSpellsMenu);
		amendMenu(aMenu, menuExtraTypes[e][0], menuExtraTypes[e][1]);
		spellsMenuArray.push(aMenu);
	}

	//return the newly formed array
	return spellsMenuArray;
}
