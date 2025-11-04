# Universal Skills

[![npm version](https://img.shields.io/npm/v/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![npm downloads](https://img.shields.io/npm/dt/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Universal Skills** brings Anthropic's Skills feature to any AI coding agent that supports MCP. Skills are markdown files containing specialized knowledge that can be dynamically loaded into your agent's context only when needed.

### What This Solves

Instead of bloating your agent's context with all possible knowledge upfront, skills let you organize domain-specific information (git workflows, database schemas, API patterns, etc.) into separate files. Your agent automatically loads the right skill at the right time based on your prompt and the skill's description. This is super simple but works super well at the same time.

**Example use case:** A project-specific git skill that knows your team's branch naming conventions, commit message format, and how to create pull requests using GitHub CLI—all loaded only when you're working with git.

### Why I built this

A week ago, I reverse engineered Claude Code's skills. A day ago, I spotted this repo [openskills](https://github.com/numman-ali/openskills) which implemented the same functionality for other coding agents. Their approach works but has some shortcomings. That's why I decided to build a functional equivalent to Claude Code's skills based on MCP. More information in the [FAQ documentation](./docs/FAQ.md).

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

## Creating Your First Skill

1. Create a skill directory in any of the four locations:

   ```bash
   mkdir -p ~/.agent/skills/my-skill
   ```

2. Create a `SKILL.md` file with YAML frontmatter:

   ```bash
   cat > ~/.agent/skills/my-skill/SKILL.md << 'EOF'
   ---
   name: my-skill
   description: A brief description of what this skill does
   ---

   # My Skill

   ## Overview

   Detailed documentation about your skill...

   ## Usage

   Instructions on how to use this skill...
   EOF
   ```

3. The skill will be automatically discovered within 30 seconds (or on server restart)

**Required YAML frontmatter fields:**

- `name`: Skill identifier (any characters allowed)
- `description`: Brief description that describes in which situation the skill should be loaded.

Skills missing either field will be skipped during scanning.

## Using Skills

Once installed, your AI agent will have access to the `skill` tool.

### Loading a Skill

The agent will automatically load a skill when your request matches the skill's description.

**Direct invocation:**
The most direct way is to explicitly request a skill by name:

```
User: "Load the git skill"
```

**Automatic invocation:**
Skills are also invoked automatically based on their description. For example, if your skill description states "invoke this skill whenever a user wants to interact with git (e.g., create a feature branch or pull request)", the agent will automatically load the skill when you ask git-related questions.

Once loaded, the agent has access to all knowledge in your skill. For example, a git skill could include:

- How to create a GitHub pull request using the GitHub CLI
- Naming conventions (e.g., `feature/my-feature`)
- Team-specific workflows and best practices

## FAQ

For frequently asked questions, see the [FAQ documentation](./docs/FAQ.md).
