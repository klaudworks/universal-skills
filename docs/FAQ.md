# Frequently Asked Questions

## Installation and Setup

<details>
  
<summary>Which AI agents are supported?</summary>

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

## Technical Details

<details>
  
<summary>How does this differ from other approaches such as openskills?</summary>
Openskills:

- **Requires manual sync**: Users must run `openskills sync` CLI command every time they add a skill to get it discovered
- **Relies on AGENTS.md**: Uses AGENTS.md for discovery rather than treating skills as native tools
- **Knowledge decay**: openskills simply injects all available skills into the `AGENTS.md`. Anthropic injects available tools into each API request instead. The advantage is that the knowledge about your skills does not decay throughout the conversation.

When using universal-skills with Claude Code, it leads to the same API requests and responses to the Anthropic API as the native skill tool. A skill tool is injected into each API request, so the knowledge about available skills does not decay over time.

Also check out my discussion with the maintainer of openskills: https://github.com/sst/opencode/issues/3235#issuecomment-3487297151
</details>

<details>
  
<summary>How do Claude's skills work under the hood?</summary>
Check my tweet: https://x.com/klaudworks/status/1982029102925414477.
</details>

<details>
  
<summary>Is this really functionally equivalent to Claude Code's skills?</summary>

Yes, I intercepted the traffic from Claude Code to Anthropic's API to verify that. #TODO explain in more detail

</details>


