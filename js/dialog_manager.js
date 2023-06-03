// TODO: make map from 'name' to more unique element id
const modalDialogID = "modalDialog";
const modalCanvasID = "modalCanvas";
const modalDialogButtonLinkClass = "modalDialogButtonLink";

const dialogManager = {
	createDialog: async function (
		title /*str*/,
		body /*[Object]*/,
		monitor /*Object*/,
		icon = null /*todo*/,
		callbacksToInsert = new Map() /*Map[str, str]*/,
		initialiseCallback = null /*str|null*/,
	) /*str*/ {
		return new Promise((resolve, reject) => {
			let buttonList = [];
			let inputList = [];

			// add canvas and dialog to document
			let canvas = document.getElementById(modalCanvasID);
			if (!canvas) {
				canvas = addElementNode("div", document.body, null, modalCanvasID);
			}
			canvas.style.display = "block";
			let dialog = document.getElementById(modalDialogID);
			if (dialog) {
				let i = 0;
				while (dialog) {
					i += 1;
					dialog = document.getElementById(modalDialogID + i);
				}
				dialog = addElementNode("div", document.body, null, modalDialogID + i, modalDialogID);
				dialog.idPrefix = 'dialog'+i;
			} else {
				dialog = addElementNode("div", document.body, null, modalDialogID, modalDialogID);
				dialog.idPrefix = '';
			}
			dialog.end = function (result) {
				resolve(result);
			};
			dialog.load = function (thingsToLoad /*Object*/) {
				for (let elementID in thingsToLoad) {
					let theElement = document.getElementById(dialog.idPrefix + elementID);
					if (theElement == null) {
						continue;
					}
					let elementType = theElement.getAttribute('elementType');
					if (elementType == 'edit_text') {
						theElement.setAttribute('placeholder', thingsToLoad[elementID]);
					} else if (elementType == 'image') {
						theElement.style.width = thingsToLoad[elementID].width + 'px';
						theElement.style.height = thingsToLoad[elementID].height + 'px';
						theElement.setAttribute('src', 'img/icons/' + thingsToLoad[elementID].name + '.ico');
					} else if (['button', 'static_text', 'link_text'].includes(elementType)) {
						theElement.innerText = thingsToLoad[elementID];
					} else if (['popup', 'hier_list_box'].includes(elementType)) {
						let currentParent;
						for (let i=theElement.options.length; i--;) {
							currentParent = theElement.options[i].parentElement;
							currentParent.removeChild(theElement.options[i]);
							if (
								(currentParent.tagName.toUpperCase() == 'OPTGROUP')
								&& (currentParent.children.length == 0)
							) {
								currentParent.parentElement.removeChild(currentParent);
							}
						}
						for (let optionName in thingsToLoad[elementID]){
							let optionList = {};
							let optionValue = thingsToLoad[elementID][optionName];
							if (Number.isInteger(optionValue)) {
								currentParent = theElement;
								optionList[optionName] = optionValue;
							} else {
								currentParent = document.createElement('optgroup');
								currentParent.setAttribute('label', optionName);
								theElement.appendChild(currentParent);
								optionList = optionValue;
							}
							for (let subOptionName in optionList) {
								let option = document.createElement('option');
								option.value = subOptionName;
								option.innerText = subOptionName;
								option.selected = optionList[subOptionName] == 1;
								currentParent.appendChild(option);
							}
						}
					} else {
						// 'view', 'cluster', 'ok', 'ok_cancel', 'ok_cancel_other', 'gap'
						throw "unknown element type for dialog.load: " + elementType;
					}
				}
			};
			dialog.store = function () /*Object*/ {
				let results = {};
				for (let elementID of inputList) {
					let theElement = document.getElementById(dialog.idPrefix + elementID);
					let elementType = theElement.getAttribute('elementType');
					if (elementType == 'edit_text') {
						results[elementID] = theElement.value;
					} else if (['button', 'static_text', 'link_text'].includes(elementType)) {
						results[elementID] = theElement.innerText;
					} else if (['popup', 'hier_list_box'].includes(elementType)) {
						results[elementID] = {};
						let elementParent;
						for (let it = 0; it < theElement.options.length; it++) {
							elementParent = theElement.options[it].parentElement;
							if (elementParent.tagName.toUpperCase() == 'OPTGROUP') {
								if (!(elementParent.label in results[elementID])) {
									results[elementID][elementParent.label] = {};
								}
								results[elementID][elementParent.label][theElement.options[it].value] = (it == theElement.selectedIndex) ? 1 : -1;
							} else {
								results[elementID][theElement.options[it].value] = (it == theElement.selectedIndex) ? 1 : -1;
							}
						}
					} else {
						throw "unknown element type for dialog.store: " + elementType;
					}
				}
				return results;
			};
			dialog.setForeColorRed = function (elementId /*str*/) {
				document.getElementById(dialog.idPrefix + elementId).style.color = "red";
			};
			dialog.visible = function (thingsToSetVisible /*Object*/) {
				for (let elementID in thingsToSetVisible) {
					if (thingsToSetVisible[elementID]) {
						document.getElementById(dialog.idPrefix + elementID).style.visibility = 'visible';
					} else {
						document.getElementById(dialog.idPrefix + elementID).style.visibility = 'hidden';
					}
				}
			};
			dialog.enable = function (thingsToEnable /*Object*/) {
				for (let elementID in thingsToEnable) {
					let element = document.getElementById(dialog.idPrefix + elementID);
					if (thingsToEnable[elementID]) {
						if (element.style.display == 'none') {
							element.style.display = (
								element.hasAttribute('displayBak') ? element.getAttribute('displayBak') : 'block'
							);
						}
					} else {
						element.setAttribute('displayBak', element.style.display)
						element.style.display = 'none';
					}
				}
			}
			dialog.focus = function (elementID /*String*/) {
				document.getElementById(dialog.idPrefix + elementID).focus();
			}

			addElementNode("p", dialog, title, dialog.idPrefix + "modalTitle", "modalTitle");
			if (icon) {
				console.log("Warning: icon in dialog not implemented yet");
				// TODO: add icon (addElementNode("img", dialog, "", "modalIcon").src = this.iconNames[icon];)
			}
			let modalContent = addElementNode("div", dialog, "", dialog.idPrefix + "modalContent", "modalContent");

			// add body
			for (let i = 0; i < body.length; i++) {
				this._add_body_recursive(modalContent, body[i], callbacksToInsert, inputList, buttonList, dialog, monitor, resolve);
			}

			// initialisation callback
			if (initialiseCallback !== null) {
				monitor[initialiseCallback](dialog);
			}

			// capture keyboard events
			// TODO: fix this
			// dialog.addEventListener("keydown", (event) => { this._keyboardHandler(event, buttonList); });

		}).finally(this._hide_modal);
	},

	_add_body_recursive: function (parent, body, callbacksToInsert, inputList, buttonList, dialog, monitor, resolve_cb) {
		if (!body.type) {
			throw "no type in body description for execDialog";
		}

		let element;
		if (body.type == 'view') {
			let style = this._parse_element_style(body);
			element = addElementNode('div', parent, null, dialog.idPrefix + body.item_id, 'modalDialogViewElement', style);
			for (let i = 0; i < body.elements.length; i++) {
				this._add_body_recursive(element, body.elements[i], callbacksToInsert, inputList, buttonList, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'cluster') {
			element = addElementNode('fieldset', parent, null, null, null, null);
			addElementNode('legend', element, body.name, null, null, null);
			let style = this._parse_element_style(body);
			style.borderWidth = 1;
			let container = addElementNode('div', element, null, dialog.idPrefix + body.item_id, 'modalDialogViewElement', style);
			for (let i = 0; i < body.elements.length; i++) {
				this._add_body_recursive(container, body.elements[i], callbacksToInsert, inputList, buttonList, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'static_text') {
			let style = this._parse_element_style(body);
			element = addElementNode('div', parent, body.name, dialog.idPrefix + body.item_id, 'modalDialogStaticTextElement', style);
		} else if (body.type == 'ok') {
			let containerFloat = (body.alignment == 'align_center') ? 'center' : ((body.alignment == 'align_right') ? 'right' : 'left');
			element = addElementNode(
				'div', parent, null, dialog.idPrefix + body.item_id, 'modalDialogButtonsElement', {gridTemplateColumns: 'auto', float: containerFloat}
			);
			const { type, item_id, ok_name, other_name, alignment, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			let buttonName = body['ok_name'] || 'OK';
			this._add_button(element, 'ok', buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
		} else if (body.type == 'ok_cancel') {
			let containerFloat = (body.alignment == 'align_center') ? 'center' : ((body.alignment == 'align_right') ? 'right' : 'left');
			element = addElementNode(
				'div', parent, null, dialog.idPrefix + body.item_id, 'modalDialogButtonsElement', {gridTemplateColumns: 'auto auto', float: containerFloat}
			);
			const { type, item_id, ok_name, cancel_name, other_name, alignment, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			for (const buttonID of ['ok', 'cancel']) {
				let buttonName = body[buttonID + '_name'] || buttonID.replace(/^\w/, c => c.toUpperCase());
				this._add_button(element, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'ok_cancel_other') {
			let containerFloat = (body.alignment == 'align_center') ? 'center' : ((body.alignment == 'align_right') ? 'right' : 'left');
			element = addElementNode(
				'div', parent, null, dialog.idPrefix + body.item_id, 'modalDialogButtonsElement', {gridTemplateColumns: 'auto auto auto', float: containerFloat}
			);
			const { type, item_id, ok_name, cancel_name, other_name, alignment, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			for (const buttonID of ['ok', 'other', 'cancel']) {
				let buttonName = body[buttonID + '_name'] || buttonID.replace(/^\w/, c => c.toUpperCase());
				this._add_button(element, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'edit_text') {
			let tag = 'input';
			let type = 'text';
			if (body.multiline) {
				tag = 'textarea';
				type = null;
				delete body.multiline;
			}
			let readonly = false;
			if ('readonly' in body) {
				readonly = body.readonly;
				delete body.readonly;
			}
			if (body.password != null) {
				throw "edit_text option password not implemented";
			}
			if (body.PopupEdit != null) {
				throw "edit_text option PopupEdit not implemented";
			}
			let spinEdit = false;
			if (body.SpinEdit != null) {
				spinEdit = body.SpinEdit;
				delete body.SpinEdit;
			}
			let style = this._parse_element_style(body);
			element = addElementNode(tag, parent, null, dialog.idPrefix + body.item_id, null, style);
			if (type != null) {
				element.setAttribute('type', type);
			}
			if (readonly) {
				element.setAttribute('readonly', true);
			}
			if (spinEdit) {
				element.setAttribute('type', 'number')
				element.setAttribute('step', 1)
			}
			if (callbacksToInsert.has(body.item_id)) {
				element.onchange = async function () {
					await monitor[callbacksToInsert.get(body.item_id)](dialog);
				};
			}
			inputList.push(body.item_id);
		} else if (body.type == 'gap') {
			element = addElementNode('div', parent, null, dialog.idPrefix + body.item_id, '', this._parse_element_style(body));
		} else if (body.type == 'image') {
			element = addElementNode('img', parent, null, dialog.idPrefix + body.item_id, '', this._parse_element_style(body));
		} else if (body.type == 'popup') {
			let style = this._parse_element_style(body);
			style.height = "27.5px";
			element = addElementNode('select', parent, null, dialog.idPrefix + body.item_id, '', style);
			if (callbacksToInsert.has(body.item_id)) {
				element.onchange = async function () {
					await monitor[callbacksToInsert.get(body.item_id)](dialog);
				};
			}
			inputList.push(body.item_id);
		} else if (body.type == 'button') {
			let style = this._parse_element_style(body);
			element = this._add_button(
				parent = parent,
				buttonID = body.item_id,
				buttonName = body.name.replace('&&', '&amp;'),
				callbacksToInsert = callbacksToInsert,
				buttonList = buttonList,
				style = style,
				dialog = dialog,
				monitor = monitor,
				resolve_cb = resolve_cb,
			)
		} else if (body.type == 'hier_list_box') {
			let style = this._parse_element_style(body);
			element = addElementNode('select', parent, null, dialog.idPrefix + body.item_id, 'modalDialogListBox', style);
			element.setAttribute('multiple',  true);
			if (callbacksToInsert.has(body.item_id)) {
				element.onclick = async function () {
					await monitor[callbacksToInsert.get(body.item_id)](dialog);
				};
			}
			inputList.push(body.item_id);
		} else if (body.type == 'link_text') {
			let style = this._parse_element_style(body);
			element = addElementNode('a', parent, null, dialog.idPrefix + body.item_id, null, style);
			element.href = "#";
			if (callbacksToInsert.has(body.item_id)) {
				element.onclick = async function () {
					await monitor[callbacksToInsert.get(body.item_id)](dialog);
				};
			}
			inputList.push(body.item_id);
		} else if (body.type == 'radio') {
			let { type, item_id, group_id, name, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			element = addElementNode('input', parent, '', item_id, null, style);
			element.setAttribute('type', 'radio');
			element.setAttribute('name', group_id);
			element.setAttribute('value', name);
			let labelElement = addElementNode('label', parent, name, null, null, style);
			labelElement.setAttribute('for', item_id);
		} else {
			throw "unimplemented element type for execDialog: " + body.type;
		}
		element.setAttribute('elementType', body.type);
	},

	_keyboardHandler: function (evt, buttonList) {
		evt = evt || window.event;
		let e = {
			target: evt.target || evt.srcElement,
			keyCode: evt.keyCode || evt.which || 0,
			shiftKey: evt.shiftKey,
			ctrlKey: evt.ctrlKey,
			altKey: evt.altKey,
		}
		evt.stopPropagation();
		evt.preventDefault();

		let el = e.target;
		if (el.className != modalDialogButtonLinkClass) {
			return;
		}
		let btn = el.parentNode;

		switch (e.keyCode) {
			case 13:
				if (el.onclick) el.onclick(); // enter
				break;
			case 9:  // tab
				let nextIndex = buttonList.indexOf(btn);
				if (e.shiftKey) {
					nextIndex -= 1;
				} else {
					nextIndex += 1;
				}
				nextIndex = (nextIndex + buttonList.length) % buttonList.length;
				buttonList[nextIndex].focus();
		};
	},

	_hide_modal: function () {
		let dialog = document.getElementById(modalDialogID);
		let i = 1;
		let upperDialog = document.getElementById(modalDialogID + i);
		if (upperDialog) {
			while (upperDialog) {
				i += 1;
				upperDialog = document.getElementById(modalDialogID + i);
			}
			document.body.removeChild(document.getElementById(modalDialogID + (i - 1)));
		} else {
			document.body.removeChild(dialog);

			let canvas = document.getElementById(modalCanvasID);
			if (canvas) {
				canvas.style.display = "none";
			}
		}
	},

	_parse_element_style: function (element /*Object*/) /*Object*/ {
		let styleElements = [
			'item_id', 'type', 'alignment', 'align_children', 'back_color', 'bold', 'char_height', 'char_width', 'font',
			'gradient_direction', 'gradient_type', 'height', 'margin_height', 'name', 'truncate', 'width', 'wrap_name',
		];
		let ignoredElements = ['elements'];
		for (let prop in element) {  // TODO: remove this check when complete
			if (!styleElements.includes(prop) && !ignoredElements.includes(prop)) {
				throw "unknown style in element for execDialog: " + prop;
			}
		}
		let style = { 'display': 'grid' };
		if (element.alignment == 'align_top') {
			style.textAlign = 'center';
		} else if (element.alignment == 'align_fill') {
			style.textAlign = 'left';
			style.width = '100%';
		} else if (element.alignment == 'align_left') {
			style.textAlign = 'left';
		} else if (element.alignment == 'align_right') {
			style.textAlign = 'right';
		} else if (element.alignment == 'align_center') {
			style.textAlign = 'center';
		} else if (element.alignment == 'align_offscreen') {
			style.display = 'none';
		} else if (element.alignment) {
			throw "unimplemented alignment for element in execDialog: " + element.alignment;
		}
		if (element.font == 'heading') {
			style.fontSize = '18px';
			style.paddingBottom = '5px';
		} else if (element.font == 'dialog') {
			style.fontSize = '14px';
		} else if (element.font == 'title') {
			style.marginTop = '2px';
			style.marginLeft = '2px';
			style.marginBottom = '2px';
			style.marginRight = '2px';
			style.fontSize = '20px';
			style.fontWeight = 'bold';
		} else if (element.font == 'palette') {
			style.fontSize = '12px';
		} else if (element.font == undefined) {
			style.fontSize = '14px';
		} else {
			throw "unimplemented font type for static_text element in execDialog: " + element.font;
		}
		if (element.char_width) {
			style.width = String(element.char_width * 20 / Number(style.fontSize.slice(0, 2))) + 'ch';
		}
		if (element.width) {
			style.width = String(element.width) + 'px';
		}
		if (element.bold) {
			style.fontWeight = 'bold';
		}
		if (element.char_height) {
			style.height = String(element.char_height * 20 / Number(style.fontSize.slice(0, 2))) + 'ch';
		}
		if (element.height) {
			style.height = String(element.height) + 'px';
		}
		if (element.wrap_name) {
			style.overflowWrap = 'break-word';
		}
		if (element.align_children == 'align_top') {
			style.display = 'flex';
			style.flexDirection = 'column';
			style.alignItems = 'center';
			style.justifyContent = 'center';
		} else if (element.align_children == 'align_left') {
			style.display = 'flex';
			style.flexDirection = 'column';
			style.alignItems = 'left';
			style.justifyContent = 'left';
		} else if (element.align_children == 'align_row') {
			style.display = 'flex';
			style.flexDirection = 'row';
		} else if (element.align_children == 'align_center') {
			style.display = 'flex';
			style.flexDirection = 'column';
			style.alignItems = 'center';
			style.justifyContent = 'center';
		} else if (element.align_children == 'align_distribute') {
			style.display = 'inline-flex';
			style.width = '100%';
		} else if (element.align_children) {
			throw "align_children '" + element.align_children + "' not yet implemented";
		}
		if (element.truncate == 'truncate_end') {
			style.textOverflow = 'ellipsis';
		} else if (element.truncate) {
			throw "truncate '" + element.truncate + "' not yet implemented";
		}
		if (element.margin_height) {
			style.marginTop = element.margin_height;
		}
		if (element.back_color == 'dialogBackground') {
			style.backgroundColor = 'white';
		} else if (element.back_color == 'windowBackground') {
			style.backgroundColor = 'var(--background)';
		} else if (element.back_color) {
			throw "back_color '" + element.back_color + "' not yet implemented";
		}
		if (element.gradient_direction == 'topToBottom') {
			// TODO
		} else if (element.gradient_direction) {
			throw "gradient_direction '" + element.gradient_direction + "' not yet implemented";
		}
		if (element.gradient_type == 'normalToDark') {
			// TODO: actual gradient
			style.backgroundColor = '#d0d0d0';
		} else if (element.gradient_type) {
			throw "gradient_type '" + element.gradient_type + "' not yet implemented";
		}
		return style;
	},

	_add_button: function (parent, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb) {
		let button = addElementNode("p", parent, null, null, "modalDialogButton", style);
		let link = addElementNode("a", button, buttonName, dialog.idPrefix + buttonID, modalDialogButtonLinkClass);
		link.href = "#";
		link.setAttribute('tabindex', "0");
		if (callbacksToInsert.has(buttonID)) {
			link.onclick = async function () {
				await monitor[callbacksToInsert.get(buttonID)](dialog);
				if (callbacksToInsert.get(buttonID) == 'commit') {
					resolve_cb(buttonID);
				}
			};
		} else {
			link.onclick = function () {
				resolve_cb(buttonID);
			};
		}
		if (buttonList.length == 0) {
			link.focus();
		}
		buttonList.push(button);
		return link;
	},
};
