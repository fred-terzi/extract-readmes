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
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
// Use the built JS CLI for integration tests
const CLI_PATH = path.resolve(__dirname, '../../dist/cli/index.js');
const TEST_ROOT = path.resolve(__dirname, '../core/__fixtures__/cli-test-root');
const READMES_DIR = path.join(TEST_ROOT, 'READMEs');
const XRMIGNORE_PATH = path.join(TEST_ROOT, '.xrmignore');
// Helper to run the CLI with node
function runCli(args_1) {
    return __awaiter(this, arguments, void 0, function* (args, opts = {}) {
        return execa('node', [CLI_PATH, ...args], Object.assign({ cwd: TEST_ROOT }, opts));
    });
}
describe('CLI (xrm)', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(TEST_ROOT);
        yield fs.mkdirp(TEST_ROOT);
        // Create a sample README.md in a subfolder
        yield fs.mkdirp(path.join(TEST_ROOT, 'foo'));
        yield fs.writeFile(path.join(TEST_ROOT, 'foo', 'README.md'), '# Foo\n');
        // Clean up READMEs and .xrmignore if present
        yield fs.remove(READMES_DIR);
        yield fs.remove(XRMIGNORE_PATH);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(TEST_ROOT);
    }));
    it('shows help with --help', () => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout, exitCode } = yield runCli(['--help']);
        expect(stdout).toMatch(/Usage: xrm/);
        expect(exitCode).toBe(0);
    }));
    it('shows version with --version', () => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout, exitCode } = yield runCli(['--version']);
        expect(stdout).toMatch(/\d+\.\d+\.\d+/);
        expect(exitCode).toBe(0);
    }));
    it('performs a dry run', () => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout, exitCode } = yield runCli(['--dry-run']);
        expect(stdout).toMatch(/README.md files that would be extracted/);
        expect(stdout).toMatch(/foo\/README.md/);
        expect(stdout).toMatch(/no files written/i);
        expect(exitCode).toBe(0);
    }));
    it('creates .xrmignore with --create-ignore', () => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout, exitCode } = yield runCli(['--create-ignore']);
        expect(stdout).toMatch(/\.xrmignore file created/);
        expect(yield fs.pathExists(XRMIGNORE_PATH)).toBe(true);
        const ignoreContent = yield fs.readFile(XRMIGNORE_PATH, 'utf8');
        expect(ignoreContent).toMatch(/foo\/README.md/);
        expect(exitCode).toBe(0);
    }));
    it('extracts README.md files by default', () => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout, exitCode } = yield runCli([]);
        expect(stdout).toMatch(/README.md files extracted to READMEs\//);
        expect(yield fs.pathExists(READMES_DIR)).toBe(true);
        const files = yield fs.readdir(READMES_DIR);
        expect(files.some(f => f.endsWith('.RM.md'))).toBe(true);
        expect(exitCode).toBe(0);
    }));
    it('errors if .xrmignore exists and --force is not given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(XRMIGNORE_PATH, 'foo/README.md\n');
        const { stderr, exitCode } = yield runCli(['--create-ignore'], { reject: false });
        expect(stderr).toMatch(/already exists/);
        expect(exitCode).toBe(1);
    }));
    it('overwrites .xrmignore with --force', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fs.writeFile(XRMIGNORE_PATH, 'foo/README.md\n');
        const { stdout, exitCode } = yield runCli(['--create-ignore', '--force']);
        expect(stdout).toMatch(/\.xrmignore file created/);
        expect(exitCode).toBe(0);
    }));
});
