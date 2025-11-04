#!/usr/bin/env node

/**
 * CLI entry point for universal-skills
 */

import { Command } from "commander";
import chalk from "chalk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mcpCommand } from "./commands/mcp.js";
import { installCommand } from "./commands/install.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

const program = new Command();

program
  .name("universal-skills")
  .description("MCP server and CLI tool for discovering and installing skills")
  .version(packageJson.version);

// Register commands
program
  .command("mcp")
  .description("Start the MCP server")
  .action(mcpCommand);

program
  .command("install")
  .description("Install a skill from a GitHub repository")
  .option("--repo <url>", "GitHub repository URL")
  .option("--repo-dir <path>", "Subdirectory within the repository (optional)")
  .option("--local-dir <path>", "Local installation directory (default: ~/.claude/skills)")
  .action(installCommand);

// Global error handler
program.exitOverride((err) => {
  if (err.code === "commander.help" || err.code === "commander.version") {
    process.exit(0);
  }
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
