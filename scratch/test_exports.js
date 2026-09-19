const fs = require('fs');
const code = fs.readFileSync('src/components/hudbird-ui/index.ts', 'utf8');
console.log(code);
