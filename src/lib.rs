mod config;
mod domain;
mod render;
mod utils;

use config::{Config, CONFIG};
use serde::ser::SerializeStruct as _;
use wasm_bindgen::prelude::wasm_bindgen;

use domain::stats::Stats;

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
	// First, set panic hook, this should happen once during initialisation
	utils::set_panic_hook();
	leptos::task::Executor::init_wasm_bindgen().expect("Failed to init_wasm_bindgen");
}

#[wasm_bindgen]
// #[derive(serde::Deserialize)]
pub struct Character {
	stats: Stats,
}

#[wasm_bindgen]
#[allow(clippy::new_without_default)]
impl Character {
	pub fn new() -> Self {
		// build character
		Character { stats: Stats::new() }
	}
}

impl serde::Serialize for Character {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::Serializer,
	{
		let mut serde_state = serializer.serialize_struct("Character", false as usize + 1)?;
		serde_state.serialize_field("config", &CONFIG)?;
		serde_state.serialize_field("stats", &self.stats)?;
		serde_state.end()
	}
}

impl<'de> serde::Deserialize<'de> for Character {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: serde::Deserializer<'de>,
	{
		enum Field {
			ConfigFld,
			StatsFld,
			Ignore,
		}
		struct FieldVisitor;

		impl serde::de::Visitor<'_> for FieldVisitor {
			type Value = Field;
			fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
				std::fmt::Formatter::write_str(formatter, "field identifier")
			}

			fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E>
			where
				E: serde::de::Error,
			{
				match value {
					0u64 => Ok(Field::ConfigFld),
					1u64 => Ok(Field::StatsFld),
					_ => Ok(Field::Ignore),
				}
			}
			fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
			where
				E: serde::de::Error,
			{
				match value {
					"config" => Ok(Field::ConfigFld),
					"stats" => Ok(Field::StatsFld),
					_ => Ok(Field::Ignore),
				}
			}
			fn visit_bytes<E>(self, value: &[u8]) -> Result<Self::Value, E>
			where
				E: serde::de::Error,
			{
				match value {
					b"config" => Ok(Field::ConfigFld),
					b"stats" => Ok(Field::StatsFld),
					_ => Ok(Field::Ignore),
				}
			}
		}

		impl<'de> serde::Deserialize<'de> for Field {
			fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
			where
				D: serde::Deserializer<'de>,
			{
				serde::Deserializer::deserialize_identifier(deserializer, FieldVisitor)
			}
		}

		struct Visitor {}

		impl<'de> serde::de::Visitor<'de> for Visitor {
			type Value = Character;
			fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
				std::fmt::Formatter::write_str(formatter, "struct Character")
			}

			fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
			where
				A: serde::de::SeqAccess<'de>,
			{
				let expected = "struct Character with 2 elements";
				let _ = match serde::de::SeqAccess::next_element::<Config>(&mut seq)? {
					Some(value) => value,
					None => return Err(serde::de::Error::invalid_length(0, &expected)),
				};
				let stats_field = match serde::de::SeqAccess::next_element::<Stats>(&mut seq)? {
					Some(value) => value,
					None => return Err(serde::de::Error::invalid_length(1, &expected)),
				};
				Ok(Character { stats: stats_field })
			}

			fn visit_map<A>(self, mut map: A) -> Result<Self::Value, A::Error>
			where
				A: serde::de::MapAccess<'de>,
			{
				let mut config_field: Option<Config> = None;
				let mut stats_field: Option<Stats> = None;
				while let Some(key) = serde::de::MapAccess::next_key::<Field>(&mut map)? {
					match key {
						Field::ConfigFld => {
							if Option::is_some(&config_field) {
								return Err(<A::Error as serde::de::Error>::duplicate_field("config"));
							}
							config_field = Some(serde::de::MapAccess::next_value::<Config>(&mut map)?);
						},
						Field::StatsFld => {
							if Option::is_some(&stats_field) {
								return Err(<A::Error as serde::de::Error>::duplicate_field("stats"));
							}
							stats_field = Some(serde::de::MapAccess::next_value::<Stats>(&mut map)?);
						},
						_ => {
							let _ = serde::de::MapAccess::next_value::<serde::de::IgnoredAny>(&mut map)?;
						},
					}
				}
				let _ = match config_field {
					Some(config) => config,
					None => serde::__private::de::missing_field("config")?,
				};
				let stats = match stats_field {
					Some(stats) => stats,
					None => serde::__private::de::missing_field("stats")?,
				};
				Ok(Character { stats })
			}
		}

		serde::Deserializer::deserialize_struct(deserializer, "Character", &["stats"], Visitor {})
	}
}
