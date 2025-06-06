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
import { Minimatch } from 'minimatch';
function expandPatterns(patterns) {
    // For .gitignore semantics: if a pattern is a bare directory, also match everything under it
    return patterns.flatMap((line) => {
        if (!line || line.startsWith('#'))
            return [];
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
export function matchXrmignore(rootDir, patterns) {
    return __awaiter(this, void 0, void 0, function* () {
        const expanded = expandPatterns(patterns);
        const matchers = expanded
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => {
            const negated = line.startsWith('!');
            const pattern = negated ? line.slice(1) : line;
            return { matcher: new Minimatch(pattern, { dot: true, matchBase: false }), negated };
        });
        return (filePath) => {
            const rel = path.relative(rootDir, filePath);
            let included = true;
            for (const { matcher, negated } of matchers) {
                if (matcher.match(rel)) {
                    included = negated ? true : false;
                }
            }
            return included;
        };
    });
}
export default function xrmignore(rootDir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ignorePath = path.join(rootDir, '.xrmignore');
            if (!(yield fs.pathExists(ignorePath))) {
                // No ignore file: include all
                return () => true;
            }
            const content = yield fs.readFile(ignorePath, 'utf8');
            const lines = content
                .split(/\r?\n/)
                .map((l) => l.trim())
                .filter((l) => l.length > 0 && !l.startsWith('#'));
            // Validate patterns (very basic: throw if any line is obviously malformed)
            if (lines.some((l) => l.startsWith('[')))
                throw new Error('Malformed .xrmignore');
            return matchXrmignore(rootDir, lines);
        }
        catch (err) {
            throw new Error(`xrmignore failed: ${err.message}`);
        }
    });
}
