module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  extends: 'standard',
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    'no-unused-vars': 1,
    'semi': 1,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
