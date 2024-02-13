pub struct Config {
	pub ability_names: Vec<(&'static str, &'static str)>, // Abbreviation, full name
}

pub fn get_config() -> Config {
	Config {
		ability_names: vec![
			("Str", "Strength"),
			("Dex", "Dexterity"),
			("Con", "Constitution"),
			("Int", "Intelligence"),
			("Wis", "Wisdom"),
			("Cha", "Charisma"),
		],
	}
}
