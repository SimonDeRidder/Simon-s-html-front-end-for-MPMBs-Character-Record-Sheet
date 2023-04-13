
import io
import re

import numpy as np

FILE = "img/page_reference/backgrounds/light_vision.svg"
PRECISION = 5
TRANSFORM_PATTERN = re.compile(
	r'\s*transform="matrix\(\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,'
	r'\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*\)"'
)
SVG_PATTERN = re.compile(
	r'^(\s*<\s*svg[^>]*width=")[0-9\.]+(p[tx]"[^>]*height=")[0-9\.]+(p[tx]"[^>]*viewBox=")[0-9\s\.]+("[^>]*>)'
)
PATH_PATTERN = re.compile(r'^(<\s*path.*d\s*=\s*"\s*)([^"]+\s*)(".*)$')
COORD_PATTERN = re.compile(r'(?:\s+|^)(-?[0-9]+\.?[0-9]*|[ACHLMQSTVZ])')
COORD_TYPE_PATTERN = re.compile(r'[ACHLMQSTVZ]')
USE_PATTERN = re.compile(r'^(\s*<use.*x=")([0-9\.]+)(" y=")([0-9\.]+)(.*)$')
STROKE_WIDTH_PATTERN = re.compile(r'stroke-width\s*:\s*([0-9\.]+)')
STYLE_PATTERN = re.compile(r'style\s*=\s*"')


class CannotTransformError(Exception):
	"""Custom error for path parsing errors."""


def _get_transform_coords(line: str) -> tuple[np.ndarray, np.ndarray]:
	transform_mat = np.array([[1.0, 0.0], [0.0, 1.0]])
	transform_tr = np.array([0.0, 0.0])
	transform_match = re.search(TRANSFORM_PATTERN, line)
	if transform_match:
		transform_mat = np.array(
			[
				[float(transform_match.group(1)), float(transform_match.group(2))],
				[float(transform_match.group(3)), float(transform_match.group(4))]
			]
		)
		transform_tr += np.array([float(transform_match.group(5)), float(transform_match.group(6))])
	return transform_mat, transform_tr


def _get_min_max_from_path(path) -> tuple[float, float, float, float]:
	min_x = 1e9
	min_y = 1e9
	max_x = -1e9
	max_y = -1e9

	tokens = re.findall(COORD_PATTERN, path)

	odd = True
	for token in tokens:
		if re.match(COORD_TYPE_PATTERN, token):
			if not odd:
				raise CannotTransformError(f"cannot parse d-string (uneven numbers before type specifier): '{path}'")
		else:
			if odd:
				x_coord = float(token)
				min_x = min(min_x, x_coord)
				max_x = max(max_x, x_coord)
				odd = False
			else:
				y_coord = float(token)
				min_y = min(min_y, y_coord)
				max_y = max(max_y, y_coord)
				odd = True

	return min_x, min_y, max_x, max_y


def _get_min_max_coords(file: io.TextIOWrapper) -> tuple[float, float, float, float]:
	min_x = 1e9
	min_y = 1e9
	max_x = -1e9
	max_y = -1e9
	for line in file.readlines():
		path_match = re.match(PATH_PATTERN, line)
		if path_match:
			transform_mat, transform_tr = _get_transform_coords(line)
			try:
				transformed_path = _transform_path_d(path_match.group(2), transform_mat, transform_tr)
			except CannotTransformError as err:
				print(str(err))

			try:
				line_min_x, line_min_y, line_max_x, line_max_y = _get_min_max_from_path(transformed_path)

				scale = np.sqrt((transform_mat[0, 0]**2 + transform_mat[1, 1]**2) / 2.0)
				stroke_width_match = re.search(STROKE_WIDTH_PATTERN, line)
				stroke_width = scale
				if stroke_width_match:
					stroke_width = float(stroke_width_match.group(1)) * scale
				min_x = min(min_x, line_min_x - stroke_width / 2.0)
				min_y = min(min_y, line_min_y - stroke_width / 2.0)
				max_x = max(max_x, line_max_x + stroke_width / 2.0)
				max_y = max(max_y, line_max_y + stroke_width / 2.0)
			except CannotTransformError as err:
				print(str(err))

	return min_x, min_y, max_x, max_y


def _transform_path_d(d_str: str, tr_mat: np.ndarray, tr_tr: np.ndarray) -> str:
	tokens = re.findall(COORD_PATTERN, d_str)

	first_of_pair = None
	new_str = ""
	for token in tokens:
		if re.match(COORD_TYPE_PATTERN, token):
			if first_of_pair is not None:
				raise CannotTransformError(f"cannot parse d-string (uneven numbers before type specifier): '{d_str}'")
			new_str += ' ' + token
		else:
			if first_of_pair is None:
				first_of_pair = token
			else:
				coords = [float(first_of_pair), float(token)]
				tr_coords = np.round(np.dot(tr_mat, coords) + tr_tr, decimals=PRECISION)
				new_str += f" {tr_coords[0]} {tr_coords[1]}"
				first_of_pair = None

	if first_of_pair is not None:
		raise CannotTransformError(f"cannot parse d-string (uneven numbers at end): '{d_str}'")

	return new_str.strip()


def _transform_path(line: str, min_x: float, min_y: float, max_x: float, max_y: float) -> str:
	svg_match = re.match(SVG_PATTERN, line)
	if svg_match:
		precision_scale = (10**PRECISION)
		width = np.ceil((max_x - min_x) * precision_scale) / precision_scale
		height = np.ceil((max_y - min_y) * precision_scale) / precision_scale
		return (
			svg_match.group(1) + str(width) + svg_match.group(2) + str(height)
			+ svg_match.group(3) + f"0 0 {str(width)} {str(height)}" + svg_match.group(4) + '\n'
		)

	transform_mat, transform_tr = _get_transform_coords(line)
	transform_tr -= np.array([min_x, min_y])

	path_match = re.match(PATH_PATTERN, line)
	new_path = line
	if path_match:
		try:
			transformed_path = _transform_path_d(path_match.group(2), transform_mat, transform_tr)
			new_path = path_match.group(1) + transformed_path + path_match.group(3) + '\n'
			new_path = re.sub(TRANSFORM_PATTERN, "", new_path)
		except CannotTransformError as err:
			print(str(err))
		scale = np.sqrt((transform_mat[0, 0]**2 + transform_mat[1, 1]**2) / 2.0)
		stroke_width_match = re.search(STROKE_WIDTH_PATTERN, new_path)
		if stroke_width_match:
			stroke_width = float(stroke_width_match.group(1))
			new_path = re.sub(STROKE_WIDTH_PATTERN, "stroke-width:" + str(stroke_width * scale), new_path)
		else:
			new_path = re.sub(STYLE_PATTERN, "style=\"stroke-width:" + str(scale) + ";", new_path)
		return new_path

	use_match = re.match(USE_PATTERN, new_path)
	if use_match:
		coords = [float(use_match.group(2)), float(use_match.group(4))]
		tr_coords = np.round(np.dot(transform_mat, coords) + transform_tr, decimals=PRECISION)
		new_path = f"{use_match.group(1)}{tr_coords[0]}{use_match.group(3)}{tr_coords[1]}{use_match.group(5)}\n"

	return new_path


with open(FILE.replace('.svg', '2.svg'), 'wt', encoding='utf-8') as outf:
	with open(FILE, 'rt', encoding='utf-8') as inpf:
		min_x_, min_y_, max_x_, max_y_ = _get_min_max_coords(inpf)
		print("translating globally by", (-min_x_, -min_y_))
		inpf.seek(0)
		for line_ in inpf.readlines():
			new_line = line_
			if re.match(PATH_PATTERN, line_) or re.match(USE_PATTERN, line_) or re.match(SVG_PATTERN, line_):
				new_line = _transform_path(line_, min_x_, min_y_, max_x_, max_y_)
			outf.write(new_line)
