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
	pub value: u8,
}

impl Ability {
	pub fn new(abbreviation: &'static str, name: &'static str, value: u8) -> Self {
		Ability {
			abbreviation,
			name,
			value,
		}
	}

	pub fn modifier(&self) -> Modifier {
		(self.value / 2) - 5 as Modifier
	}
}
