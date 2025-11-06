/**
 * Shared constants for the MCP Skills Server
 */

import { SkillSource } from "./types.js";

/**
 * Skill directory search paths in priority order (first match wins)
 */
export const SKILL_DIRS: Array<{ path: string; source: SkillSource; location: "project" | "global" }> = [
  { path: "./.agent/skills", source: SkillSource.PROJECT_UNIVERSAL, location: "project" },
  { path: "./.claude/skills", source: SkillSource.PROJECT_CLAUDE, location: "project" },
  { path: "~/.agent/skills", source: SkillSource.GLOBAL_UNIVERSAL, location: "global" },
  { path: "~/.claude/skills", source: SkillSource.GLOBAL_CLAUDE, location: "global" },
];

/**
 * Refresh interval for skill scanning (30 seconds)
 */
export const REFRESH_INTERVAL_MS = 30000;

/**
 * Server name and version
 */
export const SERVER_NAME = "skills-mcp-server";
export const SERVER_VERSION = "1.0.0";

/**
 * Skill file name
 */
export const SKILL_FILENAME = "SKILL.md";

/**
 * Default installation directory for skills
 */
export const DEFAULT_INSTALL_DIR = "~/.claude/skills";
