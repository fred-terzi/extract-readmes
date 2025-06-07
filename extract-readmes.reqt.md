<!-- reqt_id: 2025-06-06T00:19:27.491Z-48034d85 --start-->

# 0: extract-readmes 
<!-- reqt_status_field-->
**Status:**
0.1.0

 <!-- reqt_Desc_field-->
**Description**

extract-readmes is a tool to extract all the README.md files from a code base into a READMEs directory. Each README.md will be named from the folder it was extracted from and .RM.md will be appended to the name. 

xrm will be used as the abbreviation for this tool.

.xrmignore will be used to ignore a folder.

<!-- reqt_Accept_field-->
**Acceptance:**

Project Acceptance Criteria:
- 100% Test Coverage of all acceptance criteria in this document.

<!-- reqt_README_field-->
**README:**

**extract-readmes** (abbreviated as `xrm`) is a tool for extracting all `README.md` files from a codebase into a centralized `READMEs` directory. Each extracted README is renamed based on its source folder, with `.RM.md` appended. The tool supports ignoring specific folders or files using a `.xrmignore` file with `.gitignore`-style patterns. All core and CLI features are fully tested and designed for reliability and scalability in large projects.


<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:19:27.491Z-48034d85 --end-->

<!-- reqt_id: 2025-06-06T00:21:14.871Z-795155bd --start-->

### 0.1: AI Instructions 
<!-- reqt_status_field-->
**Status:**
ALWAYS

 <!-- reqt_Desc_field-->
**Description**

ALWAYS use these instructions and design specifications when planning code changes.

<!-- reqt_Accept_field-->
**Acceptance:**

AT NO POINT SHOULD I HAVE TO REMIND YOU TO ONLY USE THESE TOOLS AND WORKFLOWS.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:21:14.871Z-795155bd --end-->

<!-- reqt_id: 2025-06-06T00:21:31.947Z-1ffb1b30 --start-->

#### 0.1.1: 1 Function in 1 File with 1 Test 
<!-- reqt_status_field-->
**Status:**
ALWAYS

 <!-- reqt_Desc_field-->
**Description**

Only 1 function can be exported from a file. There may be helpfer functions for readability, but only 1 function should be exported.

<!-- reqt_Accept_field-->
**Acceptance:**

All files only have one default export, which is a single function.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:21:31.947Z-1ffb1b30 --end-->

<!-- reqt_id: 2025-06-06T00:26:16.998Z-bbfb163b --start-->

#### 0.1.2: DRY - Don't Repeat Yourself 
<!-- reqt_status_field-->
**Status:**
ALWAYS

 <!-- reqt_Desc_field-->
**Description**

There shall be no repeated logic in the codebase. If a function is repeated, it should be extracted to a utility function in the utils directory.

<!-- reqt_Accept_field-->
**Acceptance:**

During all code reviews no duplicated should be found. If duplicated logic is found, it should be extracted to a utility function in the utils directory.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:26:16.998Z-bbfb163b --end-->

<!-- reqt_id: 2025-06-06T00:21:39.082Z-9409919b --start-->

### 0.2: Workspace 
<!-- reqt_status_field-->
**Status:**
DONE

 <!-- reqt_Desc_field-->
**Description**

This section describes the workspace setup for the project, including the tools and configurations used.

<!-- reqt_Accept_field-->
**Acceptance:**

No additional tools or configurations should be added to the workspace without being added here first.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:21:39.082Z-9409919b --end-->

<!-- reqt_id: 2025-06-06T01:54:39.872Z-ac10d578 --start-->

#### 0.2.1: Directory Structure 
<!-- reqt_status_field-->
**Status:**
DESIGN

 <!-- reqt_Desc_field-->
**Description**

All .test.ts files will be in the same directory as the file they are testing. This allows for better organization and easier navigation of the codebase.

<!-- reqt_Accept_field-->
**Acceptance:**

This documentation must match the actual directory structure of the project.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:54:39.872Z-ac10d578 --end-->

<!-- reqt_id: 2025-06-06T00:21:45.491Z-7e3b1c91 --start-->

#### 0.2.2: Typescript with ESM 
<!-- reqt_status_field-->
**Status:**
DONE

 <!-- reqt_Desc_field-->
**Description**

Typescript with ESM (ECMAScript Modules) is used for the project. This allows for modern JavaScript features and better module management.

<!-- reqt_Accept_field-->
**Acceptance:**

No CommonJS modules should be used in the project. All modules should be ESM compatible.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:21:45.491Z-7e3b1c91 --end-->

<!-- reqt_id: 2025-06-06T00:21:56.011Z-c52a4947 --start-->

#### 0.2.3: Vitest with c8 coverage 
<!-- reqt_status_field-->
**Status:**
DONE

 <!-- reqt_Desc_field-->
**Description**

Use Vitest for testing and c8 for code coverage. This allows for fast and efficient testing with good coverage reporting. No other testing frameworks should be used in the project.

<!-- reqt_Accept_field-->
**Acceptance:**

No other testing frameworks should be used in the project. All tests should be written using Vitest and should have corresponding coverage reports generated by c8.

100% code coverage is required to complete any feature or bug fix.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:21:56.011Z-c52a4947 --end-->

<!-- reqt_id: 2025-06-06T00:22:05.729Z-eeb7543f --start-->

#### 0.2.4: ts-node 
<!-- reqt_status_field-->
**Status:**
DONE

 <!-- reqt_Desc_field-->
**Description**

ts-node is used for running TypeScript files directly without needing to compile them first. This allows for faster development and testing cycles.

<!-- reqt_Accept_field-->
**Acceptance:**

ts-node must always work.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:22:05.729Z-eeb7543f --end-->

<!-- reqt_id: 2025-06-06T00:23:31.341Z-22d6e3d1 --start-->

#### 0.2.5: npm scripts 
<!-- reqt_status_field-->
**Status:**
DONE

 <!-- reqt_Desc_field-->
**Description**

npm test = run all tests with coverage
npm build = build the project

<!-- reqt_Accept_field-->
**Acceptance:**

All npm scripts must be documented here.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T00:23:31.341Z-22d6e3d1 --end-->

<!-- reqt_id: 2025-06-06T02:00:26.387Z-dbe3191c --start-->

#### 0.2.6: Error Handling 
<!-- reqt_status_field-->
**Status:**
DESIGN

 <!-- reqt_Desc_field-->
**Description**

All error handling must be done using try/catch blocks. This allows for better error handling and debugging. Must be done gracefully and not crash the process.

<!-- reqt_Accept_field-->
**Acceptance:**

- All error handling in the codebase must use try/catch blocks for asynchronous and synchronous operations that may throw.
- The process must not crash on any handled error; instead, errors must be reported gracefully to the user.
- All error, warning, and success messages must be tested for correct formatting and appearance in the console.
- Automated tests must cover scenarios including:
  - Errors thrown by file system operations (e.g., permission denied, file not found)
  - Invalid or malformed .xrmignore files
  - Unwritable output directories
  - Unexpected exceptions in core logic or CLI
  - Correct display of success, error, and warning symbols in output
- No unhandled promise rejections or uncaught exceptions should occur during normal or error scenarios.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T02:00:26.387Z-dbe3191c --end-->

<!-- reqt_id: 2025-06-06T02:00:36.497Z-80953956 --start-->

#### 0.2.7: Aysnc for all functions 
<!-- reqt_status_field-->
**Status:**
DESIGN

 <!-- reqt_Desc_field-->
**Description**

All exported functions must be async functions. This allows for better performance and scalability.

<!-- reqt_Accept_field-->
**Acceptance:**

All exported functions must be async functions. This allows for better performance and scalability.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T02:00:36.497Z-80953956 --end-->

<!-- reqt_id: 2025-06-06T02:01:02.354Z-f66db433 --start-->

#### 0.2.8: Libraries to Use 
<!-- reqt_status_field-->
**Status:**
DESIGN

 <!-- reqt_Desc_field-->
**Description**

Libraries to use in the project:
- `commander`: For building the CLI interface.
- `fs-extra`: For file system operations (copying files, reading directories, etc.).
- `fast-glob`: For matching files and directories using glob patterns.
- `enquirer`: For interactive prompts and user input.

<!-- reqt_Accept_field-->
**Acceptance:**

No other libraries should be used in the project. All functionality should be implemented using the libraries listed above.

<!-- reqt_README_field-->
**README:**

exclude

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T02:01:02.354Z-f66db433 --end-->

<!-- reqt_id: 2025-06-06T01:25:15.160Z-6d9d7e6a --start-->

## 1: extract-readmes core logic 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

The extract-readmes core will be exposed as an API that will be used by other tool and a CLI.

<!-- reqt_Accept_field-->
**Acceptance:**

100% test coverage of all acceptance criteria in section. It is acceptable to only test the .js rather than .ts directly, but the functions and branch must be 100% covered by tests.

<!-- reqt_README_field-->
**README:**

## Core Logic

The core logic of **extract-readmes** is implemented as an async API, designed for use both programmatically and by the CLI. It provides robust, fully tested functions to:

- Recursively discover all `README.md` (and similar) files in a codebase, with support for custom patterns and case-insensitive matching.
- Exclude files and directories based on `.xrmignore` patterns, using `.gitignore`-style syntax.
- Handle symbolic links safely, avoid infinite loops, and ensure performance on large codebases.
- Return absolute or root-relative paths for all discovered files.
- Gracefully handle errors such as missing directories, permission issues, and malformed ignore files.
- Guarantee 100% test coverage for all logic and edge cases.

This API is the foundation for the CLI and can be integrated into other tools or workflows as needed.
<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:25:15.160Z-6d9d7e6a --end-->

<!-- reqt_id: 2025-06-06T01:27:06.195Z-4c20f1af --start-->

### 1.1: Recursive README and Documentation File Discovery 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

There will be logic to find all README.md files in the codebase. This function will be used not only to extract copies, but also to generate a list of all READMEs in the codebase.

This will be used for the actual extraction but also a dry run to see what would be extracted as well as created a .xrmignore file with all the files so that the user can choose which to include rather than having to type them all out.

The design should allow for adding other file names or patterns in the future, such as `CONTRIBUTING.md`, `CHANGELOG.md`, etc., without significant changes to the core logic.

<!-- reqt_Accept_field-->
**Acceptance:**

- The function must recursively search the entire codebase, starting from a specified root directory, and return a list of all files matching a configurable set of file name patterns (defaulting to `README.md`), regardless of case sensitivity (e.g., `readme.md`, `ReadMe.md` must also be found).
- The function must allow the caller to specify additional file names or glob patterns (such as `CONTRIBUTING.md`, `CHANGELOG.md`, etc.) to search for, without requiring changes to the core logic.
- The function must not return any files located in directories or subdirectories that match any pattern in a `.xrmignore` file, if present at the root.
- The function must handle and skip symbolic links to avoid infinite loops or duplicate results.
- The function must return absolute or root-relative paths for each found file.
- If no matching files are found, the function must return an empty list.
- If the root directory does not exist or is not accessible, the function must throw an appropriate error.
- The function must complete successfully and return correct results even if the codebase contains thousands of directories and files.
- The function must be covered by automated tests for all the above scenarios, including:
  - No matching files present
  - Multiple matching files at various depths
  - Files in ignored directories
  - Files in hidden directories
  - Case-insensitive file matching
  - Symbolic link handling
  - Large directory trees
  - Invalid or missing root directory
  - Use of custom file patterns (e.g., `CONTRIBUTING.md`, `CHANGELOG.md`)

<!-- reqt_README_field-->
**README:**

The core API provides a function to recursively search a codebase for all `README.md` files, supporting case-insensitive matching and custom patterns (e.g., `CONTRIBUTING.md`, `CHANGELOG.md`). The search respects `.xrmignore` patterns to exclude files or directories, and safely handles symbolic links to avoid infinite loops or duplicates. Results are returned as absolute or root-relative paths. The function is robust, scalable to large codebases, and fully tested for edge cases such as hidden directories, symlinks, and custom ignore patterns.
<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:27:06.195Z-4c20f1af --end-->

<!-- reqt_id: 2025-06-06T01:27:39.506Z-f9dbe195 --start-->

### 1.2: READMEs/ 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

The READMEs/ directory will be created to store all the extracted README.md files. Each file will be named based on the folder it was extracted from, with .RM.md appended to the name.

**Example:**
```
ansi-colors.RM.md
```

<!-- reqt_Accept_field-->
**Acceptance:**

- The tool must create a directory named `READMEs` at the root of the project if it does not already exist.
- For each extracted `README.md` file, a new file must be created in the `READMEs/` directory.
- The new file's name must be the name of the folder from which the `README.md` was extracted, with `.RM.md` appended (e.g., extracting from `./ansi-colors/README.md` creates `READMEs/ansi-colors.RM.md`).
- If multiple folders have the same name at different paths, the tool must ensure unique output filenames (e.g., by prefixing with parent directories or using a deterministic scheme).
- The tool must not overwrite existing files in `READMEs/` unless explicitly allowed by a parameter.
- If the `READMEs/` directory is not writable, the tool must throw an appropriate error.
- If a folder does not contain a `README.md`, no file should be created for that folder.
- The tool must handle edge cases such as:
  - Folder names with special characters, spaces, or unicode.
  - Deeply nested folders.
  - Very large numbers of README files.
  - Filesystem case sensitivity (output filenames must be unique even on case-insensitive filesystems).
- All behaviors must be covered by automated tests, including:
  - Creation of the `READMEs/` directory.
  - Naming and uniqueness of output files.
  - Handling of write errors and permission issues.
  - Handling of special characters and edge cases in folder names.

<!-- reqt_README_field-->
**README:**

All extracted `README.md` files are copied into a central `READMEs/` directory at the project root. Each file is renamed using the name of its source folder, with `.RM.md` appended (e.g., extracting from `./ansi-colors/README.md` creates `READMEs/ansi-colors.RM.md`). The tool ensures unique filenames even for folders with the same name at different paths, and handles special characters, deep nesting, and large numbers of files. Existing files are not overwritten unless explicitly allowed. All behaviors are robustly tested, including edge cases for naming, permissions, and directory creation.
<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:27:39.506Z-f9dbe195 --end-->

<!-- reqt_id: 2025-06-06T01:27:44.336Z-058294bd --start-->

### 1.3: .xrmignore 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

.xrmignore will be used to ignore certain folders from being processed by the extract-readmes tool. It will follow the same syntax as .gitignore.

<!-- reqt_Accept_field-->
**Acceptance:**

- The `.xrmignore` file must be read from the root of the project if present.
- The syntax of `.xrmignore` must match that of `.gitignore`, supporting glob patterns, negation (`!`), comments, and blank lines.
- Any directory or file path matching a pattern in `.xrmignore` must be excluded from all extract-readmes operations.
- If `.xrmignore` is malformed or contains invalid patterns, the tool must fail with a clear error message.
- If `.xrmignore` is not present, no paths are excluded by default.
- The tool must handle edge cases, including:
  - Patterns that match hidden directories or files.
  - Patterns that use wildcards, recursive globs (`**`), or character ranges.
  - Negated patterns that re-include previously excluded paths.
  - Large `.xrmignore` files with hundreds of patterns.
  - Unicode and special characters in patterns and paths.
- All behaviors must be covered by automated tests, including:
  - Exclusion and inclusion of files/folders based on patterns.
  - Handling of invalid or missing `.xrmignore`.
  - Pattern precedence and negation.
  - Performance with large ignore files.

<!-- reqt_README_field-->
**README:**

### .xrmignore Support

The `.xrmignore` file allows users to exclude specific files and directories from extraction, using the same flexible pattern syntax as `.gitignore`. Patterns support wildcards, recursive globs, negation, comments, and unicode or special characters. The tool reads `.xrmignore` from the project root and applies all patterns when discovering and extracting README files. Invalid or malformed `.xrmignore` files result in a clear error. All ignore logic is fully tested, including edge cases for pattern precedence, negation, large ignore files, and handling of hidden or deeply nested paths.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:27:44.336Z-058294bd --end-->

<!-- reqt_id: 2025-06-06T01:31:12.594Z-4cd86c5c --start-->

## 2: extract-readmes CLI 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

The extract-readmes CLI will be called xrm and will provide a simple interface for users to extract README.md files from their codebase. It will use the core logic from the extract-readmes module and provide options for dry runs, creating ignore files.

<!-- reqt_Accept_field-->
**Acceptance:**

- The CLI must provide a command named `xrm` that invokes the extract-readmes functionality from the core module.
- The CLI must accept a root directory as an argument or use the current working directory by default.
- The CLI must support the `--dry-run`, `--create-ignore`, `--help`, and `--version` options as described in child requirements.
- The CLI must display clear, user-friendly output for all operations, including errors and warnings.
- The CLI must exit with a non-zero status code on error and zero on success.
- The CLI must handle and report errors such as missing root directory, permission issues, or malformed `.xrmignore` files.
- The CLI must be covered by automated tests for all behaviors, including:
  - Successful extraction
  - Error handling (invalid directory, permissions, etc.)
  - Option parsing and help/version output
  - Integration with core logic and ignore file handling

<!-- reqt_README_field-->
**README:**

@TODO: Create readme section after the implementation is finalized.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:31:12.594Z-4cd86c5c --end-->

<!-- reqt_id: 2025-06-06T01:31:55.565Z-5df01fb9 --start-->

### 2.1: --dry-run 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

The --dry-run option will allow users to see what README.md files would be extracted without actually performing the extraction. This is useful for verifying which files will be processed and for generating a .xrmignore file.

<!-- reqt_Accept_field-->
**Acceptance:**

- When the `--dry-run` option is provided, the CLI must list all README.md files that would be extracted, without creating or modifying any files or directories.
- The output must clearly indicate that no files were written or changed.
- The dry run must respect `.xrmignore` patterns and all core logic constraints (case-insensitive, hidden directories, symlinks, etc.).
- The dry run must complete successfully and provide accurate results even for large codebases.
- The CLI must exit with a non-zero status code if an error occurs during the dry run.
- Automated tests must cover scenarios including:
  - No README files present
  - Multiple README files at various depths
  - README files in ignored or hidden directories
  - Large directory trees
  - Error conditions (invalid root, permission denied, etc.)

<!-- reqt_README_field-->
**README:**

@TODO: Create readme section after the implementation is finalized.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:31:55.565Z-5df01fb9 --end-->

<!-- reqt_id: 2025-06-06T01:32:01.580Z-91a32361 --start-->

### 2.2: --create-ignore 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

This will create an .xrmignore file with all the README.md files that would be extracted. This allows users to easily manage which files they want to include or exclude from the extraction process without having to manually type them out.

<!-- reqt_Accept_field-->
**Acceptance:**

- When the `--create-ignore` option is provided, the CLI must generate a `.xrmignore` file at the root of the project, listing all README.md files that would be extracted (one per line, as relative paths).
- If a `.xrmignore` file already exists, the CLI must prompt the user or require a `--force` flag to overwrite it.
- The generated `.xrmignore` file must use valid `.gitignore`-style syntax and be compatible with the ignore logic in the core module.
- The CLI must handle and report errors such as permission denied or invalid root directory.
- The CLI must not modify or create any other files or directories during this operation.
- Automated tests must cover scenarios including:
  - Creation of `.xrmignore` when none exists
  - Overwriting with `--force`
  - Handling of permission errors
  - Large numbers of README files
  - Correct formatting and content of the generated ignore file

<!-- reqt_README_field-->
**README:**

@TODO: Create readme section after the implementation is finalized.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:32:01.580Z-91a32361 --end-->

<!-- reqt_id: 2025-06-06T01:49:32.363Z-eca1ca9e --start-->

### 2.3: --help, -h 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

Displays help information about the extract-readmes CLI tool, including available commands, options, and usage examples.

<!-- reqt_Accept_field-->
**Acceptance:**

- When the `--help` or `-h` flag is provided, the CLI must display a help message describing all available commands, options, and usage examples.
- The help output must include descriptions for `--dry-run`, `--create-ignore`, `--version`, and any other supported options.
- The help message must be clear, concise, and formatted for easy reading in a terminal.
- The CLI must exit with a status code of 0 after displaying help.
- The help output must be tested for accuracy and completeness, including edge cases such as unknown options or subcommands.

<!-- reqt_README_field-->
**README:**

@TODO: Create readme section after the implementation is finalized.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:49:32.363Z-eca1ca9e --end-->

<!-- reqt_id: 2025-06-06T01:49:38.393Z-a4719bf5 --start-->

### 2.4: --version, -v 
<!-- reqt_status_field-->
**Status:**
PASSED

 <!-- reqt_Desc_field-->
**Description**

Displays the current version of the extract-readmes CLI tool.

<!-- reqt_Accept_field-->
**Acceptance:**

- When the `--version` or `-v` flag is provided, the CLI must print the current version of the extract-readmes tool as specified in `package.json`.
- The version output must be a single line, suitable for use in scripts or automation.
- The CLI must exit with a status code of 0 after displaying the version.
- If the version cannot be determined (e.g., missing or malformed `package.json`), the CLI must display a clear error message and exit with a non-zero status code.
- Automated tests must cover normal and error scenarios for version output.

<!-- reqt_README_field-->
**README:**

@TODO: Create readme section after the implementation is finalized.

<!-- Make Content "exclude" to exclude from README generation -->
---
<!-- reqt_id: 2025-06-06T01:49:38.393Z-a4719bf5 --end-->