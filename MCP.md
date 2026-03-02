# ex338-fantasy MCP Server

Read-only MCP server for 338 fantasy league data.

## Tools
- `health()`
- `get_league_standings({ league_id })`
- `get_team({ team_id })`
- `list_waivers({ league_id, status? })`
- `list_draft_picks({ league_id })`
- `list_fantasy_players({ league_id, availability? })`

## Run
```bash
npm install
npm start
```

## Notes
- Upstream API base: `https://the338challenge.com/api/v1`
- Request timeout: 10 seconds
- Read-only by design
