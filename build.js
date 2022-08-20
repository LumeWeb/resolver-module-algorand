import esbuild from "esbuild"

esbuild.buildSync({
    entryPoints: ['src-module/index.ts'],
    outfile: 'dist-module/index.js',
    format: 'esm',
    bundle: true,
    legalComments: 'external',
    //  minify: true
    tsconfig: "tsconfig.module.json",
    define: {
        'global': 'self'
    }
})
