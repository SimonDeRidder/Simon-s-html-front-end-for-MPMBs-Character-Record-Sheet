mod config;
mod domain;
mod render;
mod utils;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

use config::Config;
use domain::stats::Stats;

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
	// First, set panic hook, this should happen once during initialisation
	utils::set_panic_hook();
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Character {
	config: Config,
	stats: Stats,
}

#[wasm_bindgen]
#[allow(clippy::new_without_default)]
impl Character {
	pub fn new() -> Self {
		// get config
		let config = Config::get();
		// build character
		Character {
			config: config.clone(),
			stats: Stats::new(&config),
		}
	}
}
