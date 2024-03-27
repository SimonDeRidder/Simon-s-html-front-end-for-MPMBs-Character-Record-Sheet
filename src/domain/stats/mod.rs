pub mod abilities;

use crate::config::Config;

use self::abilities::Abilities;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Stats {
	pub abilities: Abilities,
}

impl Stats {
	pub fn new(config: &Config) -> Self {
		Self {
			abilities: Abilities::new(&config.ability_names),
		}
	}
}
