# Frequently Asked Questions

## Installation and Setup

<details>
<summary>What AI agents are supported?</summary>

Universal Skills MCP Server works with any MCP-compatible AI agent, including:

- **OpenCode** - Configure via `opencode.json`
- **Claude Code** - Configure via `claude mcp add` command
- **Codex** - Configure via `codex mcp add` command
- Any other agent that supports the Model Context Protocol

</details>

<details>
<summary>Do I need to restart my agent after making changes to a skill?</summary>

Unlike in Claude Code's implementation, modified skills will be picked up within 30 seconds. This allows you to modify a skill while you are working with it. Then you can just instruct your agent to load the skill again and the updated skill will be loaded.

New skills still require you to restart your agent.

</details>

## How do skills work under the hood?

TBD
