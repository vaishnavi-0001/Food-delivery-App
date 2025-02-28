import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import { dirname } from "path" // Removed `resolve`
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default [
      {
            ignores: ["node_modules", "dist", "dist/**/*.js"],

            languageOptions: {
                  ecmaVersion: "latest",
                  sourceType: "module",
                  parser: tsparser,
                  parserOptions: {
                        // project: resolve(__dirname, "tsconfig.json"), // Keep commented if needed
                        tsconfigRootDir: __dirname,
                  },
            },

            plugins: {
                  "@typescript-eslint": tseslint,
            },

            rules: {
                  "no-unused-vars": "warn",
                  "no-console": "off",
                  "@typescript-eslint/no-unused-vars": "warn",
                  "@typescript-eslint/no-explicit-any": "warn",
                  "dot-notation": "error",
            },
      },
]
