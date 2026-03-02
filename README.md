# 338-fantasy-league-skill

Contains both:
1. `SKILL.md` for Claude-style skill distribution
2. A read-only MCP server (`src/index.mjs`) for chat surfaces that need tool integration

## Contents
- `SKILL.md` — skill definition and usage
- `MCP.md` — MCP server summary
- `src/index.mjs` — MCP server implementation
- `scripts/package-skill.sh` — creates a distributable zip for Claude.ai skill upload

## Package for Claude.ai upload

```bash
./scripts/package-skill.sh
```

Output:
- `dist/338-fantasy-league-skill.zip`

## Run MCP server

```bash
npm install
npm start
```

## Install in Claude Code (marketplace)

```bash
/plugin marketplace add axelclark/338-fantasy-league-skill
/plugin install 338-fantasy-league-skill
```
