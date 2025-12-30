/* eslint-disable no-console */
import { cp, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { $ } from 'execa';
import { parse } from 'jsonc-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const $$ = $({ stdio: 'inherit' });

interface RunOptions {
  project: string;
  copy?: string[];
  clean?: boolean;
}

/**
 * Builds type definition files, adds import/export extensions to them
 * and copies them to the specified directories.
 */
async function run(options: RunOptions) {
  await emitDeclarations(options.project);
  await addImportExtensions(options.project);

  const tsConfig = parse(await readFile(options.project, 'utf-8'));
  const {
    compilerOptions: { outDir },
  } = tsConfig;

  const sourceDirectory = path.resolve(outDir);
  const destinations = Array.from(new Set(options.copy ?? []))
    .map((destination) => path.resolve(destination))
    .filter((destination) => destination !== sourceDirectory);

  await Promise.all(destinations.map((destination) => copyDeclarations(sourceDirectory, destination)));

  if (options.clean) {
    await removeDeclarationFiles(sourceDirectory);
  }
}

function emitDeclarations(tsconfig: string) {
  console.log(`Building types for ${path.resolve(tsconfig)}`);
  return $$`tsc --build ${tsconfig}`;
}

function addImportExtensions(tsconfig: string) {
  console.log(`Adding import extensions`);
  return $$`tsc-alias -p ${tsconfig} --verbose`;
}

async function copyDeclarations(sourceDirectory: string, destinationDirectory: string) {
  console.log(`Copying declarations from ${sourceDirectory} to ${destinationDirectory}`);

  return cp(sourceDirectory, destinationDirectory, {
    recursive: true,
    filter: (src) => !src.includes('.') || src.endsWith('.d.ts'), // include directories and .d.ts files
  });
}

async function removeDeclarationFiles(directory: string) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await removeDeclarationFiles(entryPath);
        const remainingEntries = await readdir(entryPath);
        if (remainingEntries.length === 0) {
          await rm(entryPath, { recursive: true, force: true });
        }
        return;
      }

      if (entry.name.endsWith('.d.ts') || entry.name.endsWith('.d.ts.map')) {
        await rm(entryPath, { force: true });
      }
    }),
  );
}

yargs(hideBin(process.argv))
  .command<RunOptions>(
    '$0',
    'Builds type definition files and copies them to the specified directories',
    (command) => {
      return command
        .option('project', {
          alias: 'p',
          type: 'string',
          demandOption: true,
          description: 'Path to the tsconfig file',
        })
        .option('copy', {
          alias: 'c',
          type: 'array',
          description: 'Directories where the type definition files should be copied',
        })
        .option('clean', {
          type: 'boolean',
          default: false,
          description: 'Remove emitted declaration files from the source directory after copying',
        });
    },
    run,
  )
  .help()
  .strict()
  .version(false)
  .parse();
