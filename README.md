# 338-fantasy-league-skill

Agent skill for querying 338 Challenge fantasy league data via the ex338 read-only API.

## Contents
- `SKILL.md` — skill definition and usage
- `scripts/package-skill.sh` — creates a distributable zip for Claude.ai skill upload

## Package for Claude.ai upload

```bash
./scripts/package-skill.sh
```

Output:
- `dist/338-fantasy-league-skill.zip`

## Install in Claude Code (marketplace)

```bash
/plugin marketplace add axelclark/338-fantasy-league-skill
/plugin install 338-fantasy-league-skill
```
