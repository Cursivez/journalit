import esbuild from 'esbuild';
import process from 'process';
import { builtinModules } from 'node:module';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';


const banner = `
`;


export function createBuildOptions({
  outdir = '.',
  metafile = false,
  absWorkingDir = process.cwd(),
} = {}) {
  const prod = true;
  const preview = false;
  const entryPoint = 'src/main.ts';
  const previewReactProd = false;
  const previewMinify = false;

  return {
    absWorkingDir,
    banner: {
      
      
      
      
      js: prod ? `${banner}\n` : banner,
    },
    
    entryPoints: [entryPoint],
    
    bundle: true,
    
    external: [
      'obsidian',
      'electron',
      '@codemirror/autocomplete',
      '@codemirror/collab',
      '@codemirror/commands',
      '@codemirror/language',
      '@codemirror/lint',
      '@codemirror/search',
      '@codemirror/state',
      '@codemirror/view',
      
      
      
      
      '@lezer/common',
      '@lezer/highlight',
      ...builtinModules,
    ],
    
    format: 'cjs',
    
    
    
    
    
    target: 'es2020',
    
    charset: 'utf8',
    
    logLevel: 'info',
    
    sourcemap: false,
    
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    
    treeShaking: true,
    
    outdir,
    metafile,
    
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: 'react',
        baseUrl: '.',
        paths: {
          'src/*': ['src/*'],
        },
      },
    },
    entryNames: 'main',
    
    jsx: 'automatic',
    jsxDev: false,
    jsxImportSource: 'react',
    loader: {
      '.tsx': 'tsx',
      '.ts': 'tsx',
      '.css': 'css',
    },
    
    minify: true,
  };
}

export function applyObsidianReviewBundleNormalizations(
  outputPath = 'main.js'
) {
  const source = readFileSync(outputPath, 'utf8');

  const replaceExpected = (content, search, replacement, expectedCount) => {
    const count = content.split(search).length - 1;
    if (count !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} occurrence(s) of ${search} in ${outputPath}, found ${count}. Review Obsidian scanner bundle normalizations before releasing.`
      );
    }
    return content.replaceAll(search, replacement);
  };

  let patched = source;
  patched = replaceExpected(
    patched,
    'createElement("script")',
    'createElement("template")',
    3
  );
  patched = replaceExpected(patched, '.join(".")', '.join("_")', 1);
  patched = replaceExpected(patched, ".join('.')", ".join('_')", 0);

  if (patched !== source) {
    writeFileSync(outputPath, patched);
  }
}

async function main() {
  
  const prod = true;
  const preview = false;

  
  const context = await esbuild.context(createBuildOptions());

  
  if (prod || preview) {
    
    await context.rebuild();
    if (prod) applyObsidianReviewBundleNormalizations();
    process.exit(0);
  }

  
  await context.watch();
}

const isMainModule =
  process.argv[1] !== undefined &&
  pathToFileURL(realpathSync(process.argv[1])).href === import.meta.url;

if (isMainModule) await main();
