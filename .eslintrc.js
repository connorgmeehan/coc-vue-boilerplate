module.exports =  {
  parser: 'vue-eslint-parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:vue/essential',
    // 'eslint:recommended',
    '@vue/typescript',
    'plugin:import/errors',
    'plugin:import/typescript'
  ],
  parserOptions:  {
    parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    ecmaFeatures:  {
      jsx:  true,  // Allows for the parsing of JSX
    },
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'indent': ['warn', 2],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "vue/no-v-model-argument": 'off',
    "@typescript-eslint/ban-ts-comment": 'off',
    'vue/no-multiple-template-root': 'off',
  },
};
