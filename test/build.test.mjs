// Regression guard for the token build. Runs `build.mjs`, then:
//  1. snapshots the deterministic outputs against committed fixtures (catches value drift), and
//  2. asserts structural invariants (completeness, no collisions, no unresolved refs, exports resolve).
// Zero deps — Node's built-in test runner (requires Node >= 22, per package.json engines).
//
// If a token/build change is intentional and a snapshot fails, regenerate the fixture:
//   node build.mjs && cp css/bh2022.css css/bh2022-dark.css css/bh2026.css test/fixtures/ \
//     && cp scss/variables.scss lib/variables.json test/fixtures/
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { THEMES } from "../manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(join(root, relative), "utf8");
const fixture = (name) => read(join("test/fixtures", name));
const declNames = (css) => [...css.matchAll(/--([a-z0-9-]+)\s*:/g)].map((m) => m[1]);
// An unresolved Style Dictionary / DTCG reference survives as a brace-wrapped dotted
// identifier path with no whitespace, e.g. `{color.white}`. Anchored to `{<ident>(.<ident>)+}`
// so it can't match a real CSS `{ … }` block (those open with a newline, not an identifier).
const UNRESOLVED_REF = /\{[a-z][\w-]*(?:\.[\w-]+)+}/i;

// build.mjs emits the raw css/scss/lib; postcss/minify (postbuild) are no-ops on the token
// css, so building the script alone is a faithful, fast check.
before(() => {
  execSync("node build.mjs", { cwd: root, stdio: "ignore" });
});

// --- Snapshots: deterministic outputs must match committed fixtures ------------------------
// (The two lib/variables.{js,esm.js} carry a build timestamp, so they are covered structurally
//  below rather than snapshotted; variables.json holds the same data with no timestamp.)
const SNAPSHOTS = [
  ["css/bh2022.css", "bh2022.css"],
  ["css/bh2022-dark.css", "bh2022-dark.css"],
  ["css/bh2026.css", "bh2026.css"],
  ["scss/variables.scss", "variables.scss"],
  ["lib/variables.json", "variables.json"],
];
for (const [output, name] of SNAPSHOTS) {
  test(`snapshot: ${output} matches test/fixtures/${name}`, () => {
    assert.equal(
      read(output),
      fixture(name),
      `${output} drifted from its fixture. If the change is intentional, update test/fixtures/${name}.`
    );
  });
}

// --- Invariants ---------------------------------------------------------------------------
test("no duplicate var names within a theme", () => {
  for (const file of ["css/bh2022.css", "css/bh2026.css"]) {
    const names = declNames(read(file));
    assert.equal(new Set(names).size, names.length, `${file} has duplicate var names`);
  }
});

test("bh2026: all emitted var names are valid CSS custom property identifiers", () => {
  const css = read("css/bh2026.css");
  // CSS custom property names may only contain [a-z0-9-] after the -- prefix.
  // Spaces, uppercase, or other characters make the declaration invalid and silently dropped.
  const invalid = [...css.matchAll(/--([^\s:]+)\s*:/g)]
    .map((m) => m[1])
    .filter((name) => !/^[a-z0-9-]+$/.test(name));
  assert.deepEqual(invalid, [], `bh2026 has invalid CSS custom property names: ${invalid.join(", ")}`);
});

test("no unresolved references leak into any output", () => {
  for (const file of ["css/bh2022.css", "css/bh2022-dark.css", "css/bh2026.css", "scss/variables.scss"]) {
    assert.doesNotMatch(read(file), UNRESOLVED_REF, `${file} contains an unresolved {ref}`);
  }
  assert.ok(!read("lib/variables.json").includes('"{'), "lib/variables.json contains an unresolved ref");
});

test("bh2022 back-compat: background.* and theme.background.* both emitted", () => {
  const css = read("css/bh2022.css");
  assert.match(css, /--background-body:/);
  assert.match(css, /--theme-background-body:/);
});

test("published manifest mirrors the registry", () => {
  const published = JSON.parse(read("lib/manifest.json"));
  assert.equal(published.themes.length, THEMES.length);
  for (const theme of THEMES) {
    const entry = published.themes.find((t) => t.name === theme.name);
    assert.ok(entry, `${theme.name} missing from published manifest`);
    assert.equal(entry.selector, theme.selector, `${theme.name} selector mismatch`);
    assert.equal(entry.css.light, `./${theme.outputs.light}`, `${theme.name} light css path mismatch`);
  }
});

test("every package.json export target resolves to a real file", () => {
  const pkg = JSON.parse(read("package.json"));
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (subpath.endsWith("*")) continue; // wildcards resolve dynamically
    const file = typeof target === "string" ? target : target.default ?? target.import;
    assert.ok(existsSync(join(root, file)), `export "${subpath}" -> ${file} does not exist`);
  }
});

test("JS artifacts build with the expected shape", () => {
  assert.match(read("lib/variables.js"), /module\.exports = \{/);
  assert.match(read("lib/variables.esm.js"), /export const color =/);
});
