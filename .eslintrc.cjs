// .eslintrc.cjs

module.exports = {
  // 停止向上查找配置文件
  root: true,
  // 环境 浏览器 es最新语法 node环境
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  /**
   * 扩展eslint的规范语法（第三方提供的定义好的规范），数组中每一个配置继承它前面的配置
   * plugin:vue/vue3-strongly-recommended由eslint-plugin-vue提供，它提供了多个规范，我们使用官方最推荐的
   * airbnb-base由eslint-config-airbnb-base提供
   * prettier由eslint-config-prettier提供
   * eslint-config前缀可省略
   */
  extends: ['plugin:vue/vue3-strongly-recommended', 'airbnb-base', 'prettier'],
  // 指定要使用的解析器，它会将我们写的代码转换成ESTree（AST），eslint对ESTree进行校验
  parser: 'vue-eslint-parser',
  // 解析器的配置项
  parserOptions: {
    ecmaVersion: 'latest', // 支持的es版本
    sourceType: 'module', // 模块类型，默认为script，我们设置为module
    // 额外的语言类型
    ecmaFeatures: {
      tsx: true,
      jsx: true
    }
  },
  // 全局定义的宏，在代码中使用全局变量就不会报错或警告
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  /**
   * 插件
   * 前缀eslint-plugin- 可以省略
   * vue提供了eslint插件eslint-plugin-vue，里面包含了parser和rules，
   * parser为vue-eslint-parser在上面的parser字段，rules为定义好的规则，在extedns字段
   */
  plugins: ['vue', 'prettier'],
  // 自定义规则，优先级最高，覆盖上面extends集成的第三方规则，根据项目实际情况定义,一般情况下不要写太多自定义规则
  settings: {
    'import/resolver': {}
  },
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
    'prefer-const': 'off', // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    'no-use-before-define': 'off', // 禁止在 函数/类/变量 定义之前使用它们
    'no-unused-expressions': 'off', //  禁止直接用 and 符号链接两个方法
    'default-param-last': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'no-nested-ternary': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'prefer-destructuring': 'off',
    'func-names': 'off', // 无名函数
    camelcase: 'off', // 无名函数

    'consistent-return': 'off',
    'no-return-assign': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-lonely-if': 'off',
    'import/resolver': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    // 对后缀的检测
    'no-param-reassign': 'off',
    'vue/v-on-event-hyphenation': 'off',

    // vue (https://eslint.vuejs.org/rules)
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效
    'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
    'vue/no-mutating-props': 'error', // 不允许改变组件 prop
    'vue/custom-event-name-casing': 'error', // 为自定义事件名称强制使用特定大小写
    'vue/attribute-hyphenation': 'error', // 对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
    'vue/attributes-order': 'off', // vue api使用顺序，强制执行属性顺序
    'vue/no-v-html': 'off', // 禁止使用 v-html
    'vue/require-default-prop': 'off', // 此规则要求为每个 prop 为必填时，必须提供默认值
    'vue/multi-word-component-names': 'off' // 要求组件名称始终为 “-” 链接的单词
  }
}
