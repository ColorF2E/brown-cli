const program = require('commander');
const { CLIEngine } = require('eslint');
const { logSuccess } = require('../lib/log');
const colorc = require('../lib/get-config')();

program
    .option('-f, --fix', '自动修复')
    .option('-q, --quiet', '安静地校验')
    .parse(process.argv);

let rules = require('../webpack/rules');

if (colorc && colorc.rules) {
    rules = Object.assign({}, rules, colorc.rules);
}

const linter = new CLIEngine({
    fix: program.fix,
    ignorePattern: [],
    useEslintrc: false,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: "babel-eslint",
        sourceType: 'module',
    },
    cwd: process.cwd(),
    env: ['browser'],
    plugins: [
        'vue'
    ],
    rules,
});

const report = linter.executeOnFiles(['src/**/*.js', 'src/**/*.vue']);

CLIEngine.outputFixes(report)

const formatter = require("eslint-friendly-formatter");

console.log(formatter(report.results));

if (report.errorCount) {
    process.exit(1);
} else if (!program.quiet) {
    logSuccess('Perfect code!');
}
