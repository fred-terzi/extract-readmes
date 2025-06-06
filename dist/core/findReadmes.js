var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export default function findReadmes() {
    return __awaiter(this, arguments, void 0, function* ({ rootDir = process.cwd(), patterns = ['README.md'], } = {}) {
        try {
            // Validate rootDir
            const absRoot = path.resolve(rootDir);
            if (!(yield fs.pathExists(absRoot))) {
                throw new Error(`Root directory does not exist: ${absRoot}`);
            }
            if (!(yield fs.stat(absRoot)).isDirectory()) {
                throw new Error(`Root path is not a directory: ${absRoot}`);
            }
            // Read .xrmignore if present
            const xrmignorePath = path.join(absRoot, '.xrmignore');
            let ignorePatterns = [];
            if (yield fs.pathExists(xrmignorePath)) {
                const content = yield fs.readFile(xrmignorePath, 'utf8');
                ignorePatterns = content
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line && !line.startsWith('#'));
            }
            // Compose glob patterns (case-insensitive)
            const ciPatterns = patterns.flatMap((p) => [
                `**/${p}`,
                `**/${p.toLowerCase()}`,
                `**/${p.toUpperCase()}`,
                `**/${capitalize(p)}`,
            ]);
            // Use fast-glob
            const files = yield fg(ciPatterns, {
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
        }
        catch (err) {
            // Error handling as per requirements
            throw new Error(`findReadmes failed: ${err.message}`);
        }
    });
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
