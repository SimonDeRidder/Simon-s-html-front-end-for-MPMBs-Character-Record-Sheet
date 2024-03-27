use leptos::{create_memo, create_rw_signal, Memo, RwSignal, SignalGet as _, SignalGetUntracked};
use serde;
use serde::{de::Visitor, ser::SerializeTuple as _, Deserialize, Serialize};

use crate::domain::types::Modifier;

#[derive(Serialize, Deserialize)]
#[serde(transparent)]
pub struct Abilities {
	#[serde(skip, default = "default_string_rw_signal")]
	pub tooltip: RwSignal<String>,
	pub abilities: Vec<Ability>,
}
impl Abilities {
	pub fn new(ability_names: &Vec<(String, String)>) -> Self {
		let mut abilities_list: Vec<Ability> = Vec::new();
		for (ability_abbr, ability_name) in ability_names {
			abilities_list.push(Ability::new(ability_abbr.clone(), ability_name.clone(), 10));
		}
		Self {
			tooltip: default_string_rw_signal(),
			abilities: abilities_list,
		}
	}
}

fn default_string_rw_signal() -> RwSignal<String> {
	create_rw_signal(String::from(""))
}

pub struct Ability {
	pub abbreviation: String,
	pub name: String,
	pub value: RwSignal<u8>,
	pub modifier: Memo<Modifier>,
}

impl Ability {
	pub fn new(abbreviation: String, name: String, value: u8) -> Self {
		let value_signal = create_rw_signal(value);
		Ability {
			abbreviation,
			name,
			value: value_signal,
			modifier: create_memo(move |_| calc_ability_modifier(value_signal.get())),
		}
	}
}

fn calc_ability_modifier(value: u8) -> Modifier {
	((value / 2) as i8) - 5 as Modifier
}

impl Serialize for Ability {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::Serializer,
	{
		let mut ability_serialiser = serializer.serialize_tuple(3)?;
		ability_serialiser.serialize_element(&self.abbreviation)?;
		ability_serialiser.serialize_element(&self.name)?;
		ability_serialiser.serialize_element(&self.value.get_untracked())?;
		ability_serialiser.end()
	}
}

impl<'de> Deserialize<'de> for Ability {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: serde::Deserializer<'de>,
	{
		struct AbilityVisitor;
		impl<'de> Visitor<'de> for AbilityVisitor {
			type Value = Ability;

			fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
				formatter.write_str("ability tuple")
			}

			fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
			where
				A: serde::de::SeqAccess<'de>,
			{
				let abbreviation: String = seq
					.next_element()?
					.ok_or(serde::de::Error::custom("None ability abbreviation"))?;
				let name: String = seq
					.next_element()?
					.ok_or(serde::de::Error::custom("None ability name"))?;
				let value: u8 = seq
					.next_element()?
					.ok_or(serde::de::Error::custom("None ability value"))?;
				Ok(Self::Value::new(abbreviation, name, value))
			}
		}
		deserializer.deserialize_tuple(3, AbilityVisitor {})
	}
}

#[cfg(test)]
mod tests {
	use super::calc_ability_modifier;

	#[test]
	fn test_calc_ability_modifier() {
		let test_table = [(1, -5), (2, -4), (9, -1), (10, 0), (11, 0), (12, 1), (30, 10)];

		for (ability, modifier) in test_table {
			assert_eq!(calc_ability_modifier(ability), modifier);
		}
	}
}
