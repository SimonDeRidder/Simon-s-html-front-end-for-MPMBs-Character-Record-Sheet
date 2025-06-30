// Interface with the JS code, both affects and callbacks

use std::collections::HashMap;

use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

use crate::{
	config::CONFIG,
	domain::{
		stats::abilities::{
			AbilityImprovementValue, AbilityLimitSource, AbilitySource, ImprovementAbilitySource,
			RegularAbilitySource,
		},
		types::{AbilityPart, AbilityValue, Modifier},
	},
	render::{stats::abilities::show_ability_modal, utils::SignalFuture},
	Character,
};
use gloo_utils::format::JsValueSerdeExt;
use leptos::{
	leptos_dom::logging::console_error,
	prelude::{Get as _, GetUntracked as _, ReadUntracked as _, Update as _, Write as _},
};

#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_namespace = eventManager)]
	fn handle_event(event_type: String);
}

// === EFFECTS ===
pub fn create_all_effects(character: &Character) {
	// > Stats
	// >> Abilities
	for (abbreviation, ability) in character.stats.abilities.abilities.iter() {
		let abi_value = ability.value;
		let abi_modifier = ability.modifier;
		let abbr = (*abbreviation).clone();
		leptos::reactive::effect::Effect::new(move |_| {
			abi_value.get();
			handle_event(abbr.clone() + "_change");
		});
		let abbr = (*abbreviation).clone();
		leptos::reactive::effect::Effect::new(move |_| {
			abi_modifier.get();
			handle_event(abbr.clone() + "_Mod_change");
		});
	}
}

// === CALLBACKS ==

#[wasm_bindgen]
impl Character {
	// > Stats
	// >> Abilities
	pub fn get_ability(&self, abbreviation: String) -> Option<u8> {
		self.stats
			.abilities
			.abilities
			.get(&abbreviation)
			.map(|ability| ability.value.get_untracked())
	}

	pub fn get_ability_modifier(&self, abbreviation: String) -> Option<Modifier> {
		self.stats
			.abilities
			.abilities
			.get(&abbreviation)
			.map(|ability| ability.modifier.get_untracked())
	}

	pub fn has_ability_source(&self, name: String) -> bool {
		for src in self.stats.abilities.sources.read_untracked().iter() {
			if *match src {
				AbilitySource::Regular(rsrc) => &rsrc.title,
				AbilitySource::Improvement(isrc) => &isrc.title,
			} == name
			{
				return true;
			}
		}
		false
	}

	pub fn add_ability_source(
		&self,
		name: String,
		description: String,
		ability_abbreviations: Vec<String>,
		values: Vec<AbilityPart>,
		check_sum: Option<AbilityPart>,
		subset: Option<Vec<String>>,
	) {
		let mut existing = false;
		for (index, src) in self.stats.abilities.sources.read_untracked().iter().enumerate() {
			let name_clone = name.clone();
			let descr_clone = description.clone();
			if *src.get_title() == name {
				// ability already exists, overwrite
				existing = true;
				self.stats.abilities.sources.update(|sources| {
					let _ = std::mem::replace(
						&mut sources[index],
						AbilitySource::Regular(RegularAbilitySource {
							title: name_clone,
							description: descr_clone,
							ability_parts: ability_abbreviations
								.iter()
								.zip(&values)
								.filter_map(|(abbr, val)| {
									if *val == 0 {
										None
									} else {
										Some((abbr.clone(), *val))
									}
								})
								.collect(),
							check_sum,
							subset: subset.clone(),
						}),
					);
				});
				break;
			}
		}
		if !existing {
			self.stats
				.abilities
				.sources
				.write()
				.push(AbilitySource::Regular(RegularAbilitySource {
					title: name,
					description,
					ability_parts: ability_abbreviations
						.iter()
						.zip(&values)
						.filter_map(|(abbr, val)| {
							if *val == 0 {
								None
							} else {
								Some((abbr.clone(), *val))
							}
						})
						.collect(),
					check_sum,
					subset,
				}))
		}
	}

	pub fn add_ability_source_limit(
		&self,
		name: String,
		description: String,
		abiltity_abbreviations: Vec<String>,
		values: Vec<AbilityValue>,
		is_max: bool,
	) {
		let limit_sources = if is_max {
			self.stats.abilities.max_sources
		} else {
			self.stats.abilities.min_sources
		};
		let mut existing = false;
		for (index, src) in limit_sources.read_untracked().iter().enumerate() {
			let name_clone = name.clone();
			if src.title == name {
				// ability already exists, overwrite
				existing = true;
				let descr_clone = if description.is_empty() {
					src.description.clone()
				} else {
					description.clone()
				};
				limit_sources.update(|sources| {
					let _ = std::mem::replace(
						&mut sources[index],
						AbilityLimitSource {
							title: name_clone,
							description: descr_clone,
							ability_parts: abiltity_abbreviations
								.iter()
								.zip(values.clone())
								.filter_map(|(abbr, val)| {
									if val == 0 {
										None
									} else {
										Some((abbr.clone(), val))
									}
								})
								.collect(),
						},
					);
				});
				break;
			}
		}
		if !existing {
			limit_sources.write().push(AbilityLimitSource {
				title: name,
				description,
				ability_parts: abiltity_abbreviations
					.iter()
					.zip(values.clone())
					.filter_map(|(abbr, val)| {
						if val == 0 {
							None
						} else {
							Some((abbr.clone(), val))
						}
					})
					.collect(),
			})
		}
	}

	pub fn update_ability_source_improvements(&self, new_improvement_names: Vec<String>) {
		let new_improvement_titles = new_improvement_names.clone();
		self.stats.abilities.sources.update(move |sources| {
			*sources = (*sources)
				.iter()
				.filter(|source| match source {
					AbilitySource::Regular(_) => true,
					AbilitySource::Improvement(improvement_src) => {
						new_improvement_titles.contains(&improvement_src.title)
					},
				})
				.cloned()
				.collect();
			let added_improvement_titles: Vec<String> = new_improvement_titles
				.iter()
				.filter_map(|title| {
					for source in sources.iter() {
						match source {
							AbilitySource::Regular(_) => {},
							AbilitySource::Improvement(improvement_src) => {
								if improvement_src.title == **title {
									return None;
								}
							},
						}
					}
					Some(title.clone())
				})
				.collect();
			for added_title in added_improvement_titles.iter() {
				sources.push(AbilitySource::Improvement(ImprovementAbilitySource {
					title: added_title.clone(),
					description: format!(
						"{}x +1 to any ability, or a feat.",
						CONFIG.ability_improvement_amount
					),
					ability_improvement: AbilityImprovementValue::AbilityParts(HashMap::new()),
					check_sum: CONFIG.ability_improvement_amount,
				}));
			}
		});
	}

	pub fn remove_ability_source(&self, name: String) {
		let ability_sources_len = self.stats.abilities.sources.read_untracked().len();
		let mut remove_index = ability_sources_len;
		for (index, src) in self.stats.abilities.sources.read_untracked().iter().enumerate() {
			if *match src {
				AbilitySource::Regular(rsrc) => &rsrc.title,
				AbilitySource::Improvement(isrc) => &isrc.title,
			} == name
			{
				remove_index = index;
				break;
			}
		}
		if remove_index >= ability_sources_len {
			console_error(format!("Could find ability source to remove: {}", name).as_str());
		} else {
			self.stats.abilities.sources.write().remove(remove_index);
		}
	}

	pub fn remove_ability_source_limit(&self, name: String, is_max: bool) {
		let source_limit = if is_max {
			self.stats.abilities.max_sources
		} else {
			self.stats.abilities.min_sources
		};
		let ability_sources_limit_len = source_limit.read_untracked().len();
		let mut remove_index = ability_sources_limit_len;
		for (index, src) in source_limit.read_untracked().iter().enumerate() {
			if src.title == name {
				remove_index = index;
				break;
			}
		}
		if remove_index >= ability_sources_limit_len {
			console_error(format!("Could find ability source to remove: {}", name).as_str());
		} else {
			source_limit.write().remove(remove_index);
		}
	}

	pub fn get_abilities_tooltip(&self) -> String {
		self.stats.abilities.tooltip.get_untracked()
	}

	pub async fn show_abilities_dialog(&self) {
		let (finished_signal_r, finished_signal_w) = leptos::prelude::signal(false);
		show_ability_modal(
			self.stats.abilities.sources,
			self.stats.abilities.min_sources,
			self.stats.abilities.max_sources,
			Some(finished_signal_w),
		);
		SignalFuture {
			signal: finished_signal_r,
		}
		.await;
	}

	pub fn get_character_json(&self) -> JsValue {
		JsValue::from_serde(self).unwrap()
	}

	pub fn get_character_from_json(json: JsValue) -> Self {
		json.into_serde().unwrap()
	}
}
