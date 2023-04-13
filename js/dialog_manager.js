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
			if (!canvas)
				canvas = addElementNode("div", document.body, null, modalCanvasID);
			canvas.style.display = "block";
			let dialog = addElementNode("div", document.body, null, modalDialogID);
			dialog.end = function (result) {
				this._return_value = result;
			};
			dialog.load = function (thingsToLoad /*Object*/) {
				for (let elementID in thingsToLoad) {
					document.getElementById(elementID).setAttribute('placeholder', thingsToLoad[elementID]);
				}
			};
			dialog.store = function () /*Object*/ {
				let results = {};
				for (let elementID of inputList) {
					results[elementID] = document.getElementById(elementID).value;
				}
				return results;
			};
			dialog.setForeColorRed = function (elementId /*str*/) {
				document.getElementById(elementId).style.color = "red";
			};
			dialog.visible = function (thingsToSetVisible /*Object*/) {
				for (let elementID in thingsToSetVisible) {
					if (thingsToSetVisible[elementID]) {
						document.getElementById(elementID).style.visibility = 'visible';
					} else {
						document.getElementById(elementID).style.visibility = 'hidden';
					}
				}
			};

			addElementNode("p", dialog, title, "modalTitle");
			if (icon) {
				console.log("Warning: icon in dialog not implemented yet");
				// TODO: add icon (addElementNode("img", dialog, "", "modalIcon").src = this.iconNames[icon];)
			}
			let modalContent = addElementNode("div", dialog, "", "modalContent");

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

		if ((body.type == 'view') || (body.type == 'cluster')) {
			let style = this._parse_element_style(body);
			if (body.type == 'cluster') {
				style.borderWidth = 1;
			}
			let viewElement = addElementNode('div', parent, null, null, 'modalDialogViewElement', style);
			for (let i = 0; i < body.elements.length; i++) {
				this._add_body_recursive(viewElement, body.elements[i], callbacksToInsert, inputList, buttonList, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'static_text') {
			let style = this._parse_element_style(body);
			addElementNode('div', parent, body.name, body.item_id, 'modalDialogStaticTextElement', style);
		} else if (body.type == 'ok') {
			let buttonLine = addElementNode(
				'div', parent, null, null, 'modalDialogButtonsElement', { gridTemplateColumns: 'auto' }
			);
			const { type, item_id, ok_name, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			let buttonName = body['ok_name'] || 'OK';
			this._add_button(buttonLine, 'ok', buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
		} else if (body.type == 'ok_cancel') {
			let buttonLine = addElementNode(
				'div', parent, null, null, 'modalDialogButtonsElement', { gridTemplateColumns: 'auto auto' }
			);
			const { type, item_id, ok_name, cancel_name, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			for (const buttonID of ['ok', 'cancel']) {
				let buttonName = body[buttonID + '_name'] || buttonID.replace(/^\w/, c => c.toUpperCase());
				this._add_button(buttonLine, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
			}
		} else if (body.type == 'ok_cancel_other') {
			let buttonLine = addElementNode(
				'div', parent, null, null, 'modalDialogButtonsElement', { gridTemplateColumns: 'auto auto auto' }
			);
			const { type, item_id, ok_name, cancel_name, other_name, ...body_style } = body;
			let style = this._parse_element_style(body_style);
			for (const buttonID of ['ok', 'other', 'cancel']) {
				let buttonName = body[buttonID + '_name'] || buttonID.replace(/^\w/, c => c.toUpperCase());
				this._add_button(buttonLine, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb);
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
			let element = addElementNode(tag, parent, null, body.item_id, null, style);
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
			addElementNode('div', parent, null, null, '', this._parse_element_style(body));
		} else if (body.type == 'image') {
			addElementNode('img', parent, null, body.item_id, '', this._parse_element_style(body));
		} else if (body.type == 'popup') {
			addElementNode('select', parent, null, body.item_id, '', this._parse_element_style(body));
		} else if (body.type == 'button') {
			let style = this._parse_element_style(body);
			this._add_button(
				parent = parent,
				buttonID = body.item_id,
				buttonName = body.name,
				callbacksToInsert = callbacksToInsert,
				buttonList = buttonList,
				style = style,
				dialog = dialog,
				monitor = monitor,
				resolve_cb = resolve_cb,
			)
		} else {
			throw "unimplemented element type for execDialog: " + body.type;
		}
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
		document.body.removeChild(dialog);

		let canvas = document.getElementById(modalCanvasID);
		if (canvas) {
			canvas.style.display = "none";
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
			style.fontSize = '16px';
		} else if (element.font == 'title') {
			style.fontSize = '18px';
			style.fontWeight = 'bold';
		} else if (element.font == 'palette') {
			style.fontSize = '12px';
		} else if (element.font == undefined) {
			style.fontSize = '14px';
		} else {
			throw "unimplemented font type for static_text element in execDialog: " + element.font;
		}
		if (element.char_width) {
			style.width = String(element.char_width) + 'ch';
		}
		if (element.width) {
			style.width = String(element.width) + 'px';
		}
		if (element.bold) {
			style.fontWeight = 'bold';
		}
		if (element.char_height) {
			style.height = String(element.char_height) + 'ch';
		}
		if (element.height) {
			style.height = String(element.height) + 'px';
		}
		if (element.wrap_name) {
			style.overflowWrap = 'break-word';
		}
		if (element.align_children == 'align_left') {
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
			style.display = 'table';
			style.width = '100%';
			style.tableLayout = 'fixed';
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
			// TODO
		} else if (element.gradient_type) {
			throw "gradient_type '" + element.gradient_type + "' not yet implemented";
		}
		return style;
	},

	_add_button: function (parent, buttonID, buttonName, callbacksToInsert, buttonList, style, dialog, monitor, resolve_cb) {
		let button = addElementNode("p", parent, null, null, "modalDialogButton", style);
		let link = addElementNode("a", button, buttonName, buttonID, modalDialogButtonLinkClass);
		link.href = "#";
		link.setAttribute('tabindex', "0");
		if (callbacksToInsert.has(buttonID)) {
			link.onclick = async function () {
				dialog._return_value = buttonID;
				await monitor[callbacksToInsert.get(buttonID)](dialog);
				resolve_cb(dialog._return_value);
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
	},
};
