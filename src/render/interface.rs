// Interface with the JS code, both affects and callbacks

use leptos::{create_effect, SignalGet as _, SignalGetUntracked as _, SignalSet as _};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

use crate::{domain::types::Modifier, Character};
use gloo_utils::format::JsValueSerdeExt;

#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_namespace = eventManager)]
	fn handle_event(event_type: String);
}

// === EFFECTS ===
pub fn create_all_effects(character: &Character) {
	// > Stats
	// >> Abilities
	for ability in character.stats.abilities.abilities.iter() {
		let abi_value = ability.value;
		let abi_modifier = ability.modifier;
		let abbr = ability.abbreviation.clone();
		create_effect(move |_| {
			abi_value.get();
			handle_event(abbr.clone() + "_change");
		});
		let abbr = ability.abbreviation.clone();
		create_effect(move |_| {
			abi_modifier.get();
			handle_event(abbr.clone() + "_Mod_change");
		});
	}
}

// === CALLBACKS ==
#[wasm_bindgen]
impl Character {
	// > Stats
	// >> Abilities
	pub fn get_ability(&self, abbreviation: String) -> Option<u8> {
		for ability in self.stats.abilities.abilities.iter() {
			if ability.abbreviation == abbreviation {
				return Some(ability.value.get_untracked());
			}
		}
		None
	}

	pub fn set_ability(&self, abbreviation: String, new_value: u8) {
		for ability in self.stats.abilities.abilities.iter() {
			if ability.abbreviation == abbreviation {
				ability.value.set(new_value);
			}
		}
	}

	pub fn get_ability_modifier(&self, abbreviation: String) -> Option<Modifier> {
		for ability in self.stats.abilities.abilities.iter() {
			if ability.abbreviation == abbreviation {
				return Some(ability.modifier.get_untracked());
			}
		}
		None
	}

	pub fn get_abilities_tooltip(&self) -> String {
		self.stats.abilities.tooltip.get_untracked()
	}

	pub fn set_abilities_tooltip(&self, new_value: String) {
		self.stats.abilities.tooltip.set(new_value);
	}

	pub fn get_character_json(&self) -> JsValue {
		JsValue::from_serde(self).unwrap()
	}

	pub fn get_character_from_json(json: JsValue) -> Self {
		json.into_serde().unwrap()
	}
}
