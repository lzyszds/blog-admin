import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';

export default [
  {
    ...js.configs.recommended,
  },
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      ...pluginImport.configs.recommended.rules, // 引入插件推荐的规则

      // 强制模块导入的顺序
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'pathGroups': [],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc', /* 按字母升序排序 */
          caseInsensitive: true, /* 忽略大小写 */
        },
      }],

      // 确保导入的模块可以解析
      'import/no-unresolved': 'error',

      // 禁止导入自身
      'import/no-self-import': 'error',

      // 禁止循环引用
      'import/no-cycle': 'error',

      // 禁止导入已废弃的模块
      'import/no-deprecated': 'warn',

      // 强制导入语句后有空行
      'import/newline-after-import': 'error',

      // 禁止导入不需要的模块
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      }],

      // 强制使用一致的路径分隔符
      // 'import/no-useless-path-segments': ['error', {
      //   noUselessIndex: true,
      //   commonjs: true,
      // }],

      // 强制使用绝对或相对导入 (根据你的喜好配置)
      // 'import/no-relative-parent-imports': 'warn',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'], // 确保可以解析这些扩展名
        },
        // 如果你使用了路径别名 (例如在 webpack 或 vite 中配置了)，可以在这里配置
        // alias: {
        //   map: [
        //     ['@', './src'],
        //   ],
        //   extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        // },
      },
    },
  },
];
