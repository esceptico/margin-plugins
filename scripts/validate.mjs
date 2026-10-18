// Checks the marketplaces, plugin manifests, the files they point to, and the skill's frontmatter.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const problems = [];
const json = path => { try { return JSON.parse(readFileSync(path, "utf8")); } catch (error) { problems.push(`${path}: ${error.message}`); return {}; } };
const need = (path, object, keys) => { for (const key of keys) if (object[key] === undefined) problems.push(`${path}: missing "${key}"`); };
const exists = (base, relative, from) => { if (!existsSync(join(base, relative))) problems.push(`${from}: points to missing ${relative}`); };

for (const path of [".claude-plugin/marketplace.json", ".cursor-plugin/marketplace.json"]) {
  const m = json(path); need(path, m, ["name", "owner", "plugins"]);
  for (const p of m.plugins ?? []) { need(path, p, ["name", "source"]); exists(".", p.source, path); }
}
const codex = ".agents/plugins/marketplace.json", cm = json(codex);
need(codex, cm, ["name", "plugins"]);
for (const p of cm.plugins ?? []) { need(codex, p, ["name", "source", "policy", "category"]); exists(".", p.source?.path ?? "", codex); }

for (const plugin of ["plugins/margin"]) {
  for (const [kind, keys] of [[".claude-plugin", ["name", "version", "description"]], [".codex-plugin", ["name", "version", "description", "interface"]], [".cursor-plugin", ["name", "version", "description"]]]) {
    const path = join(plugin, kind, "plugin.json"), manifest = json(path);
    need(path, manifest, keys);
    if (manifest.name !== "margin") problems.push(`${path}: name should be "margin"`);
    for (const key of ["mcpServers", "skills", "logo"]) if (typeof manifest[key] === "string") exists(plugin, manifest[key], path);
    for (const key of ["logo", "composerIcon"]) if (typeof manifest.interface?.[key] === "string") exists(plugin, manifest.interface[key], path);
    if (typeof manifest.mcpServers === "string") {
      const servers = json(join(plugin, manifest.mcpServers)).mcpServers ?? {};
      if (!servers.margin?.url?.startsWith("https://")) problems.push(`${manifest.mcpServers}: margin needs an https url`);
    }
  }
  const skill = join(plugin, "skills/margin/SKILL.md");
  const text = existsSync(skill) ? readFileSync(skill, "utf8") : "";
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1];
  if (!front) problems.push(`${skill}: missing frontmatter`);
  else {
    const fields = Object.fromEntries(front.split("\n").map(line => line.split(/:\s*/, 2)).filter(([k]) => k));
    const allowed = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
    for (const key of Object.keys(fields)) if (!allowed.has(key)) problems.push(`${skill}: "${key}" is not an Agent Skills field`);
    if (fields.name !== "margin" || fields.name !== dirname(skill).split("/").pop()) problems.push(`${skill}: name must match its folder`);
    if (!fields.description || fields.description.length > 1024) problems.push(`${skill}: description must be 1–1024 characters`);
  }
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("All plugin files check out.");
