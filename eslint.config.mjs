import { Linter } from "eslint";

const config = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "tss-unused-classes"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:storybook/recommended",
    ],
    rules: {
        "no-extra-boolean-cast": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "prefer-const": "off",
        "tss-unused-classes/unused-classes": "warn",
    },
    ignores: [
        "/node_modules/",
        "/dist/",
        "/.eslintrc.js",
        "/CHANGELOG.md",
        "/src/ui/theme/make-style-edt.ts",
    ],
    overrides: [
        {
            files: ["**/*.stories.*"],
            rules: {
                "import/no-anonymous-default-export": "off",
            },
        },
    ],
};

export default config;
