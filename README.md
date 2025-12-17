# Universal Skills

[![Run in Smithery](https://smithery.ai/badge/skills/klaudworks)](https://smithery.ai/skills?ns=klaudworks&utm_source=github&utm_medium=badge)


[![npm version](https://img.shields.io/npm/v/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![npm downloads](https://img.shields.io/npm/dt/universal-skills.svg)](https://www.npmjs.com/package/universal-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Universal Skills** brings Anthropic's Skills feature to any AI coding agent that supports MCP. Skills are markdown files containing specialized knowledge that can be dynamically loaded into your agent's context only when needed.

### How to Use Skills

For a real-world example on how I personally use skills see [Creating a Skill](./docs/creating-a-skill.md).

### Why I built this

A week ago, I reverse engineered Claude Code's skills. A day ago, I spotted this repo [openskills](https://github.com/numman-ali/openskills) which implements skills for other coding agents. Their approach works but is suboptimal. That's why I decided to build a functional equivalent to Claude Code's skills based on MCP. See [why not use openskills](./docs/FAQ.md#why-dont-i-just-use-openskills) for details.

## Installation

<details>
<summary><strong>Codex</strong></summary>

Add the skills server to Codex using the MCP add command:

```bash
codex mcp add skills -- npx universal-skills mcp
```

<img width="660" height="573" alt="image" src="https://github.com/user-attachments/assets/8f0fb13b-1cbd-4552-917c-1b1c36d8180c" />

</details>

<details>
<summary><strong>Claude Code</strong></summary>

Add the skills server to Claude Code using the MCP add command:

```bash
claude mcp add --transport stdio skills -- npx universal-skills mcp
```

<img width="1298" height="462" alt="image" src="https://github.com/user-attachments/assets/1ffc36e0-0522-48fa-ab5c-871e0e206054" />

</details>

<details>
<summary><strong>OpenCode</strong></summary>

Add the skills server to your OpenCode configuration by creating or editing the `opencode.json` file in your project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "skills": {
      "type": "local",
      "command": ["npx", "universal-skills", "mcp"],
      "enabled": true
    }
  }
}
```

For opencode I had to be quite explicit in instructing the agent to load a skill. I will have a look into their default instructions to improve that.

<img width="844" height="446" alt="image" src="https://github.com/user-attachments/assets/0b61967a-122e-4289-a0b1-a078f54c55cc" />

</details>

<details>
<summary><strong>Other Agents</strong></summary>

This should also work fine with Cursor and other Agent's that support MCP. Just not tested yet.

</details>

## Updating

To update to the latest version:

```bash
# Clear npx cache
npx clear-npx-cache

# Or manually remove cache
rm -rf ~/.npm/_npx-cache

# Reinstall with @latest tag
codex mcp remove skills
codex mcp add skills -- npx universal-skills@latest mcp
```

## Skill Directory Structure

Skills are automatically discovered from four directories in priority order (first match wins):

1. `yourproject/.agent/skills/` - Project-specific skills
2. `yourproject/.claude/skills/` - Project-specific skills
3. `~/.agent/skills/` - Global skills
4. `~/.claude/skills/` - Global skills

Each skill is a directory containing a `SKILL.md` file:

```
.agent/skills/
├── git/
│   └── SKILL.md
└── postgres/
    └── SKILL.md
```

**Priority Resolution**: If the same skill name exists in multiple directories, the one from the higher priority directory wins. This allows you to:
- Override global skills with project-specific versions
- Override Claude-specific skills with universal agent skills (useful when different agents need different configurations)

### Custom Skill Directories

Add additional directories to recursively search for skills using `--skill-dir` (can be specified multiple times). E.g. include skills installed via the Claude Code marketplace as follows. However, you can also install skills using `npx universal-skills install`. No benefit in using the Claude Code marketplace.

```bash
codex mcp add skills -- npx universal-skills mcp --skill-dir ~/.claude/plugins
```

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

## Troubleshooting

You can run `npx universal-skills mcp` in the folder of your project. It will print out which directories were searched for skills and which skills were picked up.


