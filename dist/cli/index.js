#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command } from 'commander';
import extractReadmes from '../core/extractReadmes.js';
import findReadmes from '../core/findReadmes.js';
import fs from 'fs-extra';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
// CLI entry point and CLI-specific logic
export default function cli() {
    return __awaiter(this, void 0, void 0, function* () {
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
        program.action((rootDir, opts) => __awaiter(this, void 0, void 0, function* () {
            try {
                const absRoot = path.resolve(rootDir);
                if (opts.dryRun) {
                    const files = yield findReadmes({ rootDir: absRoot });
                    if (files.length === 0) {
                        console.log('No README.md files found.');
                    }
                    else {
                        console.log('README.md files that would be extracted:');
                        files.forEach(f => console.log(f));
                    }
                    console.log('(Dry run: no files written)');
                    process.exit(0);
                }
                else if (opts.createIgnore) {
                    const files = yield findReadmes({ rootDir: absRoot });
                    const ignorePath = path.join(absRoot, '.xrmignore');
                    if ((yield fs.pathExists(ignorePath)) && !opts.force) {
                        console.error('.xrmignore already exists. Use --force to overwrite.');
                        process.exit(1);
                    }
                    yield fs.writeFile(ignorePath, files.map(f => path.relative(absRoot, f)).join('\n') + '\n');
                    console.log('.xrmignore file created.');
                    process.exit(0);
                }
                else {
                    yield extractReadmes({ rootDir: absRoot });
                    console.log('README.md files extracted to READMEs/.');
                    process.exit(0);
                }
            }
            catch (err) {
                console.error('Error:', err.message);
                process.exit(1);
            }
        }));
        program.parseAsync(process.argv);
    });
}
// If run directly
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
    cli();
}
