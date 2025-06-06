import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import extractReadmes from './extractReadmes';
import findReadmes from './findReadmes';

const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-extract');
const readmesDir = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-extract/READMEs');

function setupTestTree() {
  fs.removeSync(tmpRoot);
  fs.ensureDirSync(tmpRoot);
  fs.ensureDirSync(path.join(tmpRoot, 'sub'));
  fs.ensureDirSync(path.join(tmpRoot, 'sub2'));
  fs.writeFileSync(path.join(tmpRoot, 'README.md'), 'Root README');
  fs.writeFileSync(path.join(tmpRoot, 'sub/README.md'), 'Sub README');
  fs.writeFileSync(path.join(tmpRoot, 'sub2/README.md'), 'Sub2 README');
}

function cleanupTestTree() {
  fs.removeSync(tmpRoot);
}

describe('extractReadmes', () => {
  beforeEach(setupTestTree);
  afterEach(cleanupTestTree);

  it('creates READMEs directory and copies README.md files with correct naming', async () => {
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    expect(await fs.pathExists(readmesDir)).toBe(true);
    const files = await fs.readdir(readmesDir);
    expect(files.sort()).toEqual(['root.RM.md', 'sub.RM.md', 'sub2.RM.md'].sort());
    const rootContent = await fs.readFile(path.join(readmesDir, 'root.RM.md'), 'utf8');
    expect(rootContent).toBe('Root README');
  });

  it('skips duplicate library names and only writes the first README found for each', async () => {
    fs.ensureDirSync(path.join(tmpRoot, 'foo'));
    fs.ensureDirSync(path.join(tmpRoot, 'bar/foo'));
    fs.writeFileSync(path.join(tmpRoot, 'foo/README.md'), 'foo1');
    fs.writeFileSync(path.join(tmpRoot, 'bar/foo/README.md'), 'foo2');
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    const files = await fs.readdir(readmesDir);
    // Only one foo.RM.md should exist
    expect(files.filter(f => f.startsWith('foo')).length).toBe(1);
    const fooContent = await fs.readFile(path.join(readmesDir, 'foo.RM.md'), 'utf8');
    expect(['foo1', 'foo2']).toContain(fooContent); // Accept either, but only one file
  });

  it('does not overwrite existing files unless overwrite=true', async () => {
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    const filePath = path.join(readmesDir, 'root.RM.md');
    await fs.writeFile(filePath, 'EXISTING');
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    const content = await fs.readFile(filePath, 'utf8');
    expect(content).toBe('EXISTING');
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir, overwrite: true });
    const content2 = await fs.readFile(filePath, 'utf8');
    expect(content2).toBe('Root README');
  });

  it('throws if READMEs directory is not writable', async () => {
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    await fs.chmod(readmesDir, 0o400); // read-only
    await expect(extractReadmes({ rootDir: tmpRoot, outDir: readmesDir, overwrite: true })).rejects.toThrow();
    await fs.chmod(readmesDir, 0o700); // restore
  });

  it('handles special characters and deeply nested folders', async () => {
    fs.ensureDirSync(path.join(tmpRoot, 'üñîçødë space'));
    fs.writeFileSync(path.join(tmpRoot, 'üñîçødë space/README.md'), 'special');
    await extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
    const files = await fs.readdir(readmesDir);
    expect(files.some(f => f.startsWith('üñîçødë-space'))).toBe(true);
  });
});
