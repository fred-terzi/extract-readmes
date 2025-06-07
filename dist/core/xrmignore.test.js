var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import xrmignore from './xrmignore';
const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-xrmignore');
const ignoreFile = path.join(tmpRoot, '.xrmignore');
function setupTestTree() {
    fs.removeSync(tmpRoot);
    fs.ensureDirSync(tmpRoot);
    fs.ensureDirSync(path.join(tmpRoot, 'foo'));
    fs.ensureDirSync(path.join(tmpRoot, 'bar'));
    fs.writeFileSync(path.join(tmpRoot, 'foo/README.md'), 'foo');
    fs.writeFileSync(path.join(tmpRoot, 'bar/README.md'), 'bar');
}
function cleanupTestTree() {
    fs.removeSync(tmpRoot);
}
describe('xrmignore', () => {
    beforeEach(setupTestTree);
    afterEach(cleanupTestTree);
    it('excludes files matching patterns in .xrmignore', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(ignoreFile, 'foo\n');
        const matcher = yield xrmignore(tmpRoot);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
    it('supports negation patterns (!)', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(ignoreFile, 'foo\n!foo/README.md\n');
        const matcher = yield xrmignore(tmpRoot);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true);
        expect(matcher(path.join(tmpRoot, 'foo/other.md'))).toBe(false);
    }));
    it('ignores comments and blank lines', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(ignoreFile, '# comment\n\nfoo\n');
        const matcher = yield xrmignore(tmpRoot);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
    it('throws on malformed .xrmignore', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(ignoreFile, '[[');
        yield expect(xrmignore(tmpRoot)).rejects.toThrow();
    }));
    it('returns a matcher that includes all files if .xrmignore is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(ignoreFile);
        const matcher = yield xrmignore(tmpRoot);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
    it('expands negated bare directory patterns (covers [line, !pattern/**])', () => __awaiter(void 0, void 0, void 0, function* () {
        // This covers the ? [line, '!' + pattern + '/**'] branch in expandPatterns
        const { matchXrmignore } = yield import('./xrmignore');
        const matcher = yield matchXrmignore(tmpRoot, ['!foo']);
        // Should include everything (negation means include foo and all under foo)
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
    it('expands non-negated bare directory patterns (covers [line, pattern/**])', () => __awaiter(void 0, void 0, void 0, function* () {
        // This covers the [line, pattern + '/**'] branch in expandPatterns
        const { matchXrmignore } = yield import('./xrmignore');
        const matcher = yield matchXrmignore(tmpRoot, ['foo']);
        // Should exclude foo and all under foo
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
    it('does not expand patterns with / or * (covers else branch in expandPatterns)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Patterns with / or * should not be expanded, only match as written
        const { matchXrmignore } = yield import('./xrmignore');
        // Pattern with slash: only matches the exact path
        let matcher = yield matchXrmignore(tmpRoot, ['foo/bar']);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true); // not matched
        // If we had a file exactly named foo/bar, it would be excluded
        fs.writeFileSync(path.join(tmpRoot, 'foo/bar'), 'baz');
        expect(matcher(path.join(tmpRoot, 'foo/bar'))).toBe(false); // matched
        fs.unlinkSync(path.join(tmpRoot, 'foo/bar'));
        // Pattern with *: matches foo/README.md, not bar/README.md
        matcher = yield matchXrmignore(tmpRoot, ['foo/*']);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false); // matched
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true); // not matched
    }));
    it('does not expand patterns with a dot (covers else branch in expandPatterns)', () => __awaiter(void 0, void 0, void 0, function* () {
        // Patterns with a dot should not be expanded
        const { matchXrmignore } = yield import('./xrmignore');
        // Non-negated with dot
        let matcher = yield matchXrmignore(tmpRoot, ['foo.txt']);
        // File does not exist, but should not match foo/README.md
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true); // not matched
        // If we had a file exactly named foo.txt, it would be excluded
        fs.writeFileSync(path.join(tmpRoot, 'foo.txt'), 'baz');
        expect(matcher(path.join(tmpRoot, 'foo.txt'))).toBe(false); // matched
        fs.unlinkSync(path.join(tmpRoot, 'foo.txt'));
        // Negated with dot
        matcher = yield matchXrmignore(tmpRoot, ['!foo.txt']);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(true); // not matched
        fs.writeFileSync(path.join(tmpRoot, 'foo.txt'), 'baz');
        expect(matcher(path.join(tmpRoot, 'foo.txt'))).toBe(true); // included
        fs.unlinkSync(path.join(tmpRoot, 'foo.txt'));
    }));
    it('ignores empty lines and comments in expandPatterns (covers !line and # branch)', () => __awaiter(void 0, void 0, void 0, function* () {
        const { matchXrmignore } = yield import('./xrmignore');
        // Should ignore both empty and comment lines, only 'foo' is used
        const matcher = yield matchXrmignore(tmpRoot, ['', '#comment', 'foo']);
        expect(matcher(path.join(tmpRoot, 'foo/README.md'))).toBe(false);
        expect(matcher(path.join(tmpRoot, 'bar/README.md'))).toBe(true);
    }));
});
