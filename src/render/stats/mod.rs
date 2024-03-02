use wasm_bindgen::JsValue;
use web_sys::{console, Document};

use crate::Character;

use self::abilities::render_abilities;

use super::error::RenderError;

mod abilities;

pub fn render_stats_page(character: &Character, document: &Document) -> Result<(), RenderError> {
	// try to render all, only propagate errors at the end
	console::log_1(&JsValue::from_str("> Rendering stats page"));
	let results: Vec<Result<(), RenderError>> = vec![render_abilities(character, document)];

	for res in results {
		res?;
	}
	Ok(())
}
