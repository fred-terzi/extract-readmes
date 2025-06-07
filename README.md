# extract-readmes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/extract-readmes.svg)](https://www.npmjs.com/package/extract-readmes)

**extract-readmes** (abbreviated as `xrm`) is a tool for extracting all `README.md` files from a codebase into a centralized `READMEs` directory. Each extracted README is renamed based on its source folder, with `.RM.md` appended. The tool supports ignoring specific folders or files using a `.xrmignore` file with `.gitignore`-style patterns. All core and CLI features are fully tested and designed for reliability and scalability in large projects.

## Installation

You can install **extract-readmes** globally or as a dev dependency using npm:

```sh
npm install -g extract-readmes
# or as a dev dependency
npm install --save-dev extract-readmes
```

## Quick Start

To extract all `README.md` files from your project into a centralized `READMEs/` directory, run:

```sh
xrm
```

**Common options:**

- Preview what would be extracted (no changes made):
  ```sh
  xrm --dry-run
  ```
- Generate a `.xrmignore` file listing all README files. Then you can edit this file to choose which files to include or exclude. 

  ```sh
  xrm --create-ignore
  ```
> **Note from Fred:** I found it is easier to create the full list then edit it down rather than trying to write out the files you want to ignore. Especially for node_modules!

By default, `xrm` runs in the current directory. You can specify a different root directory as an argument:

```sh
xrm /path/to/your/project
```

## Contributing

Contributions are welcome!

Please start by opening an issue to request a feature or report a bug. For further details on contributing, please see our [Contributing Guide](CONTRIBUTING.md).

[![Open Issues](https://img.shields.io/github/issues/fredrikaverpil/extract-readmes.svg)](https://github.com/fred-terzi/extract-readmes/issues)
[![Contributing Guide](https://img.shields.io/badge/Contributing-Guide-blue.svg)](CONTRIBUTING.md)

## extract-readmes core logic

The core logic of **extract-readmes** is implemented as an async API, designed for use both programmatically and by the CLI. It provides robust, fully tested functions to:

- Recursively discover all `README.md` (and similar) files in a codebase, with support for custom patterns and case-insensitive matching.
- Exclude files and directories based on `.xrmignore` patterns, using `.gitignore`-style syntax.
- Handle symbolic links safely, avoid infinite loops, and ensure performance on large codebases.
- Return absolute or root-relative paths for all discovered files.
- Gracefully handle errors such as missing directories, permission issues, and malformed ignore files.
- Guarantee 100% test coverage for all logic and edge cases.

This API is the foundation for the CLI and can be integrated into other tools or workflows as needed.

### Recursive README and Documentation File Discovery

The core API provides a function to recursively search a codebase for all `README.md` files, supporting case-insensitive matching and custom patterns (e.g., `CONTRIBUTING.md`, `CHANGELOG.md`). The search respects `.xrmignore` patterns to exclude files or directories, and safely handles symbolic links to avoid infinite loops or duplicates. Results are returned as absolute or root-relative paths. The function is robust, scalable to large codebases, and fully tested for edge cases such as hidden directories, symlinks, and custom ignore patterns.

### READMEs/

All extracted `README.md` files are copied into a central `READMEs/` directory at the project root. Each file is renamed using the name of its source folder, with `.RM.md` appended (e.g., extracting from `./ansi-colors/README.md` creates `READMEs/ansi-colors.RM.md`). The tool ensures unique filenames even for folders with the same name at different paths, and handles special characters, deep nesting, and large numbers of files. Existing files are not overwritten unless explicitly allowed. All behaviors are robustly tested, including edge cases for naming, permissions, and directory creation.

### .xrmignore

The `.xrmignore` file allows users to exclude specific files and directories from extraction, using the same flexible pattern syntax as `.gitignore`. Patterns support wildcards, recursive globs, negation, comments, and unicode or special characters. The tool reads `.xrmignore` from the project root and applies all patterns when discovering and extracting README files. Invalid or malformed `.xrmignore` files result in a clear error. All ignore logic is fully tested, including edge cases for pattern precedence, negation, large ignore files, and handling of hidden or deeply nested paths.

## extract-readmes CLI

The extract-readmes CLI provides a command-line interface (`xrm`) for extracting README files from a codebase. It supports options for dry runs, generating `.xrmignore` files, displaying help, and showing the current version. The CLI is user-friendly, displays clear output and error messages, and integrates tightly with the core logic. All CLI features and options are fully tested, including error handling, option parsing, and integration with ignore logic.

### --dry-run

The `--dry-run` option allows users to preview which `README.md` files would be extracted without making any changes to the filesystem. When used, the CLI lists all files that would be processed, clearly indicating that no files or directories are created or modified. The dry run respects all `.xrmignore` patterns and core logic constraints, including case-insensitive matching, hidden directories, and symlink handling. This feature is fully tested for accuracy and reliability, even in large or complex codebases.

### --create-ignore

The `--create-ignore` option generates a `.xrmignore` file at the project root, listing all `README.md` files that would be extracted (one per line, as relative paths). This helps users quickly customize which files to include or exclude from extraction. If a `.xrmignore` already exists, the CLI prompts for confirmation or requires a `--force` flag to overwrite. The generated file uses `.gitignore`-style syntax and is fully compatible with the tool’s ignore logic. All behaviors—including file creation, overwriting, formatting, and error handling—are thoroughly tested, even for large projects or permission issues.

### --help, -h

The `--help` (or `-h`) option displays detailed usage information for the extract-readmes CLI. It lists all available commands and options, including `--dry-run`, `--create-ignore`, `--version`, and their descriptions. The help output is formatted for easy reading in the terminal and includes usage examples to guide users. This feature ensures users can quickly understand how to use the tool and all its capabilities. The help output is fully tested for accuracy and completeness.

### --version, -v

The `--version` (or `-v`) option prints the current version of the extract-readmes CLI, as specified in the project's `package.json`. The output is a single line, making it suitable for use in scripts or automation. If the version cannot be determined (for example, due to a missing or malformed `package.json`), the CLI displays a clear error message and exits with a non-zero status code. This feature is fully tested for both normal and error scenarios.

---
README.md generated by **ReqText v0.2.1** on 2025-06-07T18:42:54.549Z

[ReqText GitHub Issues for Support](https://github.com/fred-terzi/reqtext/issues)
