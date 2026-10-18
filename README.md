# Margin agent plugins

Use [Margin](https://margin.timganiev.com), your pen drawing board, with your agent. The agent reads what you share, answers with notes beside your drawing, and can propose marks, plots and diagrams that stay faint until you keep them.

Every plugin connects to `https://margin.timganiev.com/mcp` and signs in through your browser the first time.

## Claude Code

```sh
/plugin marketplace add esceptico/margin-plugins
/plugin install margin@margin
```

Then run `/mcp`, pick **margin** and sign in.

## Codex

```sh
codex plugin marketplace add esceptico/margin-plugins
codex plugin add margin@margin
codex mcp login margin
```

## Cursor

Open **Settings › Plugins**, add the marketplace `esceptico/margin-plugins`, and install **Margin**.

## Claude and ChatGPT (web and desktop)

These apps use connectors instead of plugins. In Margin, open **Agent › Connect** and follow the steps for your app.

## Any other agent

```sh
npx -y add-mcp https://margin.timganiev.com/mcp -n margin
```

The skill on its own lives at [`plugins/margin/skills/margin/SKILL.md`](plugins/margin/skills/margin/SKILL.md). Copy it into `~/.agents/skills/margin/` or your agent's skills folder.

## Checks

`node scripts/validate.mjs` checks every manifest, the paths they point to, and the skill. CI runs it on each push.
