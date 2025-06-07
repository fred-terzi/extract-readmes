import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

// Use the built JS CLI for integration tests
const CLI_PATH = path.resolve(__dirname, '../../dist/cli/index.js');
const TEST_ROOT = path.resolve(__dirname, '../core/__fixtures__/cli-test-root');
const READMES_DIR = path.join(TEST_ROOT, 'READMEs');
const XRMIGNORE_PATH = path.join(TEST_ROOT, '.xrmignore');

// Helper to run the CLI with node
async function runCli(args: string[], opts: any = {}) {
  return execa('node', [CLI_PATH, ...args], {
    cwd: TEST_ROOT,
    ...opts,
  });
}

describe('CLI (xrm)', () => {
  beforeEach(async () => {
    await fs.remove(TEST_ROOT);
    await fs.mkdirp(TEST_ROOT);
    // Create a sample README.md in a subfolder
    await fs.mkdirp(path.join(TEST_ROOT, 'foo'));
    await fs.writeFile(path.join(TEST_ROOT, 'foo', 'README.md'), '# Foo\n');
    // Clean up READMEs and .xrmignore if present
    await fs.remove(READMES_DIR);
    await fs.remove(XRMIGNORE_PATH);
  });

  afterEach(async () => {
    await fs.remove(TEST_ROOT);
  });

  it('shows help with --help', async () => {
    const { stdout, exitCode } = await runCli(['--help']);
    expect(stdout).toMatch(/Usage: xrm/);
    expect(exitCode).toBe(0);
  });

  it('shows version with --version', async () => {
    const { stdout, exitCode } = await runCli(['--version']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    expect(exitCode).toBe(0);
  });

  it('performs a dry run', async () => {
    const { stdout, exitCode } = await runCli(['--dry-run']);
    expect(stdout).toMatch(/README.md files that would be extracted/);
    expect(stdout).toMatch(/foo\/README.md/);
    expect(stdout).toMatch(/no files written/i);
    expect(exitCode).toBe(0);
  });

  it('creates .xrmignore with --create-ignore', async () => {
    const { stdout, exitCode } = await runCli(['--create-ignore']);
    expect(stdout).toMatch(/\.xrmignore file created/);
    expect(await fs.pathExists(XRMIGNORE_PATH)).toBe(true);
    const ignoreContent = await fs.readFile(XRMIGNORE_PATH, 'utf8');
    expect(ignoreContent).toMatch(/foo\/README.md/);
    expect(exitCode).toBe(0);
  });

  it('extracts README.md files by default', async () => {
    const { stdout, exitCode } = await runCli([]);
    expect(stdout).toMatch(/README.md files extracted to READMEs\//);
    expect(await fs.pathExists(READMES_DIR)).toBe(true);
    const files = await fs.readdir(READMES_DIR);
    expect(files.some(f => f.endsWith('.RM.md'))).toBe(true);
    expect(exitCode).toBe(0);
  });

  it('errors if .xrmignore exists and --force is not given', async () => {
    await fs.writeFile(XRMIGNORE_PATH, 'foo/README.md\n');
    const { stderr, exitCode } = await runCli(['--create-ignore'], { reject: false });
    expect(stderr).toMatch(/already exists/);
    expect(exitCode).toBe(1);
  });

  it('overwrites .xrmignore with --force', async () => {
    await fs.writeFile(XRMIGNORE_PATH, 'foo/README.md\n');
    const { stdout, exitCode } = await runCli(['--create-ignore', '--force']);
    expect(stdout).toMatch(/\.xrmignore file created/);
    expect(exitCode).toBe(0);
  });

  it('overwrites READMEs/ directory to reflect changes in .xrmignore or README.md files', async () => {
    // Initial extraction
    await runCli([]);
    expect(await fs.pathExists(READMES_DIR)).toBe(true);
    let files = await fs.readdir(READMES_DIR);
    expect(files.some(f => f === 'foo.RM.md')).toBe(true);

    // Add a new subfolder with README.md
    await fs.mkdirp(path.join(TEST_ROOT, 'bar'));
    await fs.writeFile(path.join(TEST_ROOT, 'bar', 'README.md'), '# Bar\n');
    // Remove the old foo/README.md
    await fs.remove(path.join(TEST_ROOT, 'foo', 'README.md'));
    // Ensure file is deleted before proceeding
    expect(await fs.pathExists(path.join(TEST_ROOT, 'foo', 'README.md'))).toBe(false);

    // Re-run extraction
    await runCli([]);
    files = await fs.readdir(READMES_DIR);
    // Should only contain bar.RM.md, not foo.RM.md
    expect(files.some(f => f === 'bar.RM.md')).toBe(true);
    expect(files.some(f => f === 'foo.RM.md')).toBe(false);

    // Now add .xrmignore to exclude bar/README.md
    await fs.writeFile(XRMIGNORE_PATH, 'bar/README.md\n');
    await runCli([]);
    files = await fs.readdir(READMES_DIR);
    // Should be empty since all README.md files are ignored
    expect(files.length).toBe(0);
  });
});
