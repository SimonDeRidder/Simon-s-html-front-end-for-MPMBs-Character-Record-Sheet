//see if the JS file is installed
try {
	var MPMBImportFunctionsInstalled = MPMBImportFunctions_isInstalled;
} catch (MPMBerrors) {
	var MPMBImportFunctionsInstalled = false;
}

async function ImportExport_Button() {
	if (minVer) {
		await ImportScriptOptions();
		return;
	};
	var theMenu = await getMenu("importexport");

	if (theMenu !== undefined && theMenu[0] !== "nothing") {
		switch (theMenu[1]) {
			case "script" :
				await ImportScriptOptions(theMenu);
				break;
			case "import" :
				await Import(theMenu[2]);
				break;
			case "export" :
				await MakeXFDFExport(theMenu[2]);
				break;
		};
	};
};


/* ---- the old, depreciated import function ---- */
async function Import(type) {

	//first ask if this sheet is already set-up the right way before importing and if we can continue
	var AskFirst = {
		cMsg : "This method is no longer supported and will result in your character only being partially imported. If you want to be guaranteed of a good import, use the option \"Import Directly from a MPMB's PDF\" instead!"+"\n\nBefore you import anything into this sheet, please make sure that the following things are set correctly. If you don't do this, not everything will import. You will have to make the following things identical to the sheet you exported the data from:" + "\n  \u2022  The unit and decimal system;" + "\n  \u2022  The layout of the pages.\n      In order to do this, you will have to hide and/or add pages in the same order as you did in the sheet you are importing from. This is because the moment you add an extra page (so after the first of its type), that page gets a name based on the location of that page in the document. That location is based solely on the pages that are visible at the time of itscreation.\n      For example, if the sheet you are importing from has two Adventurers Logsheet pages, and these were added after generating a Spell Sheet of three pages long, while all of the other pages were visible as well, the second Adventurers Logsheet page would have been generated as page number 12. In order for this sheet to properly receive the import for that page, you will first need to generate an Adventurers Logsheet page at page number 12." + "\n\n\nDo you want to continue importing?",
		nIcon : 2,
		cTitle : "Is everything ready for importing?",
		nType : 2
	};


	if (app.alert(AskFirst) !== 4) return;

	// Start progress bar and stop calculations
	var thermoTxt = thermoM("Importing the data...");
	calcStop();

	MakeMobileReady(false); // Undo flatten, if needed

	templateA = [
		["Template.extras.AScomp", What("Template.extras.AScomp")],
		["Template.extras.ASnotes", What("Template.extras.ASnotes")],
		["Template.extras.WSfront", What("Template.extras.WSfront")],
		["Template.extras.ALlog", What("Template.extras.ALlog")]
	];
	var locStateOld = What("Gear Location Remember").split(",");

	if (typeof ProcResponse === "undefined") {
		IsNotImport = false;
		ignorePrereqs = true;
		if (type === "fdf") {
			tDoc.importAnFDF();
		} else if (type === "xfdf") {
			tDoc.importAnXFDF();
		}
		if (What("Race Remember").split("-")[1]) await ApplyRace(What("Race Remember"));
		IsNotImport = true;
		ignorePrereqs = false;
	};

	GetStringifieds(); // Get the variables

	//set the values of the templates back
	for (var i = 0; i < templateA.length; i++) {
		Value(templateA[i][0], templateA[i][1]);
	}

	thermoM(13/25); //increment the progress dialog's progress
	thermoTxt = thermoM("Getting the sheet ready...", false); //change the progress dialog text

	//set the layer visibility to what the imported field says
	LayerVisibilityOptions();

	//set the visibility of Honor/Sanity as imported
	ShowHonorSanity();

	thermoM(14/25); //increment the progress dialog's progress

	if (CurrentVars.mobileset) CurrentVars.mobileset.active = false;

	thermoM(15/25); //increment the progress dialog's progress

	//set the visiblity of the text lines as the imported remember field has been set to
	ToggleWhiteout(CurrentVars.whiteout);

	thermoM(16/25); //increment the progress dialog's progress

	//set the text size for multiline fields as the imported remember field has been set to
	ToggleTextSize(CurrentVars.fontsize);

	thermoM(17/25); //increment the progress dialog's progress

	//set the visiblity of the manual attack fields on the first page as the imported remember field has been set to
	if (CurrentVars.manual.attacks) ToggleAttacks(true);

	thermoM(18/25); //increment the progress dialog's progress

	//set the visiblity of the adventure league as the imported field has been set to
	if (What("League Remember") === "On") {
		await ToggleAdventureLeague({
			dci : true,
			factionrank : true,
			renown : true,
			actions : true,
			asterisks : true
		});
	} else {
		try {
			var theAdvL = eval(What("League Remember"));
			await ToggleAdventureLeague({
				dci : theAdvL.dci,
				factionrank : theAdvL.factionrank,
				renown : theAdvL.renown,
				actions : theAdvL.actions,
				asterisks : theAdvL.asterisks
			});
		} catch (e) {
			global.docTo.resetForm(["League Remember"]);
		};
	};

	thermoM(19/25); //increment the progress dialog's progress

	//set the visiblity of the Blue Text fields as the imported remember field has been set to
	ToggleBlueText(CurrentVars.bluetxt);

	thermoM(20/25); //increment the progress dialog's progress

	//set the visiblity of the spell slots on the first page as the imported remember field has been set to
	SetSpellSlotsVisibility();

	thermoM(21/25); //increment the progress dialog's progress

	//set the visiblity of the location columns as the imported remember field has been set to

	var locStateNew = What("Gear Location Remember").split(",");
	if (locStateNew[0] !== locStateOld[0]) { //only do something if current visiblity (locStateOld) is not what was imported
		HideInvLocationColumn("Adventuring Gear ", locStateOld[0] === "true");
	}
	if (locStateNew[1] !== locStateOld[1]) { //only do something if current visiblity (locStateOld) is not what was imported
		HideInvLocationColumn("Extra.Gear ", locStateOld[1] === "true");
	}

	thermoM(22/25); //increment the progress dialog's progress

	//set the visiblity of the attuned magical item line on the second page as the imported remember field has been set to
	if (What("Adventuring Gear Remember") !== false) {
		ShowAttunedMagicalItems(false);
	}

	thermoM(23/25); //increment the progress dialog's progress

	//set all the color schemes as the newly imported fields dictate
	setColorThemes();

	thermoM(24/25); //increment the progress dialog's progress

	//set the weight carried multiplier back one if a race with powerful build was added
	if (CurrentRace.known && (/powerful build/i).test(CurrentRace.trait) && What("Carrying Capacity Multiplier") === 3) {
		tDoc.getField("Carrying Capacity Multiplier").value -= 1;
	}

	app.alert({
		cMsg : "Be aware that some fields might not have imported correctly if you imported data that you exported from another version of this sheet.\n\nTooltips might no longer display the correct information after importing (especially if you exported all the fields and not just the non-calculated ones). Also, some fields may be left empty and other fields may display the wrong information. Unfortunately, this can't be helped.\n\nIt is recommended that you check all the fields whether or not correspond with the data that you wanted to import.\n\nUnfortunately, the portrait and symbol on the fourth page can't be imported, you will have to re-do them manually.\n\nIf the sheet you exported information from has extra pages added (e.g. two companion pages, or multiple adventurers logsheets), than those will only be imported if you create those pages first in this document as well, in the exact same order as you did in the previous document.\n\nThe following only applies if you are importing from a version before v11:\nIf you imported a class and/or race that has any options that are selected via the buttons on the second page, then please select those features that grant spellcasting again (even if they are already displayed). Selecting them again will give the automation the information necessary to produce the proper Spell Sheets.",
		nIcon : 1,
		cTitle : "Notes on Importing",
		nType : 0
	});

	thermoM(thermoTxt, true); // Stop progress bar

	//re-apply stuff just as when starting the sheet
	await InitializeEverything();

	tDoc.dirty = true;
};

/* ---- the old, depreciated export functions ---- */
//Export only the parts of the sheet that are unaffected by automation
function MakeExportArray() {
	var notExport = [
		"Spell DC 1 Mod",
		"Spell DC 2 Mod",
		"Speed Remember",
		"Racial Traits",
		"Class Features",
		"Proficiency Armor Light",
		"Proficiency Armor Medium",
		"Proficiency Armor Heavy",
		"Proficiency Shields",
		"Proficiency Weapon Simple",
		"Proficiency Weapon Martial",
		"Proficiency Weapon Other",
		"Background Feature",
		"Background Feature Description",
		"SheetInformation",
		"SpellSheetInformation",
		"CopyrightInformation",
		"Opening Remember"
	]
	var tempArray = [];
	for (var F = 0; F < tDoc.numFields; F++) {
		var Fname = tDoc.getNthFieldName(F);
		var Fvalue = What(Fname) !== tDoc.getField(Fname).defaultValue;
		var Frtf = tDoc.getField(Fname).type === "text" && tDoc.getField(Fname).richText;
		var Fcalc = (/Bonus$/i).test(Fname) || tDoc.getField(Fname).calcOrderIndex === -1;
		if (!Frtf && Fvalue && Fcalc && notExport.indexOf(Fname) === -1 && Fname.indexOf("Limited Feature") === -1 && Fname.indexOf("SpellSlots") === -1 && !(/^(Comp.Use.)?Attack.\d.(?!Weapon Selection)|^Feat Description \d$|^Tool \d$|^Language \d$|^(bonus |re)?action \d$|^HD\d (Used|Level|Die|Con Mod)$|Wildshape.\d.|^Resistance Damage Type \d$|^Extra.Exhaustion Level \d$|^Extra.Condition \d+$|^Template\.extras.+$|spells\..*\.\d+|spellshead|spellsdiv|spellsgloss/i).test(Fname)) {
			tempArray.push(Fname);
		}
	}
	return tempArray.length > 0 ? tempArray : "";
}

//Export only the parts of the sheet that are unaffected by automation
function MakeEquipmentExportArray() {
	var toExport = [
		"Platinum Pieces",
		"Gold Pieces",
		"Electrum Pieces",
		"Silver Pieces",
		"Copper Pieces",
		"Lifestyle",
		"Extra.Other Holdings"
	];
	for (var i = 1; i <= FieldNumbers.gear; i++) {
		toExport.push("Adventuring Gear Row " + i);
		toExport.push("Adventuring Gear Location.Row " + i);
		toExport.push("Adventuring Gear Amount " + i);
		toExport.push("Adventuring Gear Weight " + i);
		if (!typePF && i <= 4) toExport.push("Valuables" + i);
		if (i <= FieldNumbers.magicitems) {
			toExport.push("Extra.Magic Item " + i);
			toExport.push("Extra.Magic Item Attuned " + i);
			toExport.push("Extra.Magic Item Description " + i);
			toExport.push("Extra.Magic Item Weight " + i);
		}
		if (i <= FieldNumbers.extragear) {
			toExport.push("Extra.Gear Row " + i);
			toExport.push("Extra.Gear Location.Row " + i);
			toExport.push("Extra.Gear Amount " + i);
			toExport.push("Extra.Gear Weight " + i);
		}
	}
	var tempArray = [];
	for (var F = 0; F < toExport.length; F++) {
		if (tDoc.getField(toExport[F]).type !== "checkbox" && What(toExport[F]) !== tDoc.getField(toExport[F]).defaultValue) {
			tempArray.push(toExport[F]);
		} else if (tDoc.getField(toExport[F]).type === "checkbox" && tDoc.getField(toExport[F]).isBoxChecked(0)) {
			tempArray.push(toExport[F]);
		}
	}
	return tempArray.length > 0 ? tempArray : "";
}

//Export only the parts of the sheet that are unaffected by automation
function MakeDescriptionExportArray() {
	var toExport = [
		"PC Name",
		"Player Name",
		"Height",
		"Weight",
		"Sex",
		"Hair colour",
		"Eyes colour",
		"Skin colour",
		"Age",
		"Alignment",
		"Faith/Deity",
		"Personality Trait",
		"Ideal",
		"Bond",
		"Flaw",
		"Background_History",
		"Background_Appearance",
		"Background_Enemies",
		"Background_Organisation",
		"Background_Faction.Text",
		"Background_FactionRank.Text",
		"Background_Renown.Text",
		"Comp.Desc.Name",
		"Comp.Desc.Sex",
		"Comp.Desc.Age",
		"Comp.Desc.Height",
		"Comp.Desc.Weight",
		"Comp.Desc.Alignment",
		"Notes.Left",
		"Notes.Right"
	];
	var tempArray = [];
	for (var F = 0; F < toExport.length; F++) {
		if (tDoc.getField(toExport[F]).type !== "checkbox" && What(toExport[F]) !== tDoc.getField(toExport[F]).defaultValue) {
			tempArray.push(toExport[F]);
		} else if (tDoc.getField(toExport[F]).type === "checkbox" && tDoc.getField(toExport[F]).isBoxChecked(0)) {
			tempArray.push(toExport[F]);
		}
	}
	return tempArray.length > 0 ? tempArray : "";
}

async function MakeXFDFExport(partial) {
	if (partial !== "all") { // if given the command to only partially export
		await MakeSkillsMenu_SkillsOptions(["go", "alphabeta"]); // first make sure the skills are sorted alphabetically
		var theArray = partial === "equipment" ? MakeEquipmentExportArray() : (partial === "description" ? MakeDescriptionExportArray() : MakeExportArray());
		if (!theArray) {
			app.alert("Nothing was found that was worthy to export. None of the fields that are not auto-filled seem to have anything but there default values in them. If you still want to export the settings, try exporting all field values.", 0, 0, "Nothing to Export");
			return; // stop the function, because no fields were found that are exportable
		}
		var theSettings = {aFields: theArray};
	} else {
		var theSettings = {bAllFields: true};
	}
	try {
		tDoc.exportAsXFDF(theSettings);
	} catch (err) {
		var toExport = tDoc.exportAsXFDFStr(theSettings);

		var explainTXT = "This is a work-around for Acrobat Reader. It requires a little bit more work, but otherwise you will have to get Acrobat Pro in order to do this more easily. You will be able to import the file you create into MPMB's Character Sheet version 10.2 or later.\nThe field below contains all the exported data in a XML format. All you have to do is copy this data and save it as an .xfdf file with UTF-8 encoding.";
		var explainTXT2 = app.platform === "WIN" ? "If you don't know how to do this, just follow the steps below:\n\nOn Windows:\n  1 - Open Notepad and copy the complete content of the field below into it;\n  2 - On the Notepad menu bar, select File -- Save;\n  3 - Change the file name to anything you like, as long as it ends with \".xfdf\" (instead of \".txt\");\n  4 - At Encoding, choose \"UTF-8\";\n  5 - Press Save." : " If you don't know how to do this, just follow the steps below:\n\nOn Mac:\n  1 - Open TextEdit and copy the complete content of the field below into it;\n  2 - On the TextEdit menu bar, select Format -- Make Plain Text;\n  3 - Then, on the TextEdit menu bar, select File -- Save As;\n  4 - Change the file name to anything you like, as long as it ends with \".xfdf\" (instead of \".txt\");\n  5 - At Plain Text Encoding, choose \"UTF-8\";\n  6 - Press Save.";

		var DisplayExport_dialog = {

			initialize: function(dialog) {
				dialog.load({
					"expo": toExport
				});
			},

			description : {
				name : "XFDF FILE CREATION DIALOG",
				elements : [{
					type : "view",
					elements : [{
						type : "view",
						elements : [{
							type : "static_text",
							item_id : "head",
							alignment : "align_fill",
							font : "heading",
							bold : true,
							height : 21,
							char_width : 39,
							name : "Create a .xfdf file from the text below"
						}, {
							type : "static_text",
							item_id : "txt0",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							char_width : 55,
							name : explainTXT
						}, {
							type : "static_text",
							item_id : "txt1",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							char_width : 55,
							name : explainTXT2
						}, {
							type : "edit_text",
							item_id : "expo",
							alignment : "align_fill",
							multiline: true,
							char_height : 35,
							char_width : 55
						}, {
							type : "gap",
							height : 5
						}]
					}, {
						type : "ok"
					}]
				}]
			}
		}
		app.execDialog(DisplayExport_dialog);
	}
};

//add a script to be run upon start of the sheet
async function AddUserScript(retResDia) {
	var theUserScripts = What("User Script").match(/(.|\r){1,65500}/g);
	if (!theUserScripts) theUserScripts = [];
	var defaultTxt = toUni("The JavaScript") + " you paste into the field below will be run now and whenever the sheet is opened, using eval(). If that add-on script results in an error you will be informed immediately and the script will not be added to the sheet.\n" + toUni("This overwrites") + " whatever code you have previously added to the sheet using this dialog.\n" + toUni("Resetting the sheet is recommended") + " before you enter any custom content into it.";
	var defaultTxt2 = "Be warned, things you do here can break the sheet! You can ask MorePurpleMoreBetter for help using the contact bookmarks.";
	var extraTxt = toUni("A character limit of 65642") + " applies to the area below. You can add longer scripts with the \"Open Another Dialog\" button. When you press \"Add Script to Sheet\", the code of all dialogs will be joined together (with no characters put inbetween!), is subsequently run/tested and added to the sheet as a whole.";
	var extraTxt2 = "An error will result in all content being lost, so please save it somewhere else before exiting this dialog!";
	var getTxt = toUni("Pre-Written Add-on Scripts") + " can be found using the \"Get Add-on Scripts\" button.\nIt will bring you to the MPMB Community Add-on Script Index, which is a listing of links to all content add-on scripts made by fans and MPMB.";
	var getTxt2 = toUni("Using the proper JavaScript syntax") + ", you can add homebrew classes, races, weapons, feats, spells, backgrounds, creatures, etc. etc.\nSection 3 of the " + toUni("FAQ") + " has information and links to resources about creating your own additions, as does the \"I don't get it?\" button.";
	var getTxt3 = toUni("Use the JavaScript Console") + " to better determine errors in your script (with the \"JavaScript Console\" button).";
	var diaIteration = 1;

	var tries = 0;
	var selBoxHeight = 340;
	do {
		try {
			var mons = app.monitors.primary();
			var resHigh = mons && mons[0] && mons[0].rect ? mons[0].rect[3] : false;
			if (resHigh && resHigh < 900) selBoxHeight = Math.max(100, 340 - (900 - resHigh));
			tries = 100;
		} catch (e) {
			tries += 1;
		}
	} while (tries < 5);

	var getDialog = async function() {
		var diaMax = Math.max(theUserScripts.length, diaIteration);
		var moreDialogues = diaMax > diaIteration;
		var AddUserScript_dialog = {
			initScripts : theUserScripts,
			iteration : diaIteration,
			diaMax : diaMax,
			script: theUserScripts.length >= diaIteration ? theUserScripts[diaIteration - 1] : "",

			initialize: function(dialog) {
				dialog.load({
					"img1" : allIcons.import,
					"jscr" : this.script,
					"head" : "Manually add custom JavaScript that is run on startup (dialog " + this.iteration + "/" + this.diaMax + ")"
				});
				dialog.enable({
					bPre : this.iteration > 1
				});
				dialog.setForeColorRed("txtB");
				dialog.setForeColorRed("txtF");
			},
			commit: function(dialog) { // called when OK pressed
				var results = dialog.store();
				this.script = results["jscr"];
			},
			other: function(dialog) { // called when OTHER pressed
				var results = dialog.store();
				this.script = results["jscr"];
				dialog.end("next");
			},
			bFAQ: async function(dialog) {
				if (await getFAQ(false, true)) {
					dialog.end("bfaq");
					var results = dialog.store();
					this.script = results["jscr"];
				}
			},
			bPre: function(dialog) {
				var results = dialog.store();
				this.script = results["jscr"];
				dialog.end("bpre");
			},
			bWhy: function(dialog) { contactMPMB("how to add content"); },
			bCoC: function(dialog) { contactMPMB("community content"); },
			bCon: function(dialog) {
				var results = dialog.store();
				this.script = results["jscr"];
				dialog.end("bcon");
			},
			description : {
				name : "MANUAL CUSTOM SCRIPT DIALOG",
				first_tab : "OKbt",
				elements : [{
					type : "view",
					align_children : "align_left",
					elements : [{
						type : "view",
						elements : [{
							type : "view",
							align_children : "align_row",
							elements : [{
								type : "image",
								item_id : "img1",
								height : 20,
								width : 20
							}, {
								type : "static_text",
								item_id : "head",
								alignment : "align_fill",
								font : "heading",
								bold : true,
								height : 21,
								width : 720
							}]
						}, {
							type : "static_text",
							item_id : "txtD",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : diaIteration === 1,
							char_height : -1,
							width : 750,
							name : diaIteration !== 1 ? "" : defaultTxt
						}, {
							type : "static_text",
							item_id : "txtB",
							alignment : "align_fill",
							font : "dialog",
							bold : true,
							wrap_name : diaIteration === 1,
							char_height : -1,
							width : 750,
							name : diaIteration !== 1 ? "" : defaultTxt2
 						}, {
							type : "cluster",
							width : 750,
							font : "heading",
							bold : true,
							name : "How to get/make the JavaScript script to enter here?",
							elements : [{
								type : "view",
								align_children : "align_distribute",
								elements : [{
									type : "button",
									item_id : "bCoC",
									name : "Get Add-on Scripts",
									font : "dialog",
									bold : true
								}, {
									type : "button",
									item_id : "bWhy",
									name : "I don't get it?",
									font : "dialog",
									bold : true
								}, {
									type : "button",
									item_id : "bFAQ",
									name : "Open the FAQ",
									font : "dialog",
									bold : true
								}, {
									type : "button",
									item_id : "bCon",
									name : "JavaScript Console",
									font : "dialog",
									bold : true
								}]
							}, {
								type : "static_text",
								item_id : "txtG",
								alignment : "align_fill",
								font : "dialog",
								wrap_name : true,
								width : 720,
								name : getTxt
							}, {
								type : "static_text",
								item_id : "txtH",
								alignment : "align_fill",
								font : "dialog",
								wrap_name : true,
								width : 720,
								name : getTxt2
							}, {
								type : "static_text",
								item_id : "txtI",
								alignment : "align_fill",
								font : "dialog",
								wrap_name : true,
								width : 720,
								name : getTxt3
							}]
						}, {
							type : "static_text",
							item_id : "txtE",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							width : 750,
							name : extraTxt
						}, {
							type : "static_text",
							item_id : "txtF",
							alignment : "align_fill",
							font : "dialog",
							bold : true,
							wrap_name : true,
							width : 750,
							name : extraTxt2
						}, {
							type : "edit_text",
							item_id : "jscr",
							alignment : "align_fill",
							multiline: true,
							height : selBoxHeight,
							width : 750
						}, {
							type : "gap",
							height : 5
						}]
					}, {
						type : "view",
						align_children : "align_row",
						alignment : "align_fill",
						elements : [{
							type : "button",
							name : "<< Go to Previous Dialog",
							item_id : "bPre",
							alignment : "align_left"
						}, {
							type : "ok_cancel_other",
							other_name : "Open Another Dialog",
							ok_name : "Add Script to Sheet",
							item_id : "OKbt",
							alignment : "align_right"
						}]
					}]
				}]
			}
		};
 		if (moreDialogues) {
			setDialogName(AddUserScript_dialog, "OKbt", "type", "ok_cancel");
			setDialogName(AddUserScript_dialog, "OKbt", "ok_name", "Go to Next Dialog >>");
		};
		var theDialog = await app.execDialog(AddUserScript_dialog);
		theUserScripts[diaIteration - 1] = AddUserScript_dialog.script;
		if (clean(AddUserScript_dialog.script, [" ", "\t"]).slice(-1) === "}") theUserScripts[diaIteration - 1] += ";\n";
		if (theDialog === "ok" && moreDialogues) theDialog = "next";
		return theDialog;
	};

	do {
		var askForScripts = await getDialog();
		if (askForScripts === "bpre") {
			diaIteration -= 1;
		} else if (askForScripts === "bfaq") {
			await getFAQ(["faq", "pdf"]);
		} else if (askForScripts === "bcon") {
			console.println("\nYour code has been copied below, but hasn't been commited/saved to the sheet!\nYou can run code here by selecting the appropriate lines and pressing " + (isWindows ? "Ctrl+Enter" : "Command+Enter") + ".\n\n" + theUserScripts.join(""));
			console.show();
		} else {
			diaIteration += 1;
		};
	} while (askForScripts !== "ok" && askForScripts !== "cancel" && askForScripts !== "bcon");

	if (askForScripts === "ok") {
		InitiateLists();
		theUserScripts = theUserScripts.join("");
		if (RunUserScript(false, theUserScripts)) {
			Value("User Script", theUserScripts);
			app.alert({
				cMsg : "Your script has been successfully added/changed in the sheet!\n\nYou will now be returned to the Source Selection Dialog so that you can choose with more detail how your script interact with the sheet.\n\nNote that once you close the Source Selection Dialog, all drop-down boxes will be updated so that your changes will be visible on the sheet. This can take some time.",
				nIcon : 3,
				cTitle : "Success!"
			});
			retResDia = "also";
		} else {
			InitiateLists();
			RunUserScript(false, false);
		};
		amendPsionicsToSpellsList();
	};
	if (retResDia) await resourceDecisionDialog(false, false, retResDia === "also"); // return to the Dialog for Selecting Resources
};

// Run the custom defined user scripts, if any exist
function RunUserScript(atStartup, manualUserScripts) {
	var ScriptsAtEnd = [];
	var ScriptAtEnd = [];
	var minSheetVersion = [0, ""];
	var RunFunctionAtEnd = function(inFunction) {
		if (inFunction && typeof inFunction === "function") ScriptAtEnd.push(inFunction);
	};
	var runIt = function(aScript, scriptName, isManual) {
		var RequiredSheetVersion = function(inNumber) {
			if (atStartup) return;
			var minSemVers = /-|\+|beta/i.test(inNumber.toString()) ? inNumber.toString().replace(/^\D+/, "").replace(/([^\-])\.?beta/, "$1-beta") : getSemVers(inNumber);
			var testNmbr = semVersToNmbr(minSemVers);
			if (testNmbr > minSheetVersion[0]) minSheetVersion = [testNmbr, minSemVers];
		};
		try {
			IsNotUserScript = false;
			ScriptAtEnd = [];
			minSheetVersion = [0, ""];
			eval(aScript);
			IsNotUserScript = true;
			if (ScriptAtEnd.length > 0) ScriptsAtEnd = ScriptsAtEnd.concat(ScriptAtEnd);
			if (sheetVersion < minSheetVersion[0]) {
				var failedTestMsg = {
					cMsg : 'The add-on script "' + scriptName + '" says it was made for a newer version of the sheet (v' + minSheetVersion[1] + "), and might thus not be compatible with this version of the sheet (v" + semVers + ").\n\nDo you want to continue using this add-on script in the sheet? If you select no, the add-on script will be removed.\n\nNote that you can update to the newer version of the sheet with the 'Get the Latest Version' bookmark!",
					nIcon : 2,
					cTitle : "Add-on script was made for newer version!",
					nType : 2
				};
				if (app.alert(failedTestMsg) !== 4) return false;
			};
			return true;
		} catch (err) {
			if ((/out of memory/i).test(e.toSource())) return "outOfMemory";
			IsNotUserScript = true;
			var forNewerVersion = sheetVersion < minSheetVersion[0];
			var eText = "The add-on script "+ (isManual ? "you entered" : '"' + scriptName + '"');
			eText += forNewerVersion ? " says it was made for a newer version of the sheet (v" + minSheetVersion[1] + "; this sheet is only v" + semVers + "). That is probably why " : " is faulty, ";
			eText += "it returns the following error when run:\n\"" + e;
			for (var e in err) eText += "\n " + e + ": " + err[e];
			eText += '"\n\n' + (isManual ? "Your add-on script has not been added to the sheet, please try again after fixing the problem." : "The add-on script has been removed from this pdf.") + "\n\nFor a more specific error, that includes the line number of the error, try running the add-on script from the JavaScript Console.\n\nPlease contact the author of the add-on script";
			app.alert({
				cMsg : eText,
				nIcon : 0,
				cTitle : forNewerVersion ? "Add-on script was made for newer version!" : "Error in running user add-on script"
			});
			return false;
		};
	};

	// first run the code added by importing whole file(s)
	var scriptsResult = true;
	var changesInFilesScript = false;
	for (var iScript in CurrentScriptFiles) {
		var runIScript = runIt(CurrentScriptFiles[iScript], iScript);
		if (!runIScript) {
			delete CurrentScriptFiles[iScript];
			changesInFilesScript = true;
			scriptsResult = runIScript;
		} else if (runIScript == "outOfMemory") {
			break;
		}
	};
	if (changesInFilesScript) SetStringifieds("scriptfiles");

	// secondly, run the manually added code
	var manualScript = manualUserScripts ? manualUserScripts : What("User Script");
	if (manualScript) {
		var manualScriptResult = runIt(manualScript, "manually entered using using the text dialog", manualUserScripts);
		if (!manualScriptResult) {
			if (manualUserScripts) return false;
			tDoc.resetForm(["User Script"]);
		}
	};

	// run the functions that are meant to be saved till the very end of all the scripts
	if (ScriptsAtEnd.length > 0) {
		var functionErrors = [];
		IsNotUserScript = false;
		for (var i = 0; i < ScriptsAtEnd.length; i++) {
			try { ScriptsAtEnd[i](); } catch (err) {
				functionErrors.push('The function starting with "' + ScriptsAtEnd[i].toString().slice(0,100) + '"\ngave the error:' + err);
			};
		};
		IsNotUserScript = true;
		if (!atStartup && functionErrors.length > 0) {
			app.alert({
				cMsg : "One or more of the script you entered has a 'RunFunctionAtEnd()' statement. One or more of those functions gave an error. The sheet can't tell you which of those gave an error exactly, but it can tell you what the errors are:\n\n" + functionErrors.join("\n\n"),
				nIcon : 0,
				cTitle : "Error in RunFunctionAtEnd() from user script(s)"
			});
		};
	};

	// fix wrong reference (common mistake when adding classes)
	deleteUnknownReferences();

	// when run at startup and one of the script fails, update all the dropdowns
	if (manualScriptResult == "outOfMemory" || runIScript == "outOfMemory") {
		outOfMemoryErrorHandling(atStartup);
	} else if (atStartup && (!scriptsResult || !manualScriptResult)) {
		UpdateDropdown("resources");
	} else if (!atStartup && manualUserScripts) { // i.e. run to test manual import with RunUserScript(false, Script);
		return manualScriptResult;
	} else if (!atStartup && !manualUserScripts) { // i.e. run to test file import with RunUserScript(false, false);
		return scriptsResult;
	};
};

// Fix a common mistake in adding classes, having subclass references that don't work
function deleteUnknownReferences() {
	// Loop through all classes
	for (var sClass in ClassList) {
		var oClass = ClassList[sClass];
		// If the subclasses attribute doesn't exist or is malformed, fix it
		if (!oClass.subclasses || !isArray(oClass.subclasses) || !isArray(oClass.subclasses[1])) {
			oClass.subclasses = [
				oClass.subclasses[0] && typeof oClass.subclasses[0] === "string" ? oClass.subclasses[0] : "Archetype",
				[]
			];
			continue;
		}
		// Loop through all the subclasses from end to start and delete any that don't exist in the ClassSubList object and any duplicates
		var arrDupl = [];
		for (var i = oClass.subclasses[1].length - 1; i >= 0; i--) {
			var sSubcl = oClass.subclasses[1][i];
			if (!ClassSubList[sSubcl] || arrDupl.indexOf(sSubcl) !== -1) {
				console.println("The subclass '" + sSubcl + "' for the class '" + oClass.name + "' is missing from the ClassSubList object, or appears multiple times in the `subclasses` attribute. Please contact its author to have this issue corrected. The subclass will be ignored for now.\nBe aware that if you add a subclass using the `AddSubClass()` function, you shouldn't list it in the `subclasses` attribute, the function will take care of that.");
				console.show();
				oClass.subclasses[1].splice(i, 1);
			} else {
				arrDupl.push(sSubcl);
			}
		}
	}
}

// Define some custom import script functions as document-level functions so custom scripts including these can still be run from console
function RequiredSheetVersion(inNumber) {
	var minSemVers = /-|beta|\+/i.test(inNumber.toString()) ? inNumber.toString().replace(/^\D+/, "").replace(/([^\-])\.?beta/, "$1-beta") : getSemVers(inNumber);
	var testNmbr = semVersToNmbr(minSemVers);
	if (sheetVersion < testNmbr) {
		app.alert({
			cMsg : "The RequiredSheetVersion() function in your script suggests that the script is made for a newer version, v" + minSemVers + ", of MPMB's Character Record Sheets.\nBe aware that this sheet is only v" + semVers + " and might thus not work properly.\nAlternatively, you might not be using the RequiredSheetVersion() function incorrectly.",
			nIcon : 2,
			cTitle : "Script was made for newer version!"
		});
	}
};
function RunFunctionAtEnd(inFunc) {
	if (!inFunc && typeof inFunc !== "function") return;
	var funcstart = inFunc.toString().replace(/function *\([^)]*\) *{(\r\n)*\t*/i,"").substr(0,50);
	app.alert({
		cMsg : "The script you are running from the console contains the function RunFunctionAtEnd(). This function can be exectured from the console, but will be executed immediately after you close this dialog, and not at the end of all the code you are trying to run from console. When you import this script as a file, or manually paste it into the dialog for scripts, it will be run at the end of all scripts as intended.\n\nAfter clicking 'OK', the function will be run that starts with the following:\n\t\"" + funcstart + "...\"",
		nIcon : 1,
		cTitle : "RunFunctionAtEnd() works different when executed from the console"
	});
	try {
		inFunc();
	} catch(e) {
		app.alert({
			cMsg : "The function entered in 'RunFunctionAtEnd()', that starts with:\n\t\"" + funcstart + "...\"\nproduces the following error, which might be because it was executed from the console:\n\n" + e,
			nIcon : 0,
			cTitle : "Error in RunFunctionAtEnd() from user script(s)"
		});
	};
};

// a way to add a racial variant without conflicts
function AddRacialVariant(race, variantName, variantObj) {
	race = race.toLowerCase();
	variantName = variantName.toLowerCase();
	if (!RaceList[race]) return;
	if (!RaceList[race].variants || !isArray(RaceList[race].variants)) RaceList[race].variants = [];
	var suffix = 1;
	while (RaceList[race].variants.indexOf(variantName) !== -1) {
		suffix += 1;
		variantName += suffix;
	};
	RaceList[race].variants.push(variantName);
	RaceSubList[race + "-" + variantName] = variantObj;
};

// a way to add a subclass without conflicts
function AddSubClass(iClass, subclassName, subclassObj) {
	iClass = iClass.toLowerCase();
	subclassName = subclassName.toLowerCase();
	if (!ClassList[iClass]) return;
	var suffix = 1;
	var fullScNm = iClass + "-" + subclassName;
	while (ClassList[iClass].subclasses[1].indexOf(fullScNm) !== -1 || ClassSubList[fullScNm]) {
		suffix += 1;
		fullScNm += suffix;
	};
	ClassList[iClass].subclasses[1].push(fullScNm);
	ClassSubList[fullScNm] = subclassObj;
	return fullScNm;
};

// a way to add a background variant without conflicts
function AddBackgroundVariant(background, variantName, variantObj) {
	background = background.toLowerCase();
	variantName = variantName.toLowerCase();
	if (!BackgroundList[background]) return;
	if (!BackgroundList[background].variant || !isArray(BackgroundList[background].variant)) BackgroundList[background].variant = [];
	var suffix = 1;
	var fullBvNm = background + "-" + variantName;
	while (BackgroundList[background].variant.indexOf(fullBvNm) !== -1) {
		suffix += 1;
		fullBvNm += suffix;
	};
	BackgroundList[background].variant.push(fullBvNm);
	BackgroundSubList[fullBvNm] = variantObj;
};

// A way to add an (extra)choice to a class feature / racial feature / feat / magic item
/* Input Valiables Definition
	pObj    parent object, e.g. ClassList.warlock.features["eldritch invocations"]
	cType   type of choice, false for `choice`, true for `extrachoice`
	cName   name of the choice as it will appear in the menu (with capitalisation)
	cObj    the choice object
	force   if != false, force creation of the (extra)choices array
	        if cType == true, use the force string for the extraname
	bSort	if != false sort the array after the choice was added
			Not for class features, where (extra)choices arrays are sorted before displaying the menu,
			but good for magic items, where the arrays are never sorted automatically.
*/
function AddFeatureChoice(pObj, cType, cName, cObj, force, bSort) {
	if (!pObj) return; // parent object doesn't exist
	var aObj = pObj; // the object where the (extra)choice will be added to
	var cNameLC = cName.toLowerCase();
	cType = cType ? "extrachoices" : "choices";
	if (!pObj[cType]) { // choice array doesn't exist
		if (!force) return; // no choice array and not forced, so quit now
		if (cType === "extrachoices" && typeof force == "string") {
			FixAutoSelForceChoices(pObj);
			if (pObj.choiceSetsExtrachoices) {
				pObj.extrachoicesRemember = [];
			}
			if (pObj.choices && pObj.defaultChoice) {
				pObj.choiceSetsExtrachoices = true;
				aObj = pObj[pObj.defaultChoice];
			}
			if (!aObj.extraname) aObj.extraname = force;
		}
		aObj[cType] = [];
	}
	// Stop if adding something that already exists, so no reason to continue
	if (aObj[cNameLC] && aObj[cNameLC].toSource() == cObj.toSource()) return;
	// when adding a new choice that contains extrachoices of its own
	if (cType === "choices") {
		if (cObj.extrachoices) {
			// copy the extrachoices for remembering the original value, if any
			if (pObj.extrachoices && !pObj.extrachoicesRemember) {
				pObj.extrachoicesRemember = pObj.extrachoices;
				pObj.extranameRemember = pObj.extraname;
				pObj.extraTimesRemember = pObj.extraTimes;
			}
			pObj.choiceSetsExtrachoices = true;
		}
		// also do something if it contains autoSelectExtrachoices
		if (cObj.autoSelectExtrachoices) {
			if (pObj.autoSelectExtrachoices && !pObj.autoSelectExtrachoicesRemember) {
				pObj.autoSelectExtrachoicesRemember = pObj.autoSelectExtrachoices;
			}
			FixAutoSelForceChoices(pObj, false, cObj);
		}
	}
	// See if something by its name already exists and amend it, if so
	var useName = cName;
	var suffix = 1;
	while (aObj[cType].indexOf(useName) !== -1 || aObj[useName.toLowerCase()]) {
		suffix += 1;
		useName = cName + " [" + suffix + "]";
	};
	// Add the new (extra)choice
	aObj[cType].push(useName);
	if (bSort) aObj[cType].sort();
	if (cType === "extrachoices" && aObj.extrachoicesRemember) pObj.extrachoicesRemember.push(useName);
	aObj[useName.toLowerCase()] = cObj;
}
// --- backwards compatibility --- //
function AddWarlockInvocation(invocName, invocObj) { // Add a warlock invocation
	AddFeatureChoice(ClassList.warlock.features["eldritch invocations"], true, invocName, invocObj);
};
function AddWarlockPactBoon(boonName, boonObj) { // Add a warlock pact boon
	AddFeatureChoice(ClassList.warlock.features["pact boon"], false, boonName, boonObj);
};

// a way to add fighting styles to multiple classes; fsName is how it will appear in the menu
function AddFightingStyle(classArr, fsName, fsObj) {
	if (classArr.indexOf("ranger") !== -1 && classArr.indexOf("rangerua") == -1 && ClassList["rangerua"]) classArr.push("rangerua");
	for (var i = 0; i < classArr.length; i++) {
		var aClass = ClassList[classArr[i]];
		var sClass = ClassSubList[classArr[i]];
		if (aClass) {
			AddFeatureChoice(aClass.features["fighting style"], false, fsName, fsObj);
			if (classArr[i] === "fighter" && ClassSubList["fighter-champion"]) {
				AddFeatureChoice(ClassSubList["fighter-champion"].features["subclassfeature10"], false, fsName, fsObj);
			}
		} else if (sClass) {
			for (var clFea in sClass.features) {
				var sFea = sClass.features[clFea];
				if (sFea.choices && (/^(?=.*fighting)(?=.*style).*$/i).test(sFea.name)) {
					AddFeatureChoice(sClass.features[clFea], false, fsName, fsObj);
				}
			}
		}
	};
};

// make an existing class feature into a feature with choices, and add the original as a default choice
function CreateClassFeatureVariant(clName, clFea, varName, varObj) {
	if (ClassList[clName] && ClassList[clName].features[clFea]) {
		var aFea = ClassList[clName].features;
	} else if (ClassSubList[clName] && ClassSubList[clName].features[clFea]) {
		var aFea = ClassSubList[clName].features;
	} else {
		return;
	}
	if (!aFea[clFea].choices) {
		// Create a new choice system, with the 'normal' feature as a choice that is selected by default
		var origFea = newObj(aFea[clFea]);
		var choiceNm = "[original] " + origFea.name;
		var choiceNmLC = choiceNm.toLowerCase();
		aFea[clFea] = {
			name : origFea.name + " or a Variant",
			source: origFea.source,
			minlevel : origFea.minlevel,
			description : '\n   Select ' + origFea.name + ' or a variant using the "Choose Feature" button above',
			choices : [choiceNm],
			defaultChoice : choiceNmLC,
			choiceSetsExtrachoices : origFea.extrachoices ? true : false
		}
		aFea[clFea][choiceNmLC] = origFea;
		if (origFea.autoSelectExtrachoices) {
			aFea[clFea].autoSelectExtrachoices = origFea.autoSelectExtrachoices;
			FixAutoSelForceChoices(aFea[clFea], origFea.extraname, origFea);
		}
		if (origFea.extrachoices) {	
			// add the extrachoices offered in the choice to the parent object
			for (var i = 0; i < origFea.extrachoices.length; i++) {
				var xtrStr = origFea.extrachoices[i].toLowerCase();
				if (origFea[xtrStr]) aFea[clFea][xtrStr] = origFea[xtrStr];
			}
		}
	}
	AddFeatureChoice(aFea[clFea], false, varName, varObj);
}

// Fix autoSelectExtrachoices
function FixAutoSelForceChoices(pObj, sExtraname, cObj) {
	if (!pObj.autoSelectExtrachoices) return;
	if (!isArray(pObj.autoSelectExtrachoices)) pObj.autoSelectExtrachoices = [pObj.autoSelectExtrachoices];
	for (var i = 0; i < pObj.autoSelectExtrachoices.length; i++) {
		var aObj = pObj.autoSelectExtrachoices[i];
		if (!aObj || !aObj.extrachoice) continue;
		// make sure the parent object has the extrachoice as an attribute
		if (cObj && cObj[aObj.extrachoice] && !pObj[aObj.extrachoice]) {
			pObj[aObj.extrachoice] = cObj[aObj.extrachoice];
		} else if (!pObj[aObj.extrachoice]) {
			continue;
		}
		// force the extraname per object, so it is never taken from the parent object
		if (!pObj[aObj.extrachoice].extraname && !aObj.extraname) {
			aObj.extraname = sExtraname ? sExtraname : pObj.extraname;
		}
	}
}

// side-loading a file and adding it to the field for safe-keeping
async function ImportUserScriptFile(filePath) {
	// open the dialog to select the file or URL
	var iFileStream = filePath ? await util.readFileIntoStream(filePath) : await util.readFileIntoStream();
	if (!iFileStream) return false;
	var iFileCont = await util.stringFromStream(iFileStream);
	if ((/<(!DOCTYPE )?html/i).test(iFileCont)) {
		// Import is probably an HTML file, lets try and get the JavaScript from it in case it's from GitHub or PasteBin
		var htmlAttr = {
			github : {
				"class" : "data",
				"nodeNm" : "table"
			},
			pastebin : {
				"class" : "textarea",
				"nodeNm" : "#text"
			}
		}
		var knownHTML = (/github/i).test(iFileCont) ? "github" : (/pastebin/i).test(iFileCont) ? "pastebin" : false;
		if (knownHTML) {
			try {
				var scriptContent = "", fndNode;
				var aDom = new Dom(iFileCont);
				var jsElem = aDom.getElementsByClassName(htmlAttr[knownHTML].class);
				if (jsElem.length !== 1) throw "didn't work as expected";
				for (var i = 0; jsElem[0].childNodes.length; i++) {
					if (jsElem[0].childNodes[i].nodeName == htmlAttr[knownHTML].nodeNm) {
						fndNode = jsElem[0].childNodes[i];
						scriptContent = decodeXml(fndNode.textContent).replace(/^\s+|\s+$/, '');
						break;
					}
				}
				if ( !scriptContent || ( /view raw/i.test(scriptContent) && /href=("|').*?raw=true\1/i.test(jsElem[0].innerHTML) ) ) {
					throw "didn't work as expected";
				} else if (knownHTML === "github") {
					scriptContent = scriptContent.replace(/(\n )+/g, '\n');
				}
				iFileCont = scriptContent;
			} catch (error) {
/* Uncomment for testing
				var eText = "Error importing HTML from " + knownHTML + ": " + error;
				for (var e in error) eText += "\n " + e + ": " + error[e];
				console.println(eText);
				console.show();
*/
				knownHTML = false;
			}
		}
		if (!knownHTML) {
			app.alert({
				cTitle : "Please select a JavaScript file",
				cMsg : "The file you imported is an HTML document (a website). Please make sure that the file you select to import is JavaScript.\n\nYou can create a JavaScript file by copying code, pasting it into your favourite plain-text editor (such as Notepad on Windows), and subsequently saving it. You don't necessarily need the .js file extension for the file to be importable into this character sheet." + (!isWindows ? "" : "\n\nNote that you can input a URL into the 'Open file' dialog, but that URL has to point to a plain code file. A good example of a URL that points to a plain code file is the URL you are send to when you select the 'Raw' option on GitHub: https://raw.githubusercontent.com/") + "\n\nThe file you selected will not be imported.",
				nIcon : 1
			});
			return false;
		}
	};
	var iFileName = iFileCont.match(/iFileName ?= ?("|')(.*?[^\\])\1/);
	if (iFileName) {
		iFileName = iFileName[2].replace(/\\/g, "");
		var iFileNameLC = iFileName.toLowerCase();
		var useFileName = util.printd("yyyy/mm/dd", new Date()) + " - " + iFileName
	} else {
		var useFileName = util.printd("yyyy/mm/dd HH:mm", new Date()) + " - " + "no iFileName";
	}
	var iFileNameMatch = false;
	if (iFileName) {
		for (var aFileName in CurrentScriptFiles) {
			var endFileName = aFileName.replace(/\d+\/\d+\/\d+ - /, "");
			if (endFileName.toLowerCase() === iFileNameLC) {
				iFileNameMatch = aFileName;
				break;
			};
		};
	};
	if (iFileNameMatch && CurrentScriptFiles[iFileNameMatch]) {
		var askToOverwrite = {
			cMsg : "There is already a file by the name \"" + endFileName + "\", do you want to overwrite it?\n\nIf you select 'No', the file will not be changed.",
			nIcon : 2, //question mark
			cTitle : "File already exists, overwrite it?",
			nType : 2, //Yes-No
		};
		if (app.alert(askToOverwrite) !== 4) return false;
		delete CurrentScriptFiles[iFileNameMatch];
	};
	CurrentScriptFiles[useFileName] = iFileCont;
	SetStringifieds("scriptfiles");
	return true;
};

// Open the dialog for importing whole files with content
async function ImportScriptFileDialog(retResDia) {
	var defaultTxt = "Import or delete files that add content and/or custom add-on scripts to the sheet.";
	var defaultTxt2 = "In modern operating systems, you can enter a URL in the 'Open' dialog directly instead of first downloading a file and then navigating to it.";
	var defaultTxt3 = "Use the \"Get Add-on Scripts\" buttons below to get pre-written files!";
	var getTxt2 = toUni("Using the proper JavaScript syntax") + ", you can add homebrew classes, races, weapons, feats, spells, backgrounds, creatures, etc. etc.\nSection 3 of the " + toUni("FAQ") + " has information and links to resources about creating your own additions, as does the \"I don't get it?\" button.";
	var getTxt = toUni("Pre-Written Add-on Scripts") + " can be found using the \"Get Add-on Scripts\" button.\nIt will bring you to the MPMB Community Add-on Script Index, which is a listing of links to all content add-on scripts made by fans and MPMB.";
	var getTxt3 = toUni("Use the JavaScript Console") + " to better determine errors in your script (with the \"JavaScript Console\" button).";
	var filesScriptRem = What("User_Imported_Files.Stringified");
	var dialogObj = {};
	for (var scriptFile in CurrentScriptFiles) {
		dialogObj[scriptFile] = -1;
	};

	var AddScriptFiles_dialog = {
		initialize: function(dialog) {
			dialog.load({
				img1 : allIcons.import,
				scrF : dialogObj,
				head : defaultTxt
			});
			dialog.setForeColorRed("txtB");
			dialog.enable({
				bRem : false,
				bSee : false
			});
		},
		commit: function(dialog) {},
		bFAQ: async function(dialog) {
			if (await getFAQ(false, true)) {
				dialog.end("bfaq");
				var results = dialog.store();
				this.script = results["jscr"];
			}
		},
		bWhy: function(dialog) { contactMPMB("how to add content"); },
		bCoC: function(dialog) { contactMPMB("community content"); },
		bCon: function(dialog) {
			var results = dialog.store();
			this.script = results["jscr"];
			dialog.end("bcon");
		},
		scrF: function(dialog) {
			var allElem = dialog.store()["scrF"];
			var remElem = GetPositiveElement(allElem);
			if (remElem) {
				var remElemNm = remElem.length > 50 ? remElem.substr(0,50) + "..." : remElem;
				dialog.load({
					bRem : "DELETE " + remElemNm,
					bSee : "SEE CONTENT of " + remElemNm
				});
				dialog.enable({
					bRem : true,
					bSee : true
				});
			};
		},
		bAdd: async function(dialog) {
			await ImportUserScriptFile();
			dialogObj = {};
			for (var scriptFile in CurrentScriptFiles) {
				dialogObj[scriptFile] = -1;
			};
			dialog.load({
				"scrF" : dialogObj,
				bRem : "DELETE selected file",
				bSee : "SEE CONTENT of selected file"
			});
			dialog.enable({
				bRem : false,
				bSee : false
			});
		},
		removeOrSee: async function(dialog, deleteIt) {
			var allElem = dialog.store()["scrF"];
			var fndElem = GetPositiveElement(allElem);
			if (!fndElem) return;
			if (CurrentScriptFiles[fndElem]) {
				if (deleteIt) {
					delete CurrentScriptFiles[fndElem];
					SetStringifieds("scriptfiles");
				} else {
					await ShowDialog("Content of '" + fndElem + "'", CurrentScriptFiles[fndElem]);
				}
			} else {
				app.alert("The name '" + fndElem + "' in the dialog was not found in any of the scripts the sheet. It will be removed from the dialog, but nothing in the sheet will change.");
				deleteIt = true;
			};
			if (deleteIt) {
				delete allElem[fndElem];
				dialogObj = allElem;
				dialog.load({ scrF : allElem });
			}
		},
		bRem: async function(dialog) { await this.removeOrSee(dialog, true); },
		bSee: async function(dialog) { await this.removeOrSee(dialog, false); },
		description : {
			name : "IMPORT CUSTOM SCRIPT DIALOG",
			first_tab : "OKbt",
			elements : [{
				type : "view",
				elements : [{
					type : "view",
					align_children : "align_left",
					elements : [{
						type : "view",
						align_children : "align_row",
						elements : [{
							type : "image",
							item_id : "img1",
							width : 20,
							height : 20
						}, {
							type : "static_text",
							item_id : "head",
							alignment : "align_fill",
							font : "heading",
							bold : true,
							height : 21,
							width : 720
						}]
					}, {
						type : "cluster",
						font : "heading",
						bold : true,
						name : "Current files with JavaScript additions",
						align_children : "align_row",
						elements : [{
							width : 300,
							height : 150,
							type : "hier_list_box",
							item_id : "scrF"
						}, {
							type : "view",
							elements : [{
								type : "view",
								align_children : "align_row",
								elements : [{
									type : "button",
									item_id : "bAdd",
									name : "Add file",
									font : "heading",
									bold : true
								}, {
									type : "static_text",
									item_id : "txtT",
									alignment : "align_fill",
									font : "dialog",
									bold : true,
									wrap_name : true,
									width : 300,
									name : defaultTxt2
								}]
							}, {
								type : "button",
								item_id : "bRem",
								name : "DELETE selected file",
								width : 380
							}, {
								type : "button",
								item_id : "bSee",
								name : "SEE CONTENT of selected file",
								width : 380
							}, {
								type : "static_text",
								item_id : "txtB",
								alignment : "align_fill",
								font : "dialog",
								bold : true,
								wrap_name : true,
								width : 380,
								name : defaultTxt3
							}]
						}]
					}, {
						type : "cluster",
						font : "heading",
						bold : true,
						name : "How to get/make the JavaScript files to enter here?",
						elements : [{
							type : "view",
							alignment : "align_fill",
							align_children : "align_row",
							width : 730,
							elements : [{
								type : "button",
								item_id : "bCoC",
								name : "Get Add-on Scripts",
								font : "dialog",
								bold : true
							}, {
								type : "button",
								item_id : "bWhy",
								name : "I don't get it?",
								font : "dialog",
								bold : true
							}, {
								type : "button",
								item_id : "bFAQ",
								name : "Open the FAQ",
								font : "dialog",
								bold : true
							}, {
								type : "button",
								item_id : "bCon",
								name : "JavaScript Console",
								font : "dialog",
								bold : true
							}]
						}, {
							type : "static_text",
							item_id : "txtC",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							width : 720,
							name : getTxt
						}, {
							type : "static_text",
							item_id : "txtD",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							width : 720,
							name : getTxt2
						}, {
							type : "static_text",
							item_id : "txtE",
							alignment : "align_fill",
							font : "dialog",
							wrap_name : true,
							width : 720,
							name : getTxt3
						}]
					}]
				}, {
					item_id : "OKbt",
					type : "ok_cancel",
					ok_name : "Apply changes",
					cancel_name : "Cancel changes"
				}]
			}]
		}
	};


	do {
		var scriptFilesDialog = await app.execDialog(AddScriptFiles_dialog);
		if (scriptFilesDialog === "bfaq") {
			await getFAQ(["faq", "pdf"]);
		} else if (scriptFilesDialog === "bcon") {
			console.println("\nAny changes you made in the import script files dialog have not been applied!\nYou can run code here by pasting it in, selecting the appropriate lines and pressing " + (isWindows ? "Ctrl+Enter" : "Command+Enter") + ".");
			console.show();
		};
	} while (scriptFilesDialog !== "ok" && scriptFilesDialog !== "bCon" && scriptFilesDialog !== "cancel");

	if (scriptFilesDialog === "ok") {
		if (filesScriptRem !== What("User_Imported_Files.Stringified")) { // only do something if anything changed!
			InitiateLists();
			var runScriptsTest = RunUserScript(false, false);
			if (!runScriptsTest) { // the scripts failed, so run them again just to be sure that no rogue elements end up in the variables
				InitiateLists();
				RunUserScript(false, false);
			}
			amendPsionicsToSpellsList();
			if (filesScriptRem !== What("User_Imported_Files.Stringified") || runScriptsTest) {
				retResDia = "also";
				app.alert({
					cMsg : (runScriptsTest ? "All" : "Some") + " of the script file(s) have been " + (runScriptsTest ? "successfully " : "") + "changed in the sheet!\n\nYou will now be returned to the Source Selection Dialog so that you can choose with more detail how your script interact with the sheet.\n\nNote that once you close the Source Selection Dialog, all drop-down boxes will be updated so that your changes will be visible on the sheet. This can take some time.",
					nIcon : 3,
					cTitle : runScriptsTest ? "Success!" : "Partial success"
				});
			};
		};
	} else {
		Value("User_Imported_Files.Stringified", filesScriptRem);
		CurrentScriptFiles = eval(filesScriptRem);
	};
	if (retResDia) await resourceDecisionDialog(false, false, retResDia === "also"); // return to the Dialog for Selecting Resources
};

// Open the menu to import materials
async function ImportScriptOptions(input) {
	var MenuSelection = input ? input : await getMenu("importscripts");
	if (MenuSelection === undefined || MenuSelection[0] === "nothing") return;
	switch (MenuSelection[2]) {
		case "file" :
			await ImportScriptFileDialog(MenuSelection[3]);
			break;
		case "manual" :
			await AddUserScript(MenuSelection[3]);
			break;
		case "onlinehelp" :
			contactMPMB("how to add content");
			break;
		case "content" :
			contactMPMB("community content");
			break;
	};
};
