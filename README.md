# Universal Skills

A Model Context Protocol (MCP) server and CLI tool that discovers and loads skill markdown files from prioritized directory locations, providing AI assistants access to domain-specific knowledge and workflows.

## Features

- **MCP Server**: Automatically discovers and serves skills to AI agents
- **CLI Tool**: Install skills directly from GitHub repositories
- **Automatic Discovery**: Scans multiple directories for skill files
- **Priority Resolution**: Project-specific skills override global skills
- **Case-Insensitive Matching**: Load skills by name regardless of case
- **Auto-Refresh**: Skills refresh every 30 seconds automatically
- **Universal Compatibility**: Works with any MCP-compatible AI agent

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Quick Install

Install globally via npm:

```bash
npm install -g universal-skills
```

Or use with npx (no installation required):

```bash
npx universal-skills --help
```

### Manual Setup (for development)

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the server:

   ```bash
   npm run build
   ```

## CLI Commands

### Start MCP Server

Start the MCP server for use with AI agents:

```bash
universal-skills mcp
```

Or with npx:

```bash
npx universal-skills mcp
```

### Install Skills

Install a skill from a GitHub repository:

```bash
# Interactive mode (prompts for all options)
universal-skills install

# With repository URL
universal-skills install --repo https://github.com/user/repo

# With all options
universal-skills install --repo https://github.com/user/repo --repo-dir skills/my-skill --local-dir ~/.claude/skills
```

**Options:**
- `--repo <url>` - GitHub repository URL (will prompt if not provided)
- `--repo-dir <path>` - Subdirectory within the repository containing the skill (optional)
- `--local-dir <path>` - Local installation directory (default: `~/.claude/skills`, will prompt if not provided)

**How it works:**
1. Clones the repository (shallow clone for speed)
2. Reads `SKILL.md` and extracts the skill name from frontmatter
3. Prompts for skill name if not found in frontmatter
4. Copies the skill to your local skills directory
5. Confirms before overwriting existing skills

**Example:**

```bash
# Install a skill from a repository subdirectory
universal-skills install \
  --repo https://github.com/klaudworks/skills \
  --repo-dir skills/postgres \
  --local-dir ~/.claude/skills
```

## Configuring the MCP Server in AI Agents

After installing universal-skills, you need to configure your AI agent to use the MCP server.

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

Add the skills server to your OpenCode configuration by creating or editing an `opencode.json` file in your project root:

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

For more information about configuring MCP servers in OpenCode, see the [OpenCode MCP documentation](https://opencode.ai/docs/mcp-servers/).

### Manual Configuration

If you installed universal-skills globally with `npm install -g`, you can use:

```bash
universal-skills mcp
```

For development or if you cloned the repository, use the direct path:

```bash
node /absolute/path/to/universal-skills/dist/index.js
```

## How It Works

### Skill Directory Structure

Skills are automatically discovered from four directories in priority order (first match wins):

1. `yourproject/.agent/skills/` - Project-specific skills
2. `~/.agent/skills/` - Global skills #TODO change this to come after .claude/skills
3. `yourproject/.claude/skills/` - Project-specific skills
4. `~/.claude/skills/` - Global skills

Each skill is a directory containing a `SKILL.md` file:

```
.agent/skills/
├── git/
│   └── SKILL.md
└── postgres/
    └── SKILL.md
```

**Priority Resolution**: If the same skill name exists in multiple directories, the one from the higher priority directory wins. This allows you to override global skills with project-specific versions.

### Creating Your First Skill

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

**Required frontmatter fields:**

- `name`: Skill identifier (any characters allowed)
- `description`: Brief description

Skills missing either field will be skipped during scanning.

## Using Skills

Once installed, your AI agent will have access to the `skill` tool.

### Loading a Skill

The agent will automatically load a skill when your request matches the skill's description. The specific output is agent-dependent.

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

## Troubleshooting

### Skills not appearing

1. **Verify directory structure**: Each skill must be in its own directory with a `SKILL.md` file

   ```
   ~/.agent/skills/my-skill/SKILL.md  ✓ Correct
   ~/.agent/skills/my-skill.md        ✗ Incorrect
   ```

2. **Check frontmatter**: Both `name` and `description` are required

   ```yaml
   ---
   name: my-skill
   description: Brief description
   ---
   ```

3. **Wait for refresh**: Skills are scanned every 30 seconds. For immediate detection, restart your AI agent.

4. **Check logs**: The server logs to stderr. If using Claude Desktop, check the application logs.

### Permission errors

Ensure skill files and directories have read permissions:

```bash
chmod -R +r ~/.agent/skills/
```

### Server won't start

1. **Check Node.js version**: Must be 18.0.0 or higher

   ```bash
   node --version
   ```

2. **Rebuild the server**:

   ```bash
   npm run clean && npm run build
   ```

3. **Reinstall dependencies**:

   ```bash
   npm install
   ```

4. **Verify the path**: Ensure your AI agent config points to the correct `dist/index.js` path

## Performance

- **Lookup Time**: <100ms per skill invocation
- **Discovery Time**: <1 second for initial scan
- **Refresh Cycle**: 30 seconds (automatic)
- **Memory Usage**: <10MB for typical skill count (<100 skills)
- **Supported Skills**: Tested with up to 100 skills

## Contributing

For development and contribution guidelines, see [CONTRIBUTING.md](docs/CONTRIBUTING.md).

## License

MIT

## Version

3.0.0

## Breaking Changes in 3.0.0

- The `skills-mcp-server` command has been replaced with `universal-skills mcp`
- If you're upgrading from version 2.x, you'll need to update your AI agent configuration to use the new command

