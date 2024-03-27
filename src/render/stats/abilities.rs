use leptos::{
	ev, event_target_value,
	html::{div, input, Div},
	leptos_dom::logging::console_log,
	HtmlElement, SignalGet as _, SignalGetUntracked as _, SignalSet as _,
};

use crate::{
	domain::stats::abilities::Ability,
	render::{error::RenderError, utils::input_int, utils::RenderableValue as _},
	Character,
};

pub fn render_abilities(character: &Character, stats_page: &web_sys::HtmlElement) -> Result<(), RenderError> {
	console_log(">> Rendering abilities pane");
	let abilities = &character.stats.abilities.abilities;
	let abilities_tooltip = character.stats.abilities.tooltip;
	let ability_classes = String::from("pane grey-bg-tb-fancy abilities ")
		+ if abilities.len() <= 6 {
			"abilities-6"
		} else {
			"abilities-7"
		};
	let mut ability_pane = div()
		.id("character_abilities")
		.classes(ability_classes)
		.attr("title", move || abilities_tooltip.get());
	// Add individual ability elements
	for ability in abilities {
		ability_pane = ability_pane.child(create_ability_pane(ability));
	}
	stats_page.append_child(&ability_pane)?;
	Ok(())
}

fn create_ability_pane(ability: &Ability) -> HtmlElement<Div> {
	let ability_modifier = ability.modifier;
	let ability_value = ability.value;

	div()
		.id(String::from("wasm_") + &ability.abbreviation)
		.classes("ability")
		.child((
			div()
				.classes("textlabel-bold ability-name")
				.child(ability.name.clone()),
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
