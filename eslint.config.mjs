import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // add semi rule
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-console": ["error"]
    },
  },
];

export default eslintConfig;
