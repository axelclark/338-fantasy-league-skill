# 338-fantasy-league-skill

Skill for querying 338 Challenge fantasy league data via the public read-only API.

## Contents
- `SKILL.md` — skill definition and usage
- `scripts/package-skill.sh` — creates distributable zip for Claude.ai skill upload

## Package for Claude.ai upload

```bash
./scripts/package-skill.sh
```

Output:
- `dist/338-fantasy-league-skill.zip`

## Install in Claude.ai

1. Open **Settings → Capabilities → Skills**
2. Upload `dist/338-fantasy-league-skill.zip`

## Troubleshooting

### `403` / blocked domain / host not allowed
In Claude settings, add this domain to allowlist:

- `the338challenge.com`

Then start a fresh chat/session and retry.

### It keeps picking the wrong league
This skill is league-agnostic. Ask with a specific league id/year/division, or have the assistant list leagues first.
