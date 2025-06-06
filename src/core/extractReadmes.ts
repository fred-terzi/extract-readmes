import fs from 'fs-extra';
import path from 'path';
import findReadmes from './findReadmes.js';

// Logic to extract/copy README files

interface ExtractReadmesOptions {
  rootDir?: string;
  outDir?: string;
  overwrite?: boolean;
  patterns?: string[];
}

function sanitizeName(name: string) {
  // Allow Unicode letters/numbers, replace spaces with '-', remove unsafe filename chars
  return name
    .replace(/\s+/g, '-') // spaces to dash
    .replace(/[^\p{L}\p{N}\-_\.]/gu, ''); // remove anything not unicode letter/number/-/_.
}

function makeUniqueName(base: string, used: Set<string>) {
  let name = base;
  let i = 1;
  while (used.has(name)) {
    name = `${base}-${i}`;
    i++;
  }
  used.add(name);
  return name;
}

export default async function extractReadmes({
  rootDir = process.cwd(),
  outDir,
  overwrite = false,
  patterns = ['README.md'],
}: ExtractReadmesOptions = {}): Promise<void> {
  try {
    const absRoot = path.resolve(rootDir);
    const absOut = path.resolve(outDir || path.join(absRoot, 'READMEs'));
    await fs.ensureDir(absOut);
    // Check writability
    try {
      await fs.access(absOut, fs.constants.W_OK);
    } catch {
      throw new Error(`Output directory is not writable: ${absOut}`);
    }
    const files = await findReadmes({ rootDir: absRoot, patterns });
    const usedNames = new Set<string>();
    for (const file of files) {
      // Determine folder name
      const rel = path.relative(absRoot, file);
      const folder = path.dirname(rel) === '.' ? 'root' : path.basename(path.dirname(rel));
      let baseName = sanitizeName(folder) + '.RM.md';
      baseName = makeUniqueName(baseName, usedNames);
      const dest = path.join(absOut, baseName);
      if (await fs.pathExists(dest) && !overwrite) continue;
      try {
        await fs.copyFile(file, dest);
      } catch (err) {
        throw new Error(`Failed to copy ${file} to ${dest}: ${(err as Error).message}`);
      }
    }
  } catch (err) {
    throw new Error(`extractReadmes failed: ${(err as Error).message}`);
  }
}
