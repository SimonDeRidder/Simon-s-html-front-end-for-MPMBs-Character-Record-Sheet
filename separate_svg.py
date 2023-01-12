
# %%

with open("img/page_reference/backgrounds/attack_action.svg", 'rt') as f:
    lines_to_delete = f.readlines()

# %%

relevant_lines_to_delete = [line for line in lines_to_delete if line.startswith("<path") or line.startswith("  <use")]

# %%

with open("img/bg7_other.svg", 'wt') as outf:
    with open("img/bg7.svg", 'rt') as inpf:
        for line in inpf.readlines():
            if line not in relevant_lines_to_delete:
                outf.write(line)

# %%
