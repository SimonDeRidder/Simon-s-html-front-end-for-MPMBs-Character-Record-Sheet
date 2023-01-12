
//replaced to work without event context
function UpdateTooSkillNoEvent() {
	var TooSkillTxt = What("Too Text").toLowerCase();
	var Ability = "Too";
	for (var i = 0; i < AbilityScores.abbreviations.length; i++) {
		if (TooSkillTxt.indexOf("(" + AbilityScores.abbreviations[i].toLowerCase() + ")") !== -1) {
			Ability = AbilityScores.abbreviations[i];
			break;
		}
	}
	SkillsList.abilityScores[SkillsList.abbreviations.indexOf("Too")] = Ability;
	SkillsList.abilityScoresByAS[SkillsList.abbreviations.indexOf("Too")] = Ability;
}


//functions to call at startup (in the right order)
function InitializeEverything(noButtons, noVars) {
	if (!minVer) Hide("d20warning");
	calcStop();
	GetStringifieds(); //populate some variables stored in fields

	// Define some document level variables before and after running the user scripts
	if (!noVars) {
		InitiateLists();
		RunUserScript(true);
		spellsAfterUserScripts();
	};

	if (!minVer) {
		SetGearVariables();
		setListsUnitSystem(false, true);
		getDynamicFindVariables();
		UpdateTooSkillNoEvent();
		SetRichTextFields();
		MakeAdventureLeagueMenu();
	};

	SetHighlighting();
	if (!noButtons) MakeButtons();
	calcCont(true);
	tDoc.dirty = false; //reset the dirty status, so the user is not asked to save without there having been any changes made
}

InitializeEverything();
var OpeningStatementVar = app.setTimeOut("OpeningStatement();", 3000);