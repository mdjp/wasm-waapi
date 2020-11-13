#!/bin/bash

# Mods to compile
MODS=(gain)

for i in "${MODS[@]}"
do
   echo "Compiling $i"
   clang --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all -Wl,--allow-undefined -o output/$i.wasm $i.c
done