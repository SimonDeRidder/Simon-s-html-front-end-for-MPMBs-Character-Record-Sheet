#!/bin/sh
set -e

# TODO: use proper github actions when merged into main
echo "======================= test ======================="
cargo -q test
echo "===================== tarpaulin ===================="
cargo -q tarpaulin --ignore-tests -- -q
echo "====================== clippy ======================"
cargo -q clippy -- -D warnings
echo "======================== fmt ======================="
cargo -q fmt -- --check
echo "======================= audit ======================"
cargo -q audit