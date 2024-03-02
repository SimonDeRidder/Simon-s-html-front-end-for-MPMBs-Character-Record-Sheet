use crate::domain::types::Modifier;
use regex::Regex;

pub trait RenderableValue {
	fn render(&self) -> String;
}
impl RenderableValue for Modifier {
	fn render(&self) -> String {
		if *self > 0 {
			format!("+{}", *self)
		} else {
			format!("{}", *self)
		}
	}
}

pub fn input_int(current_value: String, allow_neg: bool) -> i32 {
	let int_match = match Regex::new(r"[+-]?\d+").unwrap().find(&current_value) {
		None => return 0,
		Some(match_) => match_.as_str(),
	};
	let mut value = int_match.parse::<i32>().unwrap();
	if !allow_neg {
		value = value.abs();
	}
	value
}
