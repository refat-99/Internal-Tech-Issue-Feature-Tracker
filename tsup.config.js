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
});
//# sourceMappingURL=tsup.config.js.map