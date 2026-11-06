#!/bin/bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
source "$HOME/.cargo/env"
rustup target add x86_64-pc-windows-gnu x86_64-unknown-linux-musl
pnpm build
