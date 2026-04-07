import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.cjs',
  external: ['express', 'vite', 'cors', 'dotenv', '@supabase/supabase-js'],
  format: 'cjs',
}).catch(() => process.exit(1));
