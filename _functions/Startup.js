//functions to call at startup (in the right order)
async function InitializeEverything(noButtons, noVars) {
	calcStop();
	GetStringifieds(); //populate some variables stored in fields

	// Define some document level variables before and after running the user scripts
	if (!noVars) {
		InitiateLists();
		await fetchFixedAdditionalScripts();
		RunUserScript(true);
		spellsAfterUserScripts();
	};

	if (!minVer) {
		SetGearVariables();
		setListsUnitSystem(false, true);
		await getDynamicFindVariables();
		UpdateTooSkill();
		SetRichTextFields();
		MakeAdventureLeagueMenu();
	};

	SetHighlighting();
	if (!noButtons) MakeButtons();
	await calcCont(true);
	tDoc.dirty = false; //reset the dirty status, so the user is not asked to save without there having been any changes made
}

InitializeEverything();
var OpeningStatementVar = app.setTimeOut("OpeningStatement();", 3000);
