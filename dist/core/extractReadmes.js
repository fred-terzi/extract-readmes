var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs-extra';
import path from 'path';
import findReadmes from './findReadmes.js';
function sanitizeName(name) {
    // Allow Unicode letters/numbers, replace spaces with '-', remove unsafe filename chars
    return name
        .replace(/\s+/g, '-') // spaces to dash
        .replace(/[^\p{L}\p{N}\-_\.]/gu, ''); // remove anything not unicode letter/number/-/_.
}
function makeUniqueName(base, used) {
    let name = base;
    let i = 1;
    while (used.has(name)) {
        name = `${base}-${i}`;
        i++;
    }
    used.add(name);
    return name;
}
export default function extractReadmes() {
    return __awaiter(this, arguments, void 0, function* ({ rootDir = process.cwd(), outDir, overwrite = false, patterns = ['README.md'], } = {}) {
        try {
            const absRoot = path.resolve(rootDir);
            const absOut = path.resolve(outDir || path.join(absRoot, 'READMEs'));
            yield fs.ensureDir(absOut);
            // Check writability
            try {
                yield fs.access(absOut, fs.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Output directory is not writable: ${absOut}`);
            }
            const files = yield findReadmes({ rootDir: absRoot, patterns });
            const usedNames = new Set();
            const writtenLibraries = new Set();
            for (const file of files) {
                // Determine folder name
                const rel = path.relative(absRoot, file);
                const folder = path.dirname(rel) === '.' ? 'root' : path.basename(path.dirname(rel));
                const baseName = sanitizeName(folder) + '.RM.md';
                if (writtenLibraries.has(baseName))
                    continue; // Only keep one per library
                writtenLibraries.add(baseName);
                const dest = path.join(absOut, baseName);
                if ((yield fs.pathExists(dest)) && !overwrite)
                    continue;
                try {
                    yield fs.copyFile(file, dest);
                }
                catch (err) {
                    throw new Error(`Failed to copy ${file} to ${dest}: ${err.message}`);
                }
            }
        }
        catch (err) {
            throw new Error(`extractReadmes failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    });
}
export { sanitizeName, makeUniqueName };
