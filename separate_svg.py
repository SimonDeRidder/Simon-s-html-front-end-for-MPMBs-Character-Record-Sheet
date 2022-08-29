
# %%

with open("img/page_features_equipment/backgrounds/racial_traits.svg", 'rt') as f:
    lines_to_delete = f.readlines()

# %%

relevant_lines_to_delete = [line for line in lines_to_delete if line.startswith("<path")]

# %%

with open("img/bg2_other.svg", 'wt') as outf:
    with open("img/bg2.svg", 'rt') as inpf:
        for line in inpf.readlines():
            if line not in relevant_lines_to_delete:
                outf.write(line)

# %%
