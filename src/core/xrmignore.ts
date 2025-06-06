import fs from 'fs-extra';
import path from 'path';
import { Minimatch } from 'minimatch';

// .xrmignore parsing and matching logic

export type XrmignoreMatcher = (filePath: string) => boolean;

function expandPatterns(patterns: string[]): string[] {
  // For .gitignore semantics: if a pattern is a bare directory, also match everything under it
  return patterns.flatMap((line) => {
    if (!line || line.startsWith('#')) return [];
    const negated = line.startsWith('!');
    const pattern = negated ? line.slice(1) : line;
    // If pattern is a directory (no glob, no slash at end, no dot), add pattern/**
    if (!pattern.includes('/') && !pattern.includes('*')) {
      return negated
        ? [line, '!' + pattern + '/**']
        : [line, pattern + '/**'];
    }
    return [line];
  });
}

export async function matchXrmignore(rootDir: string, patterns: string[]): Promise<XrmignoreMatcher> {
  const expanded = expandPatterns(patterns);
  const matchers: { matcher: Minimatch; negated: boolean }[] = expanded
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const negated = line.startsWith('!');
      const pattern = negated ? line.slice(1) : line;
      return { matcher: new Minimatch(pattern, { dot: true, matchBase: false }), negated };
    });
  return (filePath: string) => {
    const rel = path.relative(rootDir, filePath);
    let included = true;
    for (const { matcher, negated } of matchers) {
      if (matcher.match(rel)) {
        included = negated ? true : false;
      }
    }
    return included;
  };
}

export default async function xrmignore(rootDir: string): Promise<XrmignoreMatcher> {
  try {
    const ignorePath = path.join(rootDir, '.xrmignore');
    if (!(await fs.pathExists(ignorePath))) {
      // No ignore file: include all
      return () => true;
    }
    const content = await fs.readFile(ignorePath, 'utf8');
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));
    // Validate patterns (very basic: throw if any line is obviously malformed)
    if (lines.some((l) => l.startsWith('['))) throw new Error('Malformed .xrmignore');
    return matchXrmignore(rootDir, lines);
  } catch (err) {
    throw new Error(`xrmignore failed: ${(err as Error).message}`);
  }
}
