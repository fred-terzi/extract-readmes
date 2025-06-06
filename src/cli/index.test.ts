import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';

const cliPath = path.join(process.cwd(), 'dist/cli/index.js');
const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-cli');
const readmesDir = path.join(tmpRoot, 'READMEs');
const xrmignorePath = path.join(tmpRoot, '.xrmignore');

function setupTestTree() {
  fs.removeSync(tmpRoot);
  fs.ensureDirSync(tmpRoot);
  fs.ensureDirSync(path.join(tmpRoot, 'foo'));
  fs.ensureDirSync(path.join(tmpRoot, 'bar'));
  fs.writeFileSync(path.join(tmpRoot, 'foo/README.md'), 'foo');
  fs.writeFileSync(path.join(tmpRoot, 'bar/README.md'), 'bar');
}

function cleanupTestTree() {
  fs.removeSync(tmpRoot);
}

describe('CLI', () => {
  beforeEach(setupTestTree);
  afterEach(cleanupTestTree);

  it('extracts README.md files to READMEs/ by default', async () => {
    await execa('node', [cliPath, tmpRoot]);
    expect(await fs.pathExists(readmesDir)).toBe(true);
    const files = await fs.readdir(readmesDir);
    expect(files.sort()).toEqual(['foo.RM.md', 'bar.RM.md'].sort());
  });

  it('supports --dry-run and outputs correct files', async () => {
    const { stdout } = await execa('node', [cliPath, tmpRoot, '--dry-run']);
    expect(stdout).toMatch(/foo\/README.md/);
    expect(stdout).toMatch(/bar\/README.md/);
    expect(await fs.pathExists(readmesDir)).toBe(false);
  });

  it('supports --create-ignore and generates .xrmignore', async () => {
    await execa('node', [cliPath, tmpRoot, '--create-ignore']);
    expect(await fs.pathExists(xrmignorePath)).toBe(true);
    const content = await fs.readFile(xrmignorePath, 'utf8');
    expect(content).toMatch(/foo\/README.md/);
    expect(content).toMatch(/bar\/README.md/);
  });

  it('shows help with --help', async () => {
    const { stdout } = await execa('node', [cliPath, '--help']);
    expect(stdout).toMatch(/Usage:/);
    expect(stdout).toMatch(/--dry-run/);
    expect(stdout).toMatch(/--create-ignore/);
    expect(stdout).toMatch(/--version/);
  });

  it('shows version with --version', async () => {
    const { stdout } = await execa('node', [cliPath, '--version']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it('exits with non-zero on error (invalid root)', async () => {
    const { exitCode } = await execa('node', [cliPath, '/no/such/dir'], { reject: false });
    expect(exitCode).not.toBe(0);
  });
});
