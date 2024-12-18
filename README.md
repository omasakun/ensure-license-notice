<br>
<div align="center">
  <h1>Ensure License Notice</h1>
  <p>Ensure that all source files contain a license notice</p>
</div>
<br>
<br>

If you use a license such as MPL-2.0, it is recommended to include a license notice in each source file.

This simple tool ensures that all source files contain the license notice, with respect to the `.gitignore` file.

## Get started with [Husky](https://github.com/typicode/husky) & [Lint Staged](https://github.com/lint-staged/lint-staged)

First, install the required packages and set up Husky:

```bash
npm install --save-dev husky lint-staged ensure-license-notice
npx husky init
echo 'npx lint-staged' > .husky/pre-commit
chmod +x .husky/pre-commit
```

Then, add the following configuration to `package.json`:

```json
{
  "lint-staged": {
    "*": "ensure-license-notice"
  }
}
```

Now, Husky will run `ensure-license-notice` before committing changes.

Set up the configuration file (`notice.json`) as described below.

## Usage

To use this tool, run the following command:

```bash
npx ensure-license-notice
```

## Options

- `-c, --config <path>`: Path to the configuration file (default: `notice.json`)
- `-r, --root <path>`: Path to the root directory (default: current working directory)

## Configuration

The configuration file is a JSON file with the following structure:

```jsonc
{
  "$schema": "node_modules/ensure-license-notice/schema.json",
  "licenseHash": "3f3d9e0024b1921b067d6f7f88deb4a60cbe7a78e76c64e3f1d7fc3b779b9d04",
  "notice": [
    "This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.",
    "If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.",
  ],
  "excludedPrefix": [".git/", ".husky/", "LICENSE"],
  "excludedSuffix": [
    ".editorconfig",
    ".gitignore",
    ".json",
    ".md",
    ".npmrc",
    ".prettierrc",
    ".tool-versions",
    ".yaml",
  ],
  "excluded": ["src/third-party.ts"],
}
```

The license hash will be displayed the first time you run this tool.

See [schema.json](./schema.json) for the schema definition.

## License

This project is licensed under [MPL-2.0](./LICENSE).

Copyright 2024 omasakun
