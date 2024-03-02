use leptos::{create_memo, create_rw_signal, Memo, RwSignal, SignalGet as _};

use super::types::Modifier;

pub struct Abilities {
	pub abilities: Vec<Ability>,
}
impl Abilities {
	pub fn new(ability_names: &Vec<(&'static str, &'static str)>) -> Self {
		let mut abilities_list: Vec<Ability> = Vec::new();
		for (ability_abbr, ability_name) in ability_names {
			abilities_list.push(Ability::new(ability_abbr, ability_name, 10));
		}
		Self {
			abilities: abilities_list,
		}
	}
}

pub struct Ability {
	pub abbreviation: &'static str,
	pub name: &'static str,
	pub value: RwSignal<u8>,
	pub modifier: Memo<Modifier>,
}

impl Ability {
	pub fn new(abbreviation: &'static str, name: &'static str, value: u8) -> Self {
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
