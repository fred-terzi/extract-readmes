import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';

/**
 * Recursively find all README-like files in a codebase, respecting .xrmignore patterns.
 * @param rootDir The root directory to search from.
 * @param patterns Array of glob patterns to match (default: ['README.md']).
 * @returns Array of absolute file paths to found files.
 * @throws If rootDir does not exist or is not accessible.
 */
// Main function to find all README.md files

export default async function findReadmes({
  rootDir = process.cwd(),
  patterns = ['README.md'],
}: {
  rootDir?: string;
  patterns?: string[];
} = {}): Promise<string[]> {
  try {
    // Validate rootDir
    const absRoot = path.resolve(rootDir);
    if (!(await fs.pathExists(absRoot))) {
      throw new Error(`Root directory does not exist: ${absRoot}`);
    }
    if (!(await fs.stat(absRoot)).isDirectory()) {
      throw new Error(`Root path is not a directory: ${absRoot}`);
    }

    // Read .xrmignore if present
    const xrmignorePath = path.join(absRoot, '.xrmignore');
    let ignorePatterns: string[] = [];
    if (await fs.pathExists(xrmignorePath)) {
      const content = await fs.readFile(xrmignorePath, 'utf8');
      ignorePatterns = content
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line && !line.startsWith('#'));
    }

    // Compose glob patterns (case-insensitive)
    const ciPatterns = patterns.flatMap((p) => [
      `**/${p}`,
      `**/${p.toLowerCase()}`,
      `**/${p.toUpperCase()}`,
      `**/${capitalize(p)}`,
    ]);

    // Use fast-glob
    const files = await fg(ciPatterns, {
      cwd: absRoot,
      absolute: true,
      onlyFiles: true,
      followSymbolicLinks: false,
      ignore: ignorePatterns,
      dot: true,
      unique: true,
      caseSensitiveMatch: false,
    });
    return files;
  } catch (err) {
    // Error handling as per requirements
    throw new Error(
      `findReadmes failed: ${(err as Error).message}`
    );
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
