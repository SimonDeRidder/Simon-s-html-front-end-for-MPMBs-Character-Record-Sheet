
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

//Make menu for the button on each Attack line and parse it to Menus.attacks
async function MakeAttackLineMenu_AttackLineOptions(MenuSelection, itemNmbr, prefix) {
	var attackMenu = [];
	if (!itemNmbr) itemNmbr = Number(event.target.name.slice(-1));
	if (prefix === undefined && event.target && event.target.name) {
		var QI = event.target.name.indexOf("Comp.") === -1;
		prefix = QI ? "" : getTemplPre(event.target.name, "AScomp", true);
	} else {
		if (prefix && !CurrentWeapons.compKnown[prefix]) return;
		var QI = prefix ? false : true;
		if (!prefix) prefix = "";
	}
	var Q = QI ? "" : "Comp.Use.";
	var maxItems = QI ? FieldNumbers.attacks : 3;

	var Fields = ReturnAttackFieldsArray(itemNmbr, prefix);
	var fldsBase = [
		["", ".Weapon"], //0
		["", ".To Hit"], //1
		["", ".Damage"], //2
		["", ".Weapon Selection"], //3
		["", ".Proficiency"], //4
		["", ".Mod"], //5
		["", ".Range"], //6
		["BlueText.", ".Weight"], //7
		["", ".Damage Type"], //8
		["BlueText.", ".To Hit Bonus"], //9
		["BlueText.", ".Damage Bonus"], //10
		["BlueText.", ".Damage Die"], //11
		["", ".Description"], //12
		["BlueText.", ".Weight Title"], //13
	];
	for (var i = 0; i < fldsBase.length; i++) {
		Fields[i] = prefix + fldsBase[i][0] + Q + "Attack." + itemNmbr + fldsBase[i][1];
	}

	var theField = What( Fields[ CurrentVars.manual.attacks ? 0 : 3] );
	var theWea = QI ? CurrentWeapons.known[itemNmbr - 1] : CurrentWeapons.compKnown[prefix][itemNmbr - 1];
	var weaWeight = theWea[0] && WeaponsList[theWea[0]] ? WeaponsList[theWea[0]].weight :
		theWea[0] && QI && CurrentCompRace[prefix] && CurrentCompRace[prefix].attacks ? CurrentCompRace[prefix].attacks[theWea[0]].weight :
		What(Fields[7]);
	var noUp = itemNmbr === 1;
	var noDown = itemNmbr === maxItems;

	if (!MenuSelection || MenuSelection === "justMenu") {
		var menuLVL1 = function (array) {
			for (var i = 0; i < array.length; i++) {
				attackMenu.push({
					cName : array[i][0],
					cReturn : "attack#" + array[i][1],
					bEnabled : array[i][2] !== undefined ? array[i][2] : true 
				});
			}
		};
		menuLVL1([
			//[name, return, enabled]
			["Move up", "up", !noUp],
			["Move down", "down", !noDown],
			["-", "-"],
			[QI ? "Copy to Adventuring Gear (page 2)" : "Copy to Equipment section", "copytoequip", weaWeight],
			["-", "-"],
			["Insert empty attack", "insert", theField && !noDown],
			["Delete attack", "delete"],
			["Clear attack", "clear"]
		]);

		var menuLVL2 = function (name, array, markThis) {
			var temp = {
				cName : name[0],
				oSubMenu : []
			}
			for (var i = 0; i < array.length; i++) {
				temp.oSubMenu.push({
					cName : array[i].capitalize(),
					cReturn : "attack#" + name[1] + "#" + array[i],
					bMarked : array[i] === markThis
				})
			}
			attackMenu.push(temp);
		};

		// Add the colour menu
		if (!typePF) {
			attackMenu.push({ cName : "-" });
			var ColorArray = ["black"];
			for (var key in ColorList) ColorArray.push(key);
			ColorArray.sort();
			ColorArray.unshift("same as headers", "same as dragon heads", "-");
			menuLVL2(["Outline Color", "colour"], ColorArray, What(Fields[13]));
		}

		// Add option to show dialog with calcChanges
		if (QI) {
			menuLVL1([
				//[name, return, enabled]
				["-", "-"],
				["Show things changing the attack automations", "showcalcs", ObjLength(CurrentEvals.atkStr) || ObjLength(CurrentEvals.spellAtkStr) ? true : false]
			]);
		}

		//set the complete menu as the global variable
		Menus.attacks = attackMenu;
		if (MenuSelection == "justMenu") return;
	}
	if (!MenuSelection) {
		MenuSelection = await getMenu("attacks");
	}
	if (!MenuSelection || MenuSelection[0] == "nothing" || MenuSelection[0] != "attack") return;

	// Start progress bar and stop calculations
	var thermoTxt = thermoM("Applying attack menu option...");
	var findWeaps = false;
	calcStop();

	switch (MenuSelection[1]) {
		case "up" :
			if (noUp) return;
		case "down" :
			if (MenuSelection[1] === "down" && noDown) return;
			thermoTxt = thermoM("Moving the attack " + MenuSelection[1] + "...", false);
			IsNotWeaponMenu = false;
			// Get the other fields
			var otherNmbr = MenuSelection[1] === "down" ? itemNmbr + 1 : itemNmbr - 1;
			var FieldsOth = ReturnAttackFieldsArray(otherNmbr, prefix);
			// Now swap all the fields
			for (var i = 0; i < Fields.length; i++) {
				var exclObj = {
					userName : i !== 12, // tooltip only for description
					submitName : i === 4, // submitname only not for proficiency
					defaultValue : !typePF && i === 13, // weight title keep default value
					noCalc : true
				};
				copyField(Fields[i], FieldsOth[i], exclObj, true);
				thermoM(i/(Fields.length)); //increment the progress dialog's progress
			}
			// Re-apply the attack colour, as this could've changed
			if (!typePF) {
				ApplyAttackColor(itemNmbr, undefined, Q, prefix);
				ApplyAttackColor(otherNmbr, undefined, Q, prefix);
			}
			IsNotWeaponMenu = true;
			findWeaps = true;
			break;
		case "copytoequip" :
			thermoTxt = thermoM("Copying to Equipment section...", false);
			AddToInv(QI ? "gear" : prefix + "comp", QI ? "r" : "l", What(Fields[3]), "", What(Fields[7]), "", false, false, false, true);
			break;
		case "insert" :
			WeaponInsert(itemNmbr, prefix);
			break;
		case "delete" :
			WeaponDelete(itemNmbr, prefix);
			break;
		case "clear" :
			thermoTxt = thermoM("Clearing attack...", false);
			WeaponClear(itemNmbr, prefix)
			findWeaps = true;
			break;
		case "colour" :
			thermoTxt = thermoM("Changing attack outline color...", false);
			ApplyAttackColor(itemNmbr, MenuSelection[2], Q, prefix);
			break;
		case "showcalcs" :
			var atkCalcStr = StringEvals(["atkStr", "spellAtkStr"]);
			if (atkCalcStr) ShowDialog("Things Affecting the Attack Automation", atkCalcStr);
			break;
	}

	//re-populate the CurrentWeapons variable because of the thing that just changed
	if (findWeaps && QI) {
		FindWeapons();
	} else if (findWeaps) {
		FindCompWeapons(undefined, prefix);
	}

	thermoM(thermoTxt, true); // Stop progress bar
};
