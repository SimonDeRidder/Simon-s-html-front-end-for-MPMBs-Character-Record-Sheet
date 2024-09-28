#!/bin/sh
set -e

echo "======================= test ======================="
cargo -q test
echo "===================== tarpaulin ===================="
cargo -q tarpaulin --ignore-tests -- -q
echo "====================== clippy ======================"
cargo -q clippy -- -D warnings
echo "======================== fmt ======================="
cargo -q fmt -- --check
echo "======================= audit ======================"
cargo -q audit --ignore RUSTSEC-2023-0028 --ignore RUSTSEC-2023-0050 --ignore RUSTSEC-2023-0081 --ignore RUSTSEC-2021-0146 --ignore RUSTSEC-2024-0436
