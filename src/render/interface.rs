// Interface with the JS code, both affects and callbacks

use leptos::{create_effect, SignalGet};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::Character;

#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_namespace = eventManager)]
	fn handle_event(event_type: String);
}

// === EFFECTS ===
pub fn create_all_effects(character: &Character) {
	// > Stats
	// >> Abilities
	for ability in character.abilities.abilities.iter() {
		let abi_value = ability.value;
		let abi_modifier = ability.modifier;
		let abbr = ability.abbreviation;
		create_effect(move |_| {
			abi_value.get();
			handle_event(String::from(abbr) + "_change");
		});
		create_effect(move |_| {
			abi_modifier.get();
			handle_event(String::from(abbr) + "_Mod_change");
		});
	}
}
