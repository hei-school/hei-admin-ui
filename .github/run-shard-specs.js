import cypress from "cypress";

const specs = (process.env.SHARD_SPECS ?? "").split(",").filter(Boolean);
if (specs.length === 0) {
  console.error("No spec given to this shard");
  process.exit(1);
}

const results = await cypress.run({
  spec: specs.join(","),
  env: {coverage: true},
});

if (results.status === "failed") {
  console.error(results.message);
  process.exit(results.failures || 1);
}

const ranSpecs = new Set(
  results.runs.map((run) => run.spec.relative.replaceAll("\\", "/"))
);
const skippedSpecs = specs.filter((spec) => !ranSpecs.has(spec));
if (skippedSpecs.length > 0) {
  console.error(`Cypress did not run: ${skippedSpecs.join(", ")}`);
  process.exit(1);
}

process.exit(results.totalFailed > 0 ? 1 : 0);
