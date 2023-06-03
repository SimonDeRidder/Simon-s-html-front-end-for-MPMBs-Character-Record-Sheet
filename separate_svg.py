
# %%

with open("img/page_reference/backgrounds/movement.svg", 'rt', encoding='utf-8') as f:
	lines_to_delete = f.readlines()

# %%

relevant_lines_to_delete = [line for line in lines_to_delete if line.startswith("<path") or line.startswith("  <use")]

# %%

with open("img/bg7_other.svg", 'wt', encoding='utf-8') as outf:
	with open("img/bg7.svg", 'rt', encoding='utf-8') as inpf:
		for line in inpf.readlines():
			if line not in relevant_lines_to_delete:
				outf.write(line)

# %%
