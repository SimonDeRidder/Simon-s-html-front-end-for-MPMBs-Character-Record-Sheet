
import re

import numpy as np

FILE = "img/factions/the_zhentarim.svg"
EXTRA_TRANSLATION = (0.0, 0.0)
PRECISION = 5
TRANSFORM_PATTERN = re.compile(
	r'\s*transform="matrix\(\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*\)"'
)
PATH_PATTERN = re.compile(r'^(<\s*path.*d\s*=\s*"\s*)([^"]+\s*)(".*)$')
COORD_PATTERN = re.compile(r'(?:\s+|^)(-?[0-9]+\.?[0-9]*|[ACHLMQSTVZ])')
COORD_TYPE_PATTERN = re.compile(r'[ACHLMQSTVZ]')
USE_PATTERN = re.compile(r'^(\s*<use.*x=")([0-9\.]+)(" y=")([0-9\.]+)(.*)$')
STROKE_WIDTH_PATTERN = re.compile(r'stroke-width\s*:\s*([0-9\.]+)')
STYLE_PATTERN = re.compile(r'style\s*=\s*"')


class CannotTransformError(Exception):
	pass


def _transform_path_d(d_str: str, tr_mat: np.ndarray, tr_tr: np.ndarray) -> str:
	tokens = re.findall(COORD_PATTERN, d_str)

	first_of_pair = None
	new_str = ""
	for token in tokens:
		if re.match(COORD_TYPE_PATTERN, token):
			if first_of_pair is not None:
				raise CannotTransformError(
					f"cannot parse d-string (uneven numbers before type specifier): '{first_of_pair} {token}'\n{d_str=}"
				)
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


def _transform_path(line: str) -> str:
	transform_mat = np.array([[1.0, 0.0], [0.0, 1.0]])
	transform_tr = np.array(EXTRA_TRANSLATION)
	transform_match = re.search(TRANSFORM_PATTERN, line)
	if transform_match:
		transform_mat = np.array(
			[
				[float(transform_match.group(1)), float(transform_match.group(2))],
				[float(transform_match.group(3)), float(transform_match.group(4))]
			]
		)
		transform_tr += np.array([float(transform_match.group(5)), float(transform_match.group(6))])
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
	else:
		use_match = re.match(USE_PATTERN, new_path)
		if use_match:
			coords = [float(use_match.group(2)), float(use_match.group(4))]
			tr_coords = np.round(np.dot(transform_mat, coords) + transform_tr, decimals=PRECISION)
			new_path = f"{use_match.group(1)}{tr_coords[0]}{use_match.group(3)}{tr_coords[1]}{use_match.group(5)}\n"

	return new_path


with open(FILE.replace('.svg', '2.svg'), 'wt') as outf:
	with open(FILE, 'rt') as inpf:
		for line_ in inpf.readlines():
			new_line = line_
			if re.match(PATH_PATTERN, line_) or re.match(USE_PATTERN, line_):
				new_line = _transform_path(line_)
			outf.write(new_line)