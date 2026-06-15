import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "esnext",
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  // cjs dependences 
banner:{
    js:
    `
    import { createRequire } from "module";
    const require = createRequire(import.meta.url); 
    
    `
    
}
});

