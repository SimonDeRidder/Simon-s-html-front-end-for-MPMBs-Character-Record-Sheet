use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;
use web_sys::console;

#[wasm_bindgen]
pub fn update_ability(abbreviation: &str, new_value: u8) {
	console::log_1(&JsValue::from_str(
		format!("Updating ability '{}' with new value '{}'", abbreviation, new_value).as_str(),
	));
}
