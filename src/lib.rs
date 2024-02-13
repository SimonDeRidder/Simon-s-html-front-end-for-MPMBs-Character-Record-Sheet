mod config;
mod domain;
mod render;
mod services;
mod utils;

use wasm_bindgen::prelude::wasm_bindgen;

use crate::config::get_config;
use crate::domain::abilities::Abilities;

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
	// First, set panic hook, this should happen once during initialisation
	utils::set_panic_hook();
}

#[wasm_bindgen]
pub struct Character {
	abilities: Abilities,
}

#[wasm_bindgen]
#[allow(clippy::new_without_default)]
impl Character {
	pub fn new() -> Self {
		// get config
		let config = get_config();
		// build character
		Character {
			abilities: Abilities::new(&config.ability_names),
		}
	}
}
