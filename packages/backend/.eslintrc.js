module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1 // https://eslint.org/docs/rules/indent
            }
        ],
        "linebreak-style": ["error", "windows"],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};