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
});
