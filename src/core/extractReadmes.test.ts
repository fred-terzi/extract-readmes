import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import extractReadmes, { sanitizeName, makeUniqueName } from './extractReadmes';
import findReadmes from './findReadmes';

vi.mock('fs-extra');
vi.mock('./findReadmes');

const mockFs = fs as unknown as Record<string, any>;
const mockFindReadmes = findReadmes as any;

describe('extractReadmes', () => {
  const rootDir = '/mock/root';
  const outDir = '/mock/output';
  const readmeFiles = [
    '/mock/root/README.md',
    '/mock/root/sub/README.md',
    '/mock/root/sub2/README.md',
    '/mock/root/sub/other.txt',
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFs.ensureDir = vi.fn().mockResolvedValue(undefined);
    mockFs.access = vi.fn().mockResolvedValue(undefined);
    mockFs.pathExists = vi.fn().mockResolvedValue(false);
    mockFs.copyFile = vi.fn().mockResolvedValue(undefined);
    mockFindReadmes.mockResolvedValue(readmeFiles);
  });

  it('copies README files to output dir with default options', async () => {
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.ensureDir).toHaveBeenCalledWith(path.resolve(outDir));
    expect(mockFs.copyFile).toHaveBeenCalledTimes(3); // Only README.md files
    expect(mockFs.copyFile).toHaveBeenCalledWith(
      '/mock/root/README.md',
      expect.stringContaining('root.RM.md')
    );
    expect(mockFs.copyFile).toHaveBeenCalledWith(
      '/mock/root/sub/README.md',
      expect.stringContaining('sub.RM.md')
    );
    expect(mockFs.copyFile).toHaveBeenCalledWith(
      '/mock/root/sub2/README.md',
      expect.stringContaining('sub2.RM.md')
    );
  });

  it('skips copying if file exists and overwrite is false', async () => {
    mockFs.pathExists = vi.fn().mockResolvedValue(true);
    await extractReadmes({ rootDir, outDir, overwrite: false });
    expect(mockFs.copyFile).not.toHaveBeenCalled();
  });

  it('overwrites file if overwrite is true', async () => {
    mockFs.pathExists = vi.fn().mockResolvedValue(true);
    await extractReadmes({ rootDir, outDir, overwrite: true });
    expect(mockFs.copyFile).toHaveBeenCalled();
  });

  it('creates output dir if not exists', async () => {
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.ensureDir).toHaveBeenCalledWith(path.resolve(outDir));
  });

  it('throws if output dir is not writable', async () => {
    mockFs.access = vi.fn().mockRejectedValue(new Error('not writable'));
    await expect(extractReadmes({ rootDir, outDir })).rejects.toThrow('Output directory is not writable');
  });

  it('throws if copyFile fails', async () => {
    mockFs.copyFile = vi.fn().mockRejectedValue(new Error('copy failed'));
    await expect(extractReadmes({ rootDir, outDir, overwrite: true })).rejects.toThrow('Failed to copy');
  });

  it('throws if findReadmes throws', async () => {
    mockFindReadmes.mockRejectedValue(new Error('find failed'));
    await expect(extractReadmes({ rootDir, outDir })).rejects.toThrow('extractReadmes failed: find failed');
  });

  it('uses default options if none provided', async () => {
    await extractReadmes();
    expect(mockFs.ensureDir).toHaveBeenCalled();
    expect(mockFindReadmes).toHaveBeenCalled();
  });

  it('only keeps one README per library (writtenLibraries logic)', async () => {
    // Add a duplicate README in sub
    mockFindReadmes.mockResolvedValue([
      '/mock/root/sub/README.md',
      '/mock/root/sub/README2.md',
    ]);
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.copyFile).toHaveBeenCalledTimes(1);
  });

  it('sanitizes folder names for output', async () => {
    mockFindReadmes.mockResolvedValue([
      '/mock/root/some weird@folder/README.md',
    ]);
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.copyFile.mock.calls[0][1]).toMatch(/some-weirdfolder\.RM\.md$/);
  });

  it('handles files in root directory as root.RM.md', async () => {
    mockFindReadmes.mockResolvedValue(['/mock/root/README.md']);
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.copyFile.mock.calls[0][1]).toMatch(/root\.RM\.md$/);
  });

  it('uses default outDir if not provided', async () => {
    await extractReadmes({ rootDir });
    expect(mockFs.ensureDir).toHaveBeenCalledWith(
      path.resolve(path.join(rootDir, 'READMEs'))
    );
  });

  it('handles empty files array from findReadmes', async () => {
    mockFindReadmes.mockResolvedValue([]);
    await extractReadmes({ rootDir, outDir });
    expect(mockFs.copyFile).not.toHaveBeenCalled();
  });

  it('handles folder names with only invalid chars', async () => {
    mockFindReadmes.mockResolvedValue([
      '/mock/root/!!!/README.md',
    ]);
    await extractReadmes({ rootDir, outDir });
    // Should fallback to .RM.md
    const destPath = mockFs.copyFile.mock.calls[0][1];
    expect(path.basename(destPath)).toBe('.RM.md');
  });

  describe('sanitizeName', () => {
    it('replaces spaces and removes unsafe chars', () => {
      expect(sanitizeName('foo bar')).toBe('foo-bar');
      expect(sanitizeName('foo/bar')).toBe('foobar');
      expect(sanitizeName('fóó bär')).toBe('fóó-bär');
      expect(sanitizeName('foo@bar!')).toBe('foobar');
      expect(sanitizeName('foo_bar.baz')).toBe('foo_bar.baz');
    });
  });

  describe('makeUniqueName', () => {
    it('returns unique names by appending -1, -2, etc.', () => {
      const used = new Set(['foo', 'foo-1']);
      expect(makeUniqueName('foo', used)).toBe('foo-2');
      expect(makeUniqueName('bar', used)).toBe('bar');
      expect(used.has('foo-2')).toBe(true);
      expect(used.has('bar')).toBe(true);
    });
  });

  describe('extractReadmes error catch', () => {
    it('throws with non-Error value in catch', async () => {
      mockFindReadmes.mockImplementation(() => { throw 'string error'; });
      await expect(extractReadmes({ rootDir, outDir })).rejects.toThrow('extractReadmes failed: string error');
    });
  });
});