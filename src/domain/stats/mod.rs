pub mod abilities;

use self::abilities::Abilities;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Stats {
	pub abilities: Abilities,
}

impl Stats {
	pub fn new() -> Self {
		Self {
			abilities: Abilities::new(),
		}
	}
}
