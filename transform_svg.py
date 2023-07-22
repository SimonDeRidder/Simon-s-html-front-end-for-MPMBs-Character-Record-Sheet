
import re

import numpy as np

FILE = "img/page_stats/backgrounds/hos.svg"
EXTRA_TRANSLATION = (8.0, 0.0)
EXTRA_TRANSFORM_MAT = [
	[1.0, 0.0],
	[0.0, 1.0]
]
PRECISION = 5
TRANSFORM_PATTERN = re.compile(
	r'\s*transform="matrix\(\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*,\s*(-?[0-9\.]+)\s*\)"'
)
PATH_PATTERN = re.compile(r'^(\s*<\s*path.*d\s*=\s*"\s*)([^"]+\s*)(".*)$')
COORD_PATTERN = re.compile(r'(?:\s+|^)(-?[0-9]+\.?[0-9]*|[ACHLMQSTVZ])')
COORD_TYPE_PATTERN = re.compile(r'[ACHLMQSTVZ]')
USE_PATTERN = re.compile(r'^(\s*<use.*x=")([0-9\.]+)(" y=")([0-9\.]+)(.*)$')
STROKE_WIDTH_PATTERN = re.compile(r'stroke-width\s*:\s*([0-9\.]+)')
STYLE_PATTERN = re.compile(r'style\s*=\s*"')


class CannotTransformError(Exception):
	pass


def _transform_path_d(d_str: str, tr_mat: np.ndarray, tr_tr: np.ndarray) -> str:
	tokens = re.findall(COORD_PATTERN, d_str)

	tokens_required = 999
	tokens_gathered = []
	current_type = ''
	new_str = ""
	for token in tokens:
		if re.match(COORD_TYPE_PATTERN, token):
			if tokens_gathered:
				raise CannotTransformError(
					f"cannot parse d-string (unexpected number of tokens before type specifier): '{first_of_pair} {token}'\nd_str={d_str}"
				)
			new_str += ' ' + token
			current_type = token
			if current_type == 'A':
				tokens_required = 7
			else:
				tokens_required = 2
		else:
			tokens_gathered.append(token)
			if len(tokens_gathered) == tokens_required:
				if current_type == 'A':
					radii = [float(tokens_gathered[0]), float(tokens_gathered[1])]
					coords = [float(tokens_gathered[5]), float(tokens_gathered[6])]
					angle = float(tokens_gathered[2]) * np.pi / 180.0
					radii_mat = np.dot(
						np.array([
							[np.cos(angle), -np.sin(angle)],
							[np.sin(angle), np.cos(angle)]
						]),
						np.array([[radii[0], 0.0], [0.0, radii[1]]])
					)
					tr_radii_mat = np.dot(tr_mat, radii_mat)
					tr_radii = np.linalg.norm(tr_radii_mat, axis=0)
					tr_radii_rounded = np.round(tr_radii, decimals=PRECISION)
					tr_radii_mat_normed = tr_radii_mat/tr_radii
					tr_angle = np.arctan2(
						tr_radii_mat_normed[1, 0] - tr_radii_mat_normed[0, 1],  # 2sin
						tr_radii_mat_normed[0, 0] + tr_radii_mat_normed[1, 1]  # 2cos
					) * 180 / np.pi
					tr_coords = np.round(np.dot(tr_mat, coords) + tr_tr, decimals=PRECISION)
					new_str += f" {tr_radii_rounded[0]} {tr_radii_rounded[1]} {np.round(tr_angle, decimals=PRECISION)} {tokens_gathered[3]} {tokens_gathered[4]} {tr_coords[0]} {tr_coords[1]}"
				else:
					coords = [float(tokens_gathered[0]), float(tokens_gathered[1])]
					tr_coords = np.round(np.dot(tr_mat, coords) + tr_tr, decimals=PRECISION)
					new_str += f" {tr_coords[0]} {tr_coords[1]}"
				tokens_gathered = []

	if tokens_gathered:
		raise CannotTransformError(f"cannot parse d-string (unexpected number of tokens at end): '{d_str}'")

	return new_str.strip()


def _transform_path(line: str) -> str:
	transform_mat = np.array(EXTRA_TRANSFORM_MAT)
	transform_tr = np.array(EXTRA_TRANSLATION)
	transform_match = re.search(TRANSFORM_PATTERN, line)
	if transform_match:
		transform_mat = np.dot(
			np.array(
				[
					[float(transform_match.group(1)), float(transform_match.group(2))],
					[float(transform_match.group(3)), float(transform_match.group(4))]
				]
			),
			transform_mat
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
