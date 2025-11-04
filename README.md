# Universal Skills

[![npm version](https://img.shields.io/npm/v/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![npm downloads](https://img.shields.io/npm/dt/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Universal Skills** brings Anthropic's Skills feature to any AI coding agent that supports MCP. Skills are markdown files containing specialized knowledge that can be dynamically loaded into your agent's context only when needed.

### How to Use Skills

For a real-world example, see [Creating a Skill](./docs/creating-a-skill.md).

### Why I built this

A week ago, I reverse engineered Claude Code's skills. A day ago, I spotted this repo [openskills](https://github.com/numman-ali/openskills) which implements skills for other coding agents. Their approach works but just writing available skills into the AGENTS.md is suboptimal. That's why I decided to build a functional equivalent to Claude Code's skills based on MCP. More information in the [FAQ documentation](./docs/FAQ.md).

## Installation

### Codex

Add the skills server to Codex using the MCP add command:

```bash
codex mcp add universal-skills -- npx universal-skills mcp
```

### Claude Code

Add the skills server to Claude Code using the MCP add command:

```bash
claude mcp add --transport stdio universal-skills -- npx universal-skills mcp
```

### OpenCode

Add the skills server to your OpenCode configuration by creating or editing the `opencode.json` file in your project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "universal-skills": {
      "type": "local",
      "command": ["npx", "universal-skills", "mcp"],
      "enabled": true
    }
  }
}
```

### Other Agents

This should also work fine with Cursor and other Agent's that support MCP. Just not tested yet.

## Skill Directory Structure

Skills are automatically discovered from four directories in priority order (first match wins):

1. `yourproject/.agent/skills/` - Project-specific skills
2. `yourproject/.claude/skills/` - Project-specific skills
3. `~/.claude/skills/` - Global skills
4. `~/.agent/skills/` - Global skills

Each skill is a directory containing a `SKILL.md` file:

```
.agent/skills/
├── git/
│   └── SKILL.md
└── postgres/
    └── SKILL.md
```

**Priority Resolution**: If the same skill name exists in multiple directories, the one from the higher priority directory wins. This allows you to override global skills with project-specific versions.

## Download and install specific skills

Install a skill from a GitHub repository:

```bash
# Interactive mode (prompts for all options)
npx universal-skills install

# With all options
npx universal-skills install --repo https://github.com/user/repo --repo-dir skills/my-skill --local-dir ~/.claude/skills
```

## FAQ

For frequently asked questions, see the [FAQ documentation](./docs/FAQ.md).
