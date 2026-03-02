---
name: 338-fantasy-league
description: Query 338 Challenge fantasy league data (standings, rosters, draft picks, waivers, championships, players, trades, injured reserve) for any league year/division.
---

# 338 Fantasy League Data

Use this skill to query live data from [the338challenge.com](https://the338challenge.com) via the read-only JSON API.

## API Base

```
https://the338challenge.com/api/v1
```

No authentication required.

## Required Behavior

- Do **not** assume a default league id.
- If the user does not provide a league id/year/division, ask a short clarifying question.
- If needed, call `GET /fantasy_leagues` first, then select the matching league by year/division/name.
- Prefer direct API URLs; avoid search/discovery steps.

## Endpoints

### Leagues

```bash
# List all leagues
curl -s https://the338challenge.com/api/v1/fantasy_leagues | python3 -m json.tool

# Get league detail with standings
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id} | python3 -m json.tool
```

Response keys: `id`, `fantasy_league_name`, `year`, `division`, `standings[]` (with `rank`, `points`, `fantasy_team_id`, `team_name`, `waiver_position`, `winnings`)

### Teams

```bash
# Get team with full roster
curl -s https://the338challenge.com/api/v1/fantasy_teams/{team_id} | python3 -m json.tool
```

Response keys: `id`, `team_name`, `points`, `waiver_position`, `owners[]`, `roster_positions[]` (with `position`, `status`, `fantasy_player.player_name`, `fantasy_player.sports_league`)

### Draft Picks

```bash
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/draft_picks | python3 -m json.tool
```

### Waivers

```bash
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/waivers | python3 -m json.tool
```

Response keys per waiver: `id`, `status` (pending/successful/unsuccessful), `inserted_at`, `process_at`, `fantasy_team`, `add_fantasy_player`, `drop_fantasy_player`

### Championships

```bash
# List all championships for a league
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/championships | python3 -m json.tool

# Championship detail with results
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/championships/{id} | python3 -m json.tool
```

### Fantasy Players

```bash
# All players with ownership status
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/fantasy_players | python3 -m json.tool
```

Response keys per player: `id`, `player_name`, `sports_league`, `roster_positions[]` (empty = unowned, populated = owned with `fantasy_team.id` and `fantasy_team.team_name`)

### Trades

```bash
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/trades | python3 -m json.tool
```

### Injured Reserves

```bash
curl -s https://the338challenge.com/api/v1/fantasy_leagues/{league_id}/injured_reserves | python3 -m json.tool
```

## Common Query Patterns

- **Who is leading a league?** → `GET /fantasy_leagues/{league_id}` and use `standings`
- **What is on a team roster?** → `GET /fantasy_teams/{team_id}`
- **Who is available in a sport?** → `GET /fantasy_leagues/{league_id}/fantasy_players` and filter by `sports_league` + empty `roster_positions`
- **Pending waivers?** → `GET /fantasy_leagues/{league_id}/waivers` and filter `status = pending`

## Sport Abbreviations

CFB, MLB, NFL, NBA, NHL, PGA, CL (Champions League), CBK (College Basketball), CHK (College Hockey), CBS (College Baseball), KD (Kentucky Derby), LLWS (Little League WS), WTn (Women's Tennis), MTn (Men's Tennis), WC (World Cup)
