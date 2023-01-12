
//Check if the level or XP entered matches the XP or level
async function CalcExperienceLevel() {
	// initialise some variables
	var Level = Number(What("Character Level"));
	var exp = What("Total Experience");
	var getLvlXp = getCurrentLevelByXP(Level, exp);
	var LVLbyXP = getLvlXp[0];
	var XPforLVL = getLvlXp[1];

	// if the level and experience points match or both are 0, stop this function
	// also stop this function if the level is higher than the xp table allows (> 20)
	// also stop this function if the experience points are more than the xp table allows (> 1000000000)
	if (Level === LVLbyXP || (!Level && !exp) || Level >= ExperiencePointsList.length || LVLbyXP >= (ExperiencePointsList.length)) return;

	// create the strings for the dialog
	var LVLtxt = Level >= ExperiencePointsList.length ? "a level higher than 20" : "level " + Level;
	var XPtxt = !exp ? "no" : "only " + exp;
	var StringHigherLvl = "This character has " + XPtxt + " experience points. This is not enough to attain the level is currently has (" + Level + "). You need at least " + XPforLVL + " experience points for " + LVLtxt + ".\n\nYou can upgrade the experience points to " + XPforLVL + ", downgrade the level to " + LVLbyXP + ", or leave it as it is.";
	var StringHigherXP = "This character is level " + Level + ", but already has " + exp + " experience points. This amount is enough to attain level " + LVLbyXP + ".\n\nYou can upgrade the level to " + LVLbyXP + ", downgrade the experience points to " + XPforLVL + ", or leave it as it is.";

	var Experience_Dialog = {
		//when pressing the ok button
		commit : function (dialog) {
			dialog.end(Level > LVLbyXP ? "XPre" : "LVLr");
		},
		//when pressing the other button
		other : function (dialog) {
			dialog.end(Level > LVLbyXP ? "LVLr" : "XPre");
		},
		description : {
			name : "EXPERIENCE POINTS DIALOG",
			elements : [{
				type : "view",
				elements : [{
					type : "static_text",
					name : "Level and Experience Points do not match!",
					item_id : "head",
					alignment : "align_top",
					font : "heading",
					bold : true,
					height : 21,
					char_width : 45
				}, {
					type : "static_text",
					item_id : "text",
					alignment : "align_fill",
					font : "dialog",
					char_width : 45,
					wrap_name : true,
					name : Level > LVLbyXP ? StringHigherLvl : StringHigherXP
				}, {
					type : "ok_cancel_other",
					ok_name : Level > LVLbyXP ? "Upgrade XP to " + XPforLVL : "Upgrade level to " + LVLbyXP,
					other_name : Level > LVLbyXP ? "Downgrade level to " + LVLbyXP : "Downgrade XP to " + XPforLVL,
				}]
			}]
		}
	};

	let dia = await app.execDialog(Experience_Dialog);
	switch (dia) {
		case "LVLr":
			Value("Character Level", LVLbyXP);
			break;
		case "XPre":
			Value("Total Experience", XPforLVL);
			break;
	};
};


//parse the results from the menu into an array
async function getMenu(menuname) {
	try {
		var temp = await app.popUpMenuEx.apply(app, Menus[menuname]);
	} catch (err) {
		if (err == "error: unknown context menu: make sure it is async") {  // TODO: remove when all done
			throw err;
		}
		console.log(err);
		var temp = null;
	}
	return temp === null ? ["nothing", "toreport"] : temp.toLowerCase().split("#");
};


//call the inventory line menu and do something with the results
async function InventoryLineOptions() {

	var MenuSelection = await getMenu("gearline");

	if (!MenuSelection || MenuSelection[0] == "nothing") return;

	// Start progress bar and stop calculations
	var thermoTxt = thermoM("Applying inventory line menu option...");
	calcStop();

	var toRightCase = function (intxt) {
		return intxt.split(".").map(function (n) {
			return n == "eqp" ? n : n == "ascomp" ? "AScomp" : n.substr(0,1).toUpperCase() + n.substr(1);
		}).join(".");
	}
	var type = toRightCase(MenuSelection[0]);
	var lineNmbr = Number(MenuSelection[1]);

	var Fields = [
		type + "Gear Row " + lineNmbr,
		type + "Gear Amount " + lineNmbr,
		type + "Gear Weight " + lineNmbr,
		type + "Gear Location.Row " + lineNmbr
	];
	var FieldsValue = [
		What(Fields[0]),
		What(Fields[1]),
		What(Fields[2]),
		What(Fields[3])
	];

	switch (MenuSelection[2]) {
	 case "up" :
	 case "down" :
		thermoTxt = thermoM("Moving the gear " + MenuSelection[2] + "...", false); //change the progress dialog text
		var A = MenuSelection[2] === "up" ? -1 : 1;
		var FieldsNext = [
			type + "Gear Row " + (lineNmbr + A),
			type + "Gear Amount " + (lineNmbr + A),
			type + "Gear Weight " + (lineNmbr + A),
			type + "Gear Location.Row " + (lineNmbr + A)
		];
		var FieldsNextValue = [
			What(FieldsNext[0]),
			What(FieldsNext[1]),
			What(FieldsNext[2]),
			What(FieldsNext[3])
		];
		for (var H = 0; H < Fields.length; H++) {
			Value(FieldsNext[H], FieldsValue[H]);
			Value(Fields[H], FieldsNextValue[H]);
			thermoM(H/Fields.length); //increment the progress dialog's progress
		};
		break;
	 case "movecol" :
		var toCol = MenuSelection[3];
		thermoTxt = thermoM("Moving the gear to the " + (toCol.indexOf("r") !== -1 ? "right" : toCol.indexOf("m") !== -1 ? "middle" : "left") + " column...", false); //change the progress dialog text
		InvDelete(type, lineNmbr);
		AddToInv(type, MenuSelection[3], FieldsValue[0], FieldsValue[1], FieldsValue[2], FieldsValue[3], false, false, false, true);
		break;
	 case "movepage" :
		thermoTxt = thermoM("Moving the gear to another page...", false); //change the progress dialog text
		InvDelete(type, lineNmbr);
		var toPageType = toRightCase(MenuSelection[3]);
		AddToInv(toPageType, "l", FieldsValue[0], FieldsValue[1], FieldsValue[2], FieldsValue[3], false, false, false, true);
		break;
	 case "copy" :
		thermoTxt = thermoM("Copying the gear to magic items on page 3...", false); //change the progress dialog text
		AddMagicItem(FieldsValue[0], true, "", FieldsValue[2]);
		break;
	case "insert":
		thermoTxt = thermoM("Inserting empty gear line...", false); //change the progress dialog text
		InvInsert(type, lineNmbr);
		break;
	case "delete":
		thermoTxt = thermoM("Deleting gear line...", false); //change the progress dialog text
		InvDelete(type, lineNmbr);
		break;
	case "clear":
		thermoTxt = thermoM("Clearing gear line...", false); //change the progress dialog text
		tDoc.resetForm(Fields);
		break;
	case "gear":
	case "tool":
		var theGear = MenuSelection[2] === "gear" ? GearList[MenuSelection[3]] : ToolsList[MenuSelection[3]];
		thermoTxt = thermoM("Adding '" + theGear.name + "' to the line...", false); //change the progress dialog text
		var theNm = (lineNmbr > 1 && (/^.{0,2}-|backpack|\bbag\b|^(?=.*saddle)(?=.*bag).*$|\bsack\b|\bchest\b|, with|, contain/i).test(What(type + "Gear Row " + (lineNmbr - 1))) ? "- " : "") + theGear.name;
		Value(Fields[0], theNm);
		Value(Fields[1], theGear.amount);
		Value(Fields[2], What("Unit System") === "metric" ? RoundTo(theGear.weight * UnitsList.metric.mass, 0.001, true) : theGear.weight);
		break;
	};

	thermoM(thermoTxt, true); // Stop progress bar
};
