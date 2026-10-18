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

## Claude and ChatGPT (web and desktop)

These apps use connectors instead of plugins. In Margin, open **Agent › Connect** and follow the steps for your app.

## Any other agent

```sh
npx -y add-mcp https://margin.timganiev.com/mcp -n margin
```

To add the Margin skill on its own (Cursor, Codex, Claude Code and others), use [skills.sh](https://skills.sh):

```sh
npx skills add esceptico/margin-plugins --skill margin
```

The skill lives at [`plugins/margin/skills/margin/SKILL.md`](plugins/margin/skills/margin/SKILL.md).
