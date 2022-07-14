
# %%

with open("page_1/bg_inspiration.svg", 'rt') as f:
    lines_to_delete = f.readlines()

# %%

relevant_lines_to_delete = [line for line in lines_to_delete if line.startswith("<path")]

# %%

with open("page_1/bg_other2.svg", 'wt') as outf:
    with open("page_1/bg_other.svg", 'rt') as inpf:
        for line in inpf.readlines():
            if line not in relevant_lines_to_delete:
                outf.write(line)

# %%
