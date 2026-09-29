set -eu

weigh_specs() {
  find cypress/e2e -maxdepth 1 -type f | sort | while read -r spec; do
    printf '%s %s\n' "$(grep -c '^[[:space:]]*it(' "$spec" || true)" "$spec"
  done
}

if [ "$1" = "--plan" ]; then
  per_shard="$2"
  if [ "$per_shard" -lt 1 ]; then
    echo "A shard holds at least one spec, got $per_shard" >&2
    exit 1
  fi
  weigh_specs | awk -v per="$per_shard" '
    { specs++ }
    END {
      shards = int((specs + per - 1) / per)
      if (shards < 1) shards = 1
      printf "["
      for (shard = 1; shard <= shards; shard++) {
        printf "%s%d", (shard > 1 ? "," : ""), shard
      }
      print "]"
    }'
  exit 0
fi

index="$1"
total="$2"

weigh_specs | sort -rn -k1,1 -k2,2 | awk -v idx="$index" -v n="$total" '
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
