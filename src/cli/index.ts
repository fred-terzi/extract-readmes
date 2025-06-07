#!/usr/bin/env node
import { Command } from 'commander';
import extractReadmes from '../core/extractReadmes.js';
import findReadmes from '../core/findReadmes.js';
import fs from 'fs-extra';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

// CLI entry point and CLI-specific logic
export default async function cli() {
  const program = new Command();
  program
    .name('xrm')
    .description('Extract all README.md files into a READMEs folder, each named <folder>.RM.md')
    .argument('[rootDir]', 'Root directory to search', process.cwd())
    .option('--dry-run', 'List README.md files that would be extracted, but do not write files')
    .option('--create-ignore', 'Generate a .xrmignore file listing all README.md files that would be extracted')
    .option('--force', 'Overwrite .xrmignore if it exists (with --create-ignore)')
    .version(pkg.version, '-v, --version', 'Show version number')
    .helpOption('-h, --help', 'Show help');

  program.action(async (rootDir, opts) => {
    try {
      const absRoot = path.resolve(rootDir);
      if (opts.dryRun) {
        const files = await findReadmes({ rootDir: absRoot });
        if (files.length === 0) {
          console.log('No README.md files found.');
        } else {
          console.log('README.md files that would be extracted:');
          files.forEach(f => console.log(f));
        }
        console.log('(Dry run: no files written)');
        process.exit(0);
      } else if (opts.createIgnore) {
        const files = await findReadmes({ rootDir: absRoot });
        const ignorePath = path.join(absRoot, '.xrmignore');
        if (await fs.pathExists(ignorePath) && !opts.force) {
          console.error('.xrmignore already exists. Use --force to overwrite.');
          process.exit(1);
        }
        await fs.writeFile(ignorePath, files.map(f => path.relative(absRoot, f)).join('\n') + '\n');
        console.log('.xrmignore file created.');
        process.exit(0);
      } else {
        // Always check if READMEs/ exists and require --force to overwrite
        const readmesDir = path.join(absRoot, 'READMEs');
        if (await fs.pathExists(readmesDir) && !opts.force) {
          console.error('READMEs/ already exists. Use --force to overwrite.');
          process.exit(1);
        }
        if (await fs.pathExists(readmesDir)) {
          await fs.remove(readmesDir);
        }
        await extractReadmes({ rootDir: absRoot });
        console.log('README.md files extracted to READMEs/.');
        process.exit(0);
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

  program.parseAsync(process.argv);
}

// If run directly
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  cli();
}
