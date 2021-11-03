from os import listdir, rmdir
from shutil import move
from os.path import isdir, join


def tpl(name):
    return f'''[package]
name = "{name}"
version = "0.1.0"
edition = "2018"

[[bin]]
name = "{name}"
path = "main.rs"'''


def ls(dir_path):
    return map(lambda name: (name, join(dir_path, name)), listdir(dir_path))


for (problem_name, problem_path) in ls("problems"):
    if not isdir(problem_path):
        continue
    with open(join(problem_path, "Cargo.toml"), "w") as file:
        file.write(tpl(problem_name))
    src_dir = join(problem_path, "src")
    for (src_name, src_path) in ls(src_dir):
        move(src_path, join(problem_path, src_name))
    rmdir(src_dir)
    print(f"done: {problem_name}")
