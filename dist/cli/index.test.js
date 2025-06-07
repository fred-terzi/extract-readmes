var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import cli from './index';
import * as findReadmesModule from '../core/findReadmes';
import * as extractReadmesModule from '../core/extractReadmes';
import fs from 'fs-extra';
import path from 'path';
vi.mock('../core/findReadmes.js');
vi.mock('../core/extractReadmes.js');
vi.mock('fs-extra', () => ({
    default: {
        pathExists: vi.fn(),
        writeFile: vi.fn(),
    },
}));
vi.mock('../../package.json', () => ({ version: '1.2.3' }));
describe('cli', () => {
    const originalArgv = process.argv;
    const originalExit = process.exit;
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    let logMock;
    let errorMock;
    let exitMock;
    beforeEach(() => {
        logMock = vi.fn();
        errorMock = vi.fn();
        exitMock = vi.fn((code) => { throw new Error(`process.exit: ${code}`); });
        console.log = logMock;
        console.error = errorMock;
        process.exit = exitMock;
        process.argv = [...originalArgv.slice(0, 2)];
        vi.clearAllMocks();
    });
    afterEach(() => {
        process.argv = originalArgv;
        process.exit = originalExit;
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });
    it('should print version with --version', () => __awaiter(void 0, void 0, void 0, function* () {
        process.argv = [originalArgv[0], originalArgv[1], '--version'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(logMock).toHaveBeenCalledWith('1.2.3');
    }));
    it('should perform dry run and list files', () => __awaiter(void 0, void 0, void 0, function* () {
        findReadmesModule.default.mockResolvedValue(['a/README.md', 'b/README.md']);
        process.argv = [originalArgv[0], originalArgv[1], '--dry-run'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(logMock).toHaveBeenCalledWith('README.md files that would be extracted:');
        expect(logMock).toHaveBeenCalledWith('a/README.md');
        expect(logMock).toHaveBeenCalledWith('b/README.md');
        expect(logMock).toHaveBeenCalledWith('(Dry run: no files written)');
        expect(exitMock).toHaveBeenCalledWith(0);
    }));
    it('should print message if no README.md files found in dry run', () => __awaiter(void 0, void 0, void 0, function* () {
        findReadmesModule.default.mockResolvedValue([]);
        process.argv = [originalArgv[0], originalArgv[1], '--dry-run'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(logMock).toHaveBeenCalledWith('No README.md files found.');
        expect(logMock).toHaveBeenCalledWith('(Dry run: no files written)');
        expect(exitMock).toHaveBeenCalledWith(0);
    }));
    it('should create .xrmignore file if --create-ignore is used', () => __awaiter(void 0, void 0, void 0, function* () {
        findReadmesModule.default.mockResolvedValue(['/root/a/README.md', '/root/b/README.md']);
        fs.pathExists.mockResolvedValue(false);
        process.argv = [originalArgv[0], originalArgv[1], '--create-ignore', '/root'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(fs.writeFile).toHaveBeenCalledWith(path.join('/root', '.xrmignore'), 'a/README.md\nb/README.md\n');
        expect(logMock).toHaveBeenCalledWith('.xrmignore file created.');
        expect(exitMock).toHaveBeenCalledWith(0);
    }));
    it('should not overwrite .xrmignore unless --force is used', () => __awaiter(void 0, void 0, void 0, function* () {
        findReadmesModule.default.mockResolvedValue(['/root/a/README.md']);
        fs.pathExists.mockResolvedValue(true);
        process.argv = [originalArgv[0], originalArgv[1], '--create-ignore', '/root'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(errorMock).toHaveBeenCalledWith('.xrmignore already exists. Use --force to overwrite.');
        expect(exitMock).toHaveBeenCalledWith(1);
        expect(fs.writeFile).not.toHaveBeenCalled();
    }));
    it('should overwrite .xrmignore if --force is used', () => __awaiter(void 0, void 0, void 0, function* () {
        findReadmesModule.default.mockResolvedValue(['/root/a/README.md']);
        fs.pathExists.mockResolvedValue(true);
        process.argv = [originalArgv[0], originalArgv[1], '--create-ignore', '--force', '/root'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(fs.writeFile).toHaveBeenCalled();
        expect(logMock).toHaveBeenCalledWith('.xrmignore file created.');
        expect(exitMock).toHaveBeenCalledWith(0);
    }));
    it('should call extractReadmes and print success message', () => __awaiter(void 0, void 0, void 0, function* () {
        extractReadmesModule.default.mockResolvedValue(undefined);
        process.argv = [originalArgv[0], originalArgv[1], '/root'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(extractReadmesModule.default).toHaveBeenCalledWith({ rootDir: path.resolve('/root') });
        expect(logMock).toHaveBeenCalledWith('README.md files extracted to READMEs/.');
        expect(exitMock).toHaveBeenCalledWith(0);
    }));
    it('should handle errors and print error message', () => __awaiter(void 0, void 0, void 0, function* () {
        extractReadmesModule.default.mockRejectedValue(new Error('fail!'));
        process.argv = [originalArgv[0], originalArgv[1], '/root'];
        try {
            yield cli();
        }
        catch (_a) { }
        expect(errorMock).toHaveBeenCalledWith('Error:', 'fail!');
        expect(exitMock).toHaveBeenCalledWith(1);
    }));
});
// We recommend installing an extension to run vitest tests.
