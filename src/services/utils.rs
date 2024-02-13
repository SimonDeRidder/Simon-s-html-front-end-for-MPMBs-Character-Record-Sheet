use regex::Regex;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use web_sys::console;

#[wasm_bindgen]
pub fn input_int(current_value: String) -> i32 {
	console::log_1(&JsValue::from_str(format!("input event with value: {:?}", current_value).as_str()));
	let int_match = match Regex::new(r"[+-]?\d+").unwrap().find(&current_value) {
		None => return 0,
		Some(match_) => match_.as_str(),
	};
	int_match.parse::<i32>().unwrap()
}
