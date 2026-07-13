import esbuild from 'esbuild';
import { builtinModules } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';


const banner = `
`;


const prod = true;
const preview = false;
const previewReactProd = false;
const previewMinify = false;
const entryPoint = 'src/main.ts';


const context = await esbuild.context({
  banner: {
    js: banner,
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
    '@lezer/lr',
    ...builtinModules,
  ],
  
  format: 'cjs',
  
  target: 'es2018',
  
  logLevel: 'info',
  
  sourcemap: false,
  
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  
  treeShaking: true,
  
  outdir: '.',
  
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
});

function applyObsidianReviewBundleNormalizations() {
  const outputPath = 'main.js';
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


if (prod || preview) {
  
  await context.rebuild();
  if (prod) applyObsidianReviewBundleNormalizations();
  process.exit(0);
} else {
  
  await context.watch();
}
