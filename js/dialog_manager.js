
const modalDialogID = "modalDialog";
const modalCanvasID = "modalCanvas";
const modalDialogButtonLinkClass = "modalDialogButtonLink";

const dialogManager = {
	createDialog: async function (
		title /*str*/,
		body /*[Object]*/,
		icon=null /*todo*/,
		callbacksToInsert=new Map() /*Map[str, function]*/,
	) /*str*/ {
		return new Promise((resolve, reject) => {
			// add canvas and dialog to document
			let canvas = document.getElementById(modalCanvasID);
			if (!canvas)
				canvas = addElementNode("div", document.body, null, modalCanvasID);
			canvas.style.display = "block";
			let dialog = addElementNode("div", document.body, null, modalDialogID);
			dialog.end = function (result) {
				this._return_value = result;
			}

			addElementNode("p", dialog, title, "modalTitle");
			if (icon) {
				console.log("Warning: icon in dialog not implemented yet");
				// TODO: add icon (addElementNode("img", dialog, "", "modalIcon").src = this.iconNames[icon];)
			}
			let modalContent = addElementNode("div", dialog, "", "modalContent");

			// add body
			let buttonList = [];
			for (let i = 0; i < body.length; i++) {
				this._add_body_recursive(modalContent, body[i], callbacksToInsert, buttonList, dialog, resolve);
			}

			// capture keyboard events
			// TODO: fix this
			// dialog.addEventListener("keydown", (event) => { this._keyboardHandler(event, buttonList); });

		}).finally(this._hide_modal);
	},

	_add_body_recursive: function (parent, body, callbacksToInsert, buttonList, dialog, resolve_cb) {
		if (!body.type) {
			throw "no type in body description for execDialog";
		}

		if (body.type == 'view') {
			let viewElement = addElementNode('div', parent, null, null, 'modalDialogViewElement');
			for (let i = 0; i < body.elements.length; i++) {
				this._add_body_recursive(viewElement, body.elements[i], callbacksToInsert, buttonList, dialog, resolve_cb);
			}
		} else if (body.type == 'static_text') {
			let style = this._parse_static_text_style(body);
			addElementNode('div', parent, body.name, body.item_id, 'modalDialogStaticTextElement', style);
		} else if (body.type == 'ok_cancel_other') {
			let buttonLine = addElementNode(
				'div', parent, null, null, 'modalDialogButtonsElement', {gridTemplateColumns: 'auto auto auto'}
			);
			for (const buttonID of ['ok', 'other', 'cancel']) {
				this._add_button(buttonLine, buttonID, body, callbacksToInsert, buttonList, dialog, resolve_cb);
			}
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

	_parse_static_text_style: function(element /*Object*/) /*Object*/ {
		for (let prop in element) {  // TODO: remove this check when complete
			if (!['type', 'name', 'item_id', 'alignment', 'font', 'bold', 'height', 'char_width', 'wrap_name'].includes(prop)) {
				throw "unknown style in static_text for execDialog: " + prop;
			}
		}
		let style = {};
		if (element.alignment == 'align_top') {
			style.textAlign = 'center';
			style.display = 'grid';
		} else if (element.alignment == 'align_fill') {
			style.textAlign = 'left';
			style.width = '100%';
			style.display = 'grid';
		} else {
			throw "unimplemented alignment for static_text element in execDialog: " + element.alignment;
		}
		if (element.font == 'heading') {
			style.fontSize = '18px';
			style.paddingBottom = '5px';
		} else if (element.font == 'dialog') {
			style.fontSize = '16px';
		} else {
			throw "unimplemented font type for static_text element in execDialog: " + element.font;
		}
		if (element.char_width) {
			style.width = String(element.char_width) + 'ch';
		}
		if (element.bold) {
			style.fontWeight = 'bold';
		}
		if (element.height) {
			style.height = String(element.height) + 'px';
		}
		if (element.wrap_name) {
			style.overflowWrap = 'break-word';
		}
		return style;
	},

	_add_button: function(parent, buttonID, description, callbacksToInsert, buttonList, dialog, resolve_cb) {
		let button = addElementNode("p", parent, null, null, "modalDialogButton");
		let buttonName = description[buttonID + '_name'] || buttonID.replace(/^\w/, c => c.toUpperCase())
		let link  = addElementNode("a", button, buttonName, null, modalDialogButtonLinkClass);
		link.href = "#";
		link.setAttribute('tabindex', "0");
		if (callbacksToInsert.has(buttonID)) {
			link.onclick = function() {
				dialog._return_value = buttonID;
				callbacksToInsert.get(buttonID)(dialog);
				resolve_cb(dialog._return_value);
			};
		} else {
			link.onclick = function() {
				resolve_cb(buttonID);
			};
		}
		if (buttonList.length == 0) {
			link.focus();
		}
		buttonList.push(button);
	},
};
