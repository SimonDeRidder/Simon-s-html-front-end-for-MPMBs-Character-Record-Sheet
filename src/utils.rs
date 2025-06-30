pub fn set_panic_hook() {
	// See https://github.com/rustwasm/console_error_panic_hook#readme
	#[cfg(feature = "console_error_panic_hook")]
	console_error_panic_hook::set_once();
}

static BOLD_CHARACTERS: phf::Map<char, char> = phf::phf_map! {
	'a' => '𝐚', 'b' => '𝐛', 'c' => '𝐜', 'd' => '𝐝', 'e' => '𝐞', 'f' => '𝐟', 'g' => '𝐠', 'h' => '𝐡', 'i' => '𝐢',
	'j' => '𝐣', 'k' => '𝐤', 'l' => '𝐥', 'm' => '𝐦', 'n' => '𝐧', 'o' => '𝐨', 'p' => '𝐩', 'q' => '𝐪', 'r' => '𝐫',
	's' => '𝐬', 't' => '𝐭', 'u' => '𝐮', 'v' => '𝐯', 'w' => '𝐰', 'x' => '𝐱', 'y' => '𝐲', 'z' => '𝐳',
	'A' => '𝐀', 'B' => '𝐁', 'C' => '𝐂', 'D' => '𝐃', 'E' => '𝐄', 'F' => '𝐅', 'G' => '𝐆', 'H' => '𝐇', 'I' => '𝐈',
	'J' => '𝐉', 'K' => '𝐊', 'L' => '𝐋', 'M' => '𝐌', 'N' => '𝐍', 'O' => '𝐎', 'P' => '𝐏', 'Q' => '𝐐', 'R' => '𝐑',
	'S' => '𝐒', 'T' => '𝐓', 'U' => '𝐔', 'V' => '𝐕', 'W' => '𝐖', 'X' => '𝐗', 'Y' => '𝐘', 'Z' => '𝐙'
};

pub fn convert_text_to_bold(input: &str) -> String {
	input
		.chars()
		.map(|ch| BOLD_CHARACTERS.get(&ch).copied().unwrap_or(ch))
		.collect()
}
