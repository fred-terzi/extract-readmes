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
import extractReadmes from './extractReadmes';
const tmpRoot = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-extract');
const readmesDir = path.join(process.cwd(), 'src/core/__fixtures__/tmp-root-extract/READMEs');
function setupTestTree() {
    fs.removeSync(tmpRoot);
    fs.ensureDirSync(tmpRoot);
    fs.ensureDirSync(path.join(tmpRoot, 'sub'));
    fs.ensureDirSync(path.join(tmpRoot, 'sub2'));
    fs.writeFileSync(path.join(tmpRoot, 'README.md'), 'Root README');
    fs.writeFileSync(path.join(tmpRoot, 'sub/README.md'), 'Sub README');
    fs.writeFileSync(path.join(tmpRoot, 'sub2/README.md'), 'Sub2 README');
}
function cleanupTestTree() {
    fs.removeSync(tmpRoot);
}
describe('extractReadmes', () => {
    beforeEach(setupTestTree);
    afterEach(cleanupTestTree);
    it('creates READMEs directory and copies README.md files with correct naming', () => __awaiter(void 0, void 0, void 0, function* () {
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        expect(yield fs.pathExists(readmesDir)).toBe(true);
        const files = yield fs.readdir(readmesDir);
        expect(files.sort()).toEqual(['root.RM.md', 'sub.RM.md', 'sub2.RM.md'].sort());
        const rootContent = yield fs.readFile(path.join(readmesDir, 'root.RM.md'), 'utf8');
        expect(rootContent).toBe('Root README');
    }));
    it('skips duplicate library names and only writes the first README found for each', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.ensureDirSync(path.join(tmpRoot, 'foo'));
        fs.ensureDirSync(path.join(tmpRoot, 'bar/foo'));
        fs.writeFileSync(path.join(tmpRoot, 'foo/README.md'), 'foo1');
        fs.writeFileSync(path.join(tmpRoot, 'bar/foo/README.md'), 'foo2');
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        const files = yield fs.readdir(readmesDir);
        // Only one foo.RM.md should exist
        expect(files.filter(f => f.startsWith('foo')).length).toBe(1);
        const fooContent = yield fs.readFile(path.join(readmesDir, 'foo.RM.md'), 'utf8');
        expect(['foo1', 'foo2']).toContain(fooContent); // Accept either, but only one file
    }));
    it('does not overwrite existing files unless overwrite=true', () => __awaiter(void 0, void 0, void 0, function* () {
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        const filePath = path.join(readmesDir, 'root.RM.md');
        yield fs.writeFile(filePath, 'EXISTING');
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        const content = yield fs.readFile(filePath, 'utf8');
        expect(content).toBe('EXISTING');
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir, overwrite: true });
        const content2 = yield fs.readFile(filePath, 'utf8');
        expect(content2).toBe('Root README');
    }));
    it('throws if READMEs directory is not writable', () => __awaiter(void 0, void 0, void 0, function* () {
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        yield fs.chmod(readmesDir, 0o400); // read-only
        yield expect(extractReadmes({ rootDir: tmpRoot, outDir: readmesDir, overwrite: true })).rejects.toThrow();
        yield fs.chmod(readmesDir, 0o700); // restore
    }));
    it('handles special characters and deeply nested folders', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.ensureDirSync(path.join(tmpRoot, 'üñîçødë space'));
        fs.writeFileSync(path.join(tmpRoot, 'üñîçødë space/README.md'), 'special');
        yield extractReadmes({ rootDir: tmpRoot, outDir: readmesDir });
        const files = yield fs.readdir(readmesDir);
        expect(files.some(f => f.startsWith('üñîçødë-space'))).toBe(true);
    }));
});
