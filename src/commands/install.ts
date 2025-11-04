/**
 * Install command - installs a skill from a GitHub repository
 */

import { simpleGit } from "simple-git";
import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import matter from "gray-matter";
import { DEFAULT_INSTALL_DIR, SKILL_FILENAME } from "../constants.js";

interface InstallOptions {
  repo?: string;
  repoDir?: string;
  localDir?: string;
}

/**
 * Expands tilde (~) in paths to the user's home directory
 */
function expandTilde(filePath: string): string {
  if (filePath.startsWith("~/")) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  if (filePath === "~") {
    return os.homedir();
  }
  return filePath;
}

/**
 * Validates that a URL looks like a valid Git repository URL
 */
function isValidRepoUrl(url: string): boolean {
  // Basic validation for GitHub/GitLab URLs
  const patterns = [
    /^https?:\/\/github\.com\/[\w-]+\/[\w-]+/,
    /^git@github\.com:[\w-]+\/[\w-]+/,
    /^https?:\/\/gitlab\.com\/[\w-]+\/[\w-]+/,
    /^git@gitlab\.com:[\w-]+\/[\w-]+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Checks if a directory exists
 */
async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recursively copies a directory, excluding specified patterns
 */
async function copyDirectory(
  src: string,
  dest: string,
  exclude: string[] = []
): Promise<void> {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip excluded files/directories
    if (exclude.includes(entry.name)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, exclude);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Reads SKILL.md and extracts the skill name from frontmatter
 */
async function extractSkillName(skillFilePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(skillFilePath, "utf-8");
    const parsed = matter(content);

    if (parsed.data && typeof parsed.data.name === "string") {
      return parsed.data.name;
    }

    return null;
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not parse ${SKILL_FILENAME}`));
    return null;
  }
}

/**
 * Main install command handler
 */
export async function installCommand(options: InstallOptions) {
  try {
    // Prompt for repository URL if not provided
    let repoUrl = options.repo;
    if (!repoUrl) {
      repoUrl = await input({
        message: "GitHub repository URL:",
        validate: (value) => {
          if (!value) {
            return "Repository URL is required";
          }
          if (!isValidRepoUrl(value)) {
            return "Please enter a valid GitHub or GitLab repository URL";
          }
          return true;
        },
      });
    } else if (!isValidRepoUrl(repoUrl)) {
      console.error(chalk.red("Error: Invalid repository URL"));
      process.exit(1);
    }

    // Prompt for repository subdirectory if not provided
    let repoDir = options.repoDir;
    if (!repoDir) {
      repoDir = await input({
        message: "Repository subdirectory (optional, press Enter to skip):",
        default: "",
      });
      // Convert empty string to undefined
      if (!repoDir || repoDir.trim() === "") {
        repoDir = undefined;
      }
    }

    // Prompt for local installation directory if not provided
    let localDir = options.localDir;
    if (!localDir) {
      localDir = await input({
        message: "Installation directory:",
        default: DEFAULT_INSTALL_DIR,
      });
    }

    // Expand tilde in local directory path
    localDir = expandTilde(localDir);

    // Create local directory if it doesn't exist
    await fs.mkdir(localDir, { recursive: true });

    // Create temporary directory for cloning
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "skill-install-"));

    try {
      // Clone the repository
      const spinner = ora("Cloning repository...").start();
      const git = simpleGit();

      try {
        await git.clone(repoUrl, tempDir, ["--depth", "1"]);
        spinner.succeed(chalk.green("Repository cloned"));
      } catch (error) {
        spinner.fail(chalk.red("Failed to clone repository"));
        throw new Error(
          `Git clone failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }

      // Determine source path (with optional subdirectory)
      let sourcePath = tempDir;
      if (repoDir) {
        sourcePath = path.join(tempDir, repoDir);

        if (!(await directoryExists(sourcePath))) {
          throw new Error(`Subdirectory '${repoDir}' not found in repository`);
        }
      }

      // Check if SKILL.md exists
      const skillFilePath = path.join(sourcePath, SKILL_FILENAME);
      if (!(await directoryExists(sourcePath)) && !(await fs.stat(skillFilePath).catch(() => null))) {
        throw new Error(`${SKILL_FILENAME} not found in source path`);
      }

      // Extract skill name from SKILL.md frontmatter
      let skillName = await extractSkillName(skillFilePath);

      // Prompt for skill name if not found in frontmatter
      if (!skillName) {
        console.log(chalk.yellow(`\nSkill name not found in ${SKILL_FILENAME} frontmatter`));
        skillName = await input({
          message: "Enter skill name:",
          validate: (value) => {
            if (!value) {
              return "Skill name is required";
            }
            if (!/^[\w-]+$/.test(value)) {
              return "Skill name can only contain letters, numbers, hyphens, and underscores";
            }
            return true;
          },
        });
      }

      // Determine target path
      const targetPath = path.join(localDir, skillName);

      // Check if skill already exists
      if (await directoryExists(targetPath)) {
        console.log(chalk.yellow(`\nSkill '${skillName}' already exists at: ${targetPath}`));
        const shouldOverwrite = await confirm({
          message: "This will DELETE and replace it. Continue?",
          default: false,
        });

        if (!shouldOverwrite) {
          console.log(chalk.gray("Installation cancelled"));
          return;
        }

        // Remove existing directory
        await fs.rm(targetPath, { recursive: true, force: true });
      }

      // Copy files to target (excluding .git)
      const copySpinner = ora("Installing skill...").start();
      await copyDirectory(sourcePath, targetPath, [".git", ".gitignore"]);
      copySpinner.succeed(chalk.green(`Skill '${skillName}' installed`));

      // Success message
      console.log("");
      console.log(chalk.green("━".repeat(80)));
      console.log(chalk.green.bold("✓ Installation complete!"));
      console.log("");
      console.log(chalk.bold("  Installation location:"));
      console.log(`    ${targetPath}`);
      console.log("");
      console.log(chalk.bold("  Next steps:"));
      console.log("    1. Restart Claude or your MCP client");
      console.log(`    2. Use the '${skillName}' skill`);
      console.log("");
      console.log(chalk.green("━".repeat(80)));
      console.log("");
    } finally {
      // Cleanup temporary directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
