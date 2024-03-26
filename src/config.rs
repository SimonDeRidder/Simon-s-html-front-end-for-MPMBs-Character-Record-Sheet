use std::{collections::hash_map::DefaultHasher, hash::Hash, hash::Hasher as _};

use leptos::leptos_dom::logging::console_log;

#[derive(Hash, Clone)]
pub struct Config {
	pub ability_names: Vec<(String, String)>, // Abbreviation, full name
}

impl Config {
	pub fn get() -> Config {
		Config {
			ability_names: vec![
				(String::from("Str"), String::from("Strength")),
				(String::from("Dex"), String::from("Dexterity")),
				(String::from("Con"), String::from("Constitution")),
				(String::from("Int"), String::from("Intelligence")),
				(String::from("Wis"), String::from("Wisdom")),
				(String::from("Cha"), String::from("Charisma")),
			],
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
			console_log(format!("Loaded hash: {}, current hash: {}", hash, current_hash).as_str());
			return Err(serde::de::Error::custom("Incorrect hash!"));
		}
		Ok(config)
	}
}
