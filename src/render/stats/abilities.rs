use leptos::{
	ev, event_target_value,
	html::{div, input, Div},
	leptos_dom::logging::console_log,
	HtmlElement, SignalGet as _, SignalGetUntracked, SignalSet as _,
};
use wasm_bindgen::JsCast;

use crate::{
	domain::abilities::Ability,
	render::{error::RenderError, utils::input_int, utils::RenderableValue as _},
	Character,
};

pub fn render_abilities(character: &Character, document: &web_sys::Document) -> Result<(), RenderError> {
	console_log(">> Rendering abilities pane");
	let ability_pane = match document.get_element_by_id("character_abilities2") {
		Some(element) => Ok(element),
		None => Err(RenderError::new("Could not find ablity pane character_abilities2!")),
	}?
	.dyn_into::<web_sys::HtmlElement>()?;
	let abilities = &character.abilities.abilities;
	// first, set the length of the whole pane
	if abilities.len() <= 6 {
		ability_pane.class_list().add_1("abilities-6")?;
	} else {
		ability_pane.class_list().add_1("abilities-7")?;
	}
	// Add individual ability elements
	for ability in abilities {
		ability_pane.append_child(&create_ability_pane(ability))?;
	}
	Ok(())
}

fn create_ability_pane(ability: &Ability) -> HtmlElement<Div> {
	let ability_modifier = ability.modifier;
	let ability_value = ability.value;

	div()
		.id(String::from("wasm_") + ability.abbreviation)
		.classes("ability")
		.child((
			div().classes("textlabel-bold ability-name").child(ability.name),
			div()
				.classes("display-field ability-mod")
				.child(move || ability_modifier.get().render()),
			input()
				.classes("inputfield-regular ability-value")
				.attr("type", "number")
				.attr("value", ability_value.get_untracked())
				.prop("value", ability_value)
				// TODO: evaluate whether rendering is fast enought to update signals on input
				.on(ev::change, move |event| {
					ability_value.set(input_int(event_target_value(&event), false) as u8)
				}),
		))
}
