// moved from tests/core/findReadmes.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import findReadmes from '../core/findReadmes';

const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root');
const readmePaths = [
  'README.md',
  'sub/README.md',
  'sub/ReadMe.md',
  'sub/hidden/.hiddenREADME.md',
  'sub2/README.md',
  'sub2/CONTRIBUTING.md',
  'sub3/README.txt', // should not match
];
const symlinkPath = path.join(tmpRoot, 'sub-symlink');

function setupTestTree() {
  fs.ensureDirSync(tmpRoot);
  fs.ensureDirSync(path.join(tmpRoot, 'sub/hidden'));
  fs.ensureDirSync(path.join(tmpRoot, 'sub2'));
  fs.ensureDirSync(path.join(tmpRoot, 'sub3'));
  fs.writeFileSync(path.join(tmpRoot, 'README.md'), '# Root README');
  fs.writeFileSync(path.join(tmpRoot, 'sub/README.md'), '# Sub README');
  fs.writeFileSync(path.join(tmpRoot, 'sub/ReadMe.md'), '# Sub ReadMe');
  fs.writeFileSync(path.join(tmpRoot, 'sub/hidden/.hiddenREADME.md'), '# Hidden README');
  fs.writeFileSync(path.join(tmpRoot, 'sub2/README.md'), '# Sub2 README');
  fs.writeFileSync(path.join(tmpRoot, 'sub2/CONTRIBUTING.md'), '# Contrib');
  fs.writeFileSync(path.join(tmpRoot, 'sub3/README.txt'), '# Not a README.md');
  // Symlink
  if (!fs.existsSync(symlinkPath)) {
    fs.symlinkSync(path.join(tmpRoot, 'sub'), symlinkPath);
  }
}

function cleanupTestTree() {
  fs.removeSync(tmpRoot);
}

describe('findReadmes', () => {
  beforeAll(setupTestTree);
  afterAll(cleanupTestTree);

  it('finds all README.md files recursively, case-insensitive', async () => {
    const files = await findReadmes({ rootDir: tmpRoot });
    expect(files.map((f: string) => path.relative(tmpRoot, f)).sort()).toEqual([
      'README.md',
      path.join('sub', 'README.md'),
      path.join('sub', 'ReadMe.md'),
      path.join('sub2', 'README.md'),
    ].sort());
  });

  it('respects .xrmignore patterns', async () => {
    const ignoreFile = path.join(tmpRoot, '.xrmignore');
    fs.writeFileSync(ignoreFile, 'sub\nsub2\n'); // Remove trailing slashes
    const files = await findReadmes({ rootDir: tmpRoot });
    expect(files.map((f: string) => path.relative(tmpRoot, f)).sort()).toEqual([
      'README.md',
    ]);
    fs.unlinkSync(ignoreFile);
  });

  it('returns empty list if no matches', async () => {
    const files = await findReadmes({ rootDir: tmpRoot, patterns: ['NOPE.md'] });
    expect(files).toEqual([]);
  });

  it('throws if rootDir does not exist', async () => {
    await expect(findReadmes({ rootDir: '/no/such/dir' })).rejects.toThrow();
  });

  it('supports custom patterns (e.g., CONTRIBUTING.md)', async () => {
    const files = await findReadmes({ rootDir: tmpRoot, patterns: ['CONTRIBUTING.md'] });
    expect(files.map((f: string) => path.relative(tmpRoot, f))).toContain(path.join('sub2', 'CONTRIBUTING.md'));
  });

  it('skips symlinks to avoid infinite loops', async () => {
    const files = await findReadmes({ rootDir: tmpRoot });
    // Should not include any files from sub-symlink
    expect(files.some((f: string) => f.includes('sub-symlink'))).toBe(false);
  });
});
