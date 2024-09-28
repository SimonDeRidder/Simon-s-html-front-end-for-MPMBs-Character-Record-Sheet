use wasm_bindgen::JsValue;
use web_sys::Element;

#[derive(Clone, Debug)]
pub struct RenderError {
	pub message: String,
}

impl RenderError {
	pub fn new(message: &str) -> Self {
		Self {
			message: String::from(message),
		}
	}
}

impl From<JsValue> for RenderError {
	fn from(value: JsValue) -> Self {
		RenderError {
			message: match value.as_string() {
				Some(msg) => msg,
				None => String::from("Unknown Error (None)"),
			},
		}
	}
}

impl From<Element> for RenderError {
	fn from(el: Element) -> Self {
		RenderError {
			message: format!("An error occured for element with id  '{}'!", el.id()),
		}
	}
}
