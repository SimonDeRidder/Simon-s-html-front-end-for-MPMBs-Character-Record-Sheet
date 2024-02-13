use crate::domain::types::Modifier;

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
