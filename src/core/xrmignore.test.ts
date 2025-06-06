import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import xrmignore, { matchXrmignore } from './xrmignore';

const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-xrmignore');
const ignoreFile = path.join(tmpRoot, '.xrmignore');

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

describe('xrmignore', () => {
  beforeEach(setupTestTree);
  afterEach(cleanupTestTree);

  it('excludes files matching patterns in .xrmignore', async () => {
    await fs.writeFile(ignoreFile, 'foo\n');
    const matcher = await xrmignore(tmpRoot);
    expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
    expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
  });

  it('supports negation patterns (!)', async () => {
    await fs.writeFile(ignoreFile, 'foo\n!foo/README.md\n');
    const matcher = await xrmignore(tmpRoot);
    expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true);
    expect(matcher(path.join(tmpRoot, 'foo/other.md'))).toBe(false);
  });

  it('ignores comments and blank lines', async () => {
    await fs.writeFile(ignoreFile, '# comment\n\nfoo\n');
    const matcher = await xrmignore(tmpRoot);
    expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
    expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
  });

  it('throws on malformed .xrmignore', async () => {
    await fs.writeFile(ignoreFile, '[[');
    await expect(xrmignore(tmpRoot)).rejects.toThrow();
  });

  it('returns a matcher that includes all files if .xrmignore is missing', async () => {
    await fs.remove(ignoreFile);
    const matcher = await xrmignore(tmpRoot);
    expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true);
    expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
  });
});
