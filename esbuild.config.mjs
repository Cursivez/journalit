import esbuild from 'esbuild';
import { builtinModules } from 'node:module';


const banner = `
`;


const prod = true;
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
  
  minify: prod,
});


if (prod) {
  
  await context.rebuild();
  process.exit(0);
} else {
  
  await context.watch();
}
