use leptos::{
	html::ElementChild as _,
	leptos_dom::logging::console_log,
	prelude::{
		ClassAttribute as _, Get as _, GetUntracked as _, GlobalAttributes as _, OnAttribute as _,
		PropAttribute as _, Set as _, StyleAttribute as _,
	},
};

use crate::domain::types::{AbilityValue, Modifier};

use super::{error::RenderError, get_document};

const MODAL_CANVAS_CLASS: &str = "modal-canvas";

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
impl RenderableValue for AbilityValue {
	fn render(&self) -> String {
		format!("{}", *self)
	}
}

pub fn show_modal<T: leptos::prelude::IntoRender>(
	title: &'static str,
	content: T,
	buttons: Vec<(&'static str, leptos::prelude::RwSignal<Option<String>>)>,
) -> Result<String, RenderError>
where
	<T as leptos::prelude::IntoRender>::Output: 'static,
	<T as leptos::prelude::IntoRender>::Output: leptos::IntoView,
{
	let modal_id = uuid::Uuid::new_v4().to_string();
	let button_vec = buttons
		.clone()
		.iter()
		.map(|(button_text, button_signal)| {
			let modal_id_button_clone = modal_id.clone();
			let signal_clone = *button_signal;
			leptos::html::button()
				.class("button")
				.child(*button_text)
				.on(leptos::ev::click, move |_| signal_clone.set(Some(modal_id_button_clone.clone())))
		})
		.collect::<Vec<_>>();
	let modal_window = leptos::html::div()
		.class("modal-window")
		.child(leptos::html::div().class("modal-title").child(title))
		.child(leptos::html::div().class("modal-content").child(content))
		.child(leptos::html::div().class("modal-buttons").child(button_vec))
		.on(leptos::ev::click, |event| event.stop_propagation());
	let modal_id_clone = modal_id.clone();
	let canvas = leptos::html::div()
		.id(modal_id.clone())
		.class(MODAL_CANVAS_CLASS)
		.child(modal_window)
		.on(leptos::ev::click, move |_| {
			remove_modal(modal_id_clone.clone()).unwrap();
		});
	leptos::mount::mount_to_body(|| canvas);
	Ok(modal_id.clone())
}

pub fn remove_modal(id: String) -> Result<(), RenderError> {
	get_document()
		.ok_or(RenderError::new("Could not get document"))?
		.get_element_by_id(id.as_str())
		.ok_or(RenderError::new(format!("Could not find modal with id {}", id).as_str()))?
		.remove();
	Ok(())
}

pub fn create_number_input<T>(
	signal: leptos::prelude::RwSignal<T>,
	width: u8,
	disable_signal: Option<leptos::prelude::RwSignal<bool>>,
) -> impl leptos::IntoView
where
	T: std::str::FromStr + std::default::Default + 'static,
	<T as std::str::FromStr>::Err: std::fmt::Display,
	leptos::prelude::RwSignal<T>: leptos::prelude::GetUntracked
		+ leptos::prelude::Set<Value = T>
		+ leptos::tachys::html::property::IntoProperty,
	<leptos::prelude::RwSignal<T> as leptos::prelude::GetUntracked>::Value:
		leptos::attr::AttributeValue + std::fmt::Display,
{
	leptos::html::input()
		.class(move || {
			if disable_signal.is_some_and(|disable_signal_val| disable_signal_val.get()) {
				"inputfield-regular inputfield-disabled"
			} else {
				"inputfield-regular"
			}
		})
		.style(if width > 0u8 {
			format!("width: {}em", width)
		} else {
			String::from("")
		})
		.r#type("number")
		.value(signal.get_untracked())
		.prop("value", signal)
		.disabled(move || disable_signal.is_some_and(|disable_signal_val| disable_signal_val.get()))
		.on(leptos::ev::input, move |event| {
			let new_value = leptos::prelude::event_target_value(&event);
			if new_value.is_empty()
				&& <wasm_bindgen::JsValue as Into<web_sys::InputEvent>>::into(event.clone().into())
					.input_type()
					.starts_with("delete")
			{
				// new_value is also empty if a non-number character was entered,
				// hence we only set to default if it's empty after a delete type event (backspace, delete, ...)
				// see https://w3c.github.io/input-events/#interface-InputEvent-Attributes
				signal.set(T::default());
				return;
			}
			match new_value.parse::<T>() {
				Ok(value) => signal.set(value),
				Err(parse_err) => {
					console_log(format!("Could not parse as int: {}", parse_err).as_str());
					leptos::prelude::event_target::<web_sys::HtmlInputElement>(&event)
						.set_value(signal.get_untracked().to_string().as_str());
				},
			}
		})
}

pub struct SignalFuture<SignalType>
where
	SignalType:
		leptos::prelude::Get<Value = bool> + leptos::prelude::GetUntracked<Value = bool> + Clone + 'static,
{
	pub signal: SignalType,
}

impl<SignalType> std::future::Future for SignalFuture<SignalType>
where
	SignalType:
		leptos::prelude::Get<Value = bool> + leptos::prelude::GetUntracked<Value = bool> + Clone + 'static,
{
	type Output = ();

	fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> std::task::Poll<Self::Output> {
		if self.signal.get_untracked() {
			std::task::Poll::Ready(())
		} else {
			let sgn_clone = self.signal.clone();
			let waker = cx.waker().clone();
			leptos::prelude::Effect::new(move || {
				if sgn_clone.get() {
					waker.wake_by_ref();
				}
			});
			std::task::Poll::Pending
		}
	}
}
