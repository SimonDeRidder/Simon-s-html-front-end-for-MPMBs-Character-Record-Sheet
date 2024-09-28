use std::{collections::hash_map::DefaultHasher, hash::Hash, hash::Hasher as _};

use leptos::leptos_dom::logging::console_error;

#[derive(Hash, Clone)]
pub struct Config {
	pub ability_names_with_max: [(&'static str, &'static str, u8); 6], //Vec<(String, String)>, // Abbreviation, full name
	pub ability_improvement_amount: i8, // how many ability increases the character gets per class level ability improvement
}

impl Config {
	pub const fn get() -> Config {
		Config {
			ability_names_with_max: [
				("Str", "Strength", 20),
				("Dex", "Dexterity", 20),
				("Con", "Constitution", 20),
				("Int", "Intelligence", 20),
				("Wis", "Wisdom", 20),
				("Cha", "Charisma", 20),
			],
			ability_improvement_amount: 2,
		}
	}

	pub fn get_hash(&self) -> String {
		let mut hasher = DefaultHasher::new();
		self.hash(&mut hasher);
		format!("{}", hasher.finish())
	}
}

impl serde::Serialize for Config {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::Serializer,
	{
		serializer.serialize_str(&self.get_hash())
	}
}

impl<'de> serde::Deserialize<'de> for Config {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: serde::Deserializer<'de>,
	{
		let hash = String::deserialize(deserializer)?;
		let config = Config::get();
		let current_hash = config.get_hash();
		if !hash.is_empty() && (current_hash != hash) {
			console_error(
				format!(
					"Loaded hash: {}, current hash: {}, will attempt to continue loading.",
					hash, current_hash
				)
				.as_str(),
			);
		}
		Ok(config)
	}
}

pub static CONFIG: Config = Config::get();
