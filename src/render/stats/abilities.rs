use wasm_bindgen::{JsCast, JsValue};
use web_sys::{console, js_sys::Function, Document, HtmlElement};

use crate::{
	domain::abilities::Ability,
	render::{error::RenderError, utils::RenderableValue as _},
	Character,
};

pub fn render_abilities(character: Character, document: &Document) -> Result<(), RenderError> {
	console::log_1(&JsValue::from_str(">> Rendering abilities pane"));
	let ability_pane = match document.get_element_by_id("character_abilities2") {
		Some(element) => Ok(element),
		None => Err(RenderError::new("Could not find ablity pane character_abilities2!")),
	}?
	.dyn_into::<HtmlElement>()?;
	let abilities = character.abilities.abilities;
	// first, set the length of the whole pane
	if abilities.len() <= 6 {
		ability_pane.class_list().add_1("abilities-6")?;
	} else {
		ability_pane.class_list().add_1("abilities-7")?;
	}
	// Add individual ability elements
	for ability in abilities {
		let ability_pane_element = create_ability_pane(ability, document)?;
		ability_pane.append_child(&ability_pane_element)?;
	}
	Ok(())
}

fn create_ability_pane(ability: Ability, document: &Document) -> Result<HtmlElement, RenderError> {
	let ability_pane_element = document.create_element("div")?.dyn_into::<HtmlElement>()?;
	ability_pane_element.set_id((String::from("wasm_") + ability.abbreviation).as_str());
	ability_pane_element.set_class_name("ability");

	let ability_name_element: HtmlElement = document.create_element("div")?.dyn_into::<HtmlElement>()?;
	ability_name_element.set_class_name("textlabel-bold ability-name");
	ability_name_element.set_inner_text(ability.name.to_uppercase().as_str());

	let ability_mod_element: HtmlElement = document.create_element("div")?.dyn_into::<HtmlElement>()?;
	ability_mod_element.set_class_name("display-field ability-mod");
	ability_mod_element.set_inner_text(ability.modifier().render().as_str());

	let ability_value_element: HtmlElement = document.create_element("input")?.dyn_into::<HtmlElement>()?;
	ability_value_element.set_class_name("inputfield-regular ability-value");
	ability_value_element.set_inner_text(ability.modifier().render().as_str());
	ability_value_element.set_attribute("type", "number")?;
	ability_value_element.set_attribute("value", format!("{}", ability.value).as_str())?;
	ability_value_element.set_oninput(Some(&Function::new_no_args("this.value=input_int(this.value)")));
	ability_value_element.set_onchange(Some(&Function::new_no_args(
		format!(
			"this.value=input_int(this.value);update_ability('{}', Number(this.value))",
			ability.abbreviation
		)
		.as_str(),
	)));

	ability_pane_element.append_child(&ability_name_element)?;
	ability_pane_element.append_child(&ability_mod_element)?;
	ability_pane_element.append_child(&ability_value_element)?;
	Ok(ability_pane_element)
}
