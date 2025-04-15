// eslint.config.js
import js from '@eslint/js';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    js.configs.recommended,
    ...vuePlugin.configs['flat/recommended'],

    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: {
                    ts: tsParser,
                    js: 'espree',
                    template: '@vue/compiler-dom'
                },
                project: './tsconfig.eslint.json',
                extraFileExtensions: ['.vue']
            }
        },
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/html-indent": ["error", 4, {
                "attribute": 1,
                "baseIndent": 1,
                "closeBracket": 0,
                "alignAttributesVertically": true
            }],
            "vue/html-closing-bracket-newline": ["error", {
                "singleline": "never",
                "multiline": "always"
            }],
            "vue/singleline-html-element-content-newline": "off"
        }
    },

    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.eslint.json'
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": "warn"
        }
    }
];