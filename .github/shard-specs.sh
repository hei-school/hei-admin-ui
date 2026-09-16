#!/bin/bash
# Prints the comma separated list of Cypress specs a shard has to run.
#
# Usage: shard-specs.sh <shard index, from 0> <shard count>
#
# Dealing the specs out alphabetically leaves one shard with all the slow ones,
# so they go to the least loaded shard instead, heaviest first. The weight is
# the number of tests in a spec, which stays right as specs come and go — no
# recorded timings to keep up to date.
set -eu

index="$1"
total="$2"

find cypress/e2e -maxdepth 1 -type f | sort | while read -r spec; do
  printf '%s %s\n' "$(grep -c '^[[:space:]]*it(' "$spec" || true)" "$spec"
done | sort -rn -k1,1 -k2,2 | awk -v idx="$index" -v n="$total" '
BEGIN { for (shard = 0; shard < n; shard++) load[shard] = 0 }
{
  lightest = 0
  for (shard = 1; shard < n; shard++) {
    if (load[shard] < load[lightest]) lightest = shard
  }
  load[lightest] += $1
  if (lightest == idx) specs = specs (specs ? "," : "") $2
}
END { print specs }'
