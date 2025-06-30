use wasm_bindgen::{JsCast as _, JsValue};
use web_sys::{console, Document};

use crate::Character;

use self::abilities::render_abilities;

use super::error::RenderError;

pub mod abilities;

pub fn render_stats_page(character: &Character, document: &Document) -> Result<(), RenderError> {
	// try to render all, only propagate errors at the end
	console::log_1(&JsValue::from_str("> Rendering stats page"));

	let stats_page = match document.get_element_by_id("CSfront") {
		Some(element) => Ok(element),
		None => Err(RenderError::new("Could not find stats page CSfront!")),
	}?
	.dyn_into::<web_sys::HtmlElement>()?;
	let results: Vec<Result<(), RenderError>> = vec![render_abilities(character, stats_page)];

	for res in results {
		res?;
	}
	Ok(())
}
