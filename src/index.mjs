import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://the338challenge.com/api/v1";
const TIMEOUT_MS = 10_000;

async function apiGet(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { "accept": "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const extra = body ? ` - ${body.slice(0, 200)}` : "";
      throw new Error(`Upstream returned ${res.status}${extra}`);
    }

    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Upstream request timed out after ${TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function text(payload) {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

const server = new McpServer({
  name: "ex338-fantasy",
  version: "0.1.0",
});

server.tool("health", "Check upstream API availability", {}, async () => {
  try {
    await apiGet("/fantasy_leagues");
    return text({ ok: true, upstream: "reachable" });
  } catch (error) {
    return text({ ok: false, upstream: "unreachable", error: error.message });
  }
});

server.tool(
  "get_league_standings",
  "Get league metadata + standings",
  { league_id: z.number().int().positive() },
  async ({ league_id }) => {
    const data = await apiGet(`/fantasy_leagues/${league_id}`);
    const league = data?.fantasy_league ?? {};
    const standings = (league.standings ?? []).map((row) => ({
      rank: row.rank,
      fantasy_team_id: row.fantasy_team_id,
      team_name: row.team_name,
      points: row.points,
      waiver_position: row.waiver_position,
      winnings: row.winnings,
    }));

    return text({
      league: {
        id: league.id,
        name: league.fantasy_league_name,
        year: league.year,
        division: league.division,
      },
      standings,
    });
  }
);

server.tool(
  "get_team",
  "Get team detail, owners, and roster",
  { team_id: z.number().int().positive() },
  async ({ team_id }) => {
    const data = await apiGet(`/fantasy_teams/${team_id}`);
    const team = data?.fantasy_team ?? {};

    return text({
      team: {
        id: team.id,
        team_name: team.team_name,
        points: team.points,
        waiver_position: team.waiver_position,
        winnings: team.winnings,
      },
      owners: team.owners ?? [],
      roster_positions: team.roster_positions ?? [],
    });
  }
);

server.tool(
  "list_waivers",
  "List waivers for a league; optionally filter by status",
  {
    league_id: z.number().int().positive(),
    status: z.enum(["pending", "successful", "failed"]).optional(),
  },
  async ({ league_id, status }) => {
    const data = await apiGet(`/fantasy_leagues/${league_id}/waivers`);
    const waivers = data?.waivers ?? [];

    return text({
      waivers: status ? waivers.filter((w) => w.status === status) : waivers,
    });
  }
);

server.tool(
  "list_draft_picks",
  "List draft picks for a league",
  { league_id: z.number().int().positive() },
  async ({ league_id }) => {
    const data = await apiGet(`/fantasy_leagues/${league_id}/draft_picks`);
    return text({ draft_picks: data?.draft_picks ?? [] });
  }
);

server.tool(
  "list_fantasy_players",
  "List fantasy players for a league; optionally filter by availability",
  {
    league_id: z.number().int().positive(),
    availability: z.enum(["available", "rostered"]).optional(),
  },
  async ({ league_id, availability }) => {
    const data = await apiGet(`/fantasy_leagues/${league_id}/fantasy_players`);
    const players = data?.fantasy_players ?? [];

    return text({
      fantasy_players: availability
        ? players.filter((p) => p.availability === availability)
        : players,
    });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
