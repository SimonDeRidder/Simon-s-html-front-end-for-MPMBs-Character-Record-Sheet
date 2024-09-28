pub type AbilityPart = i8;
pub type AbilityValue = u8;
pub type Modifier = i8;

pub struct SignalField<T: 'static>(leptos::reactive::signal::RwSignal<T>);

impl<T: Clone> SignalField<T>
where
	T: Send + Sync,
{
	pub fn new(value: T) -> Self {
		Self(leptos::reactive::signal::RwSignal::new(value))
	}

	// pub fn get(&self) -> T {
	// 	leptos::prelude::Get::get(&self.0)
	// }

	// pub fn set(&self, new_value: T) {
	// 	leptos::prelude::Set::set(&self.0, new_value)
	// }

	pub fn get_untracked(&self) -> T {
		leptos::prelude::GetUntracked::get_untracked(&self.0)
	}

	// pub fn with(&self, func: impl FnOnce(&T) -> ()) {
	// 	leptos::prelude::With::with(&self.0, func)
	// }

	// pub fn update(&self, func: impl FnOnce(&mut T) -> ()) {
	// 	leptos::prelude::Update::update(&self.0, func)
	// }
}

impl<T> Clone for SignalField<T> {
	fn clone(&self) -> Self {
		*self
	}
}

impl<T> Copy for SignalField<T> {}

impl serde::Serialize for SignalField<String> {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::Serializer,
	{
		serializer.serialize_str(self.get_untracked().as_str())
	}
}

impl<'de> serde::Deserialize<'de> for SignalField<String> {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: serde::Deserializer<'de>,
	{
		struct SignalFieldVisitor;
		impl serde::de::Visitor<'_> for SignalFieldVisitor {
			type Value = SignalField<String>;

			fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
				formatter.write_str("String")
			}

			fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
			where
				E: serde::de::Error,
			{
				Ok(Self::Value::new(String::from(v)))
			}

			fn visit_string<E>(self, v: String) -> Result<Self::Value, E>
			where
				E: serde::de::Error,
			{
				Ok(Self::Value::new(v))
			}
		}
		deserializer.deserialize_string(SignalFieldVisitor {})
	}
}
