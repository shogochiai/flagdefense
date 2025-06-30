// Load all source files for testing
const fs = require('fs');
const path = require('path');

// Load source files
const srcPath = path.join(__dirname, '..', 'src');
const files = ['vegetables.js', 'tetromino.js', 'board.js', 'renderer.js', 'input.js', 'storage.js'];

files.forEach(file => {
    const filePath = path.join(srcPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    eval(content);
});