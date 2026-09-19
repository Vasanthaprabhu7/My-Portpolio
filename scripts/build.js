const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Building portfolio for production...');

// Clean existing dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy index.html
const indexHtmlSrc = path.join(rootDir, 'index.html');
const indexHtmlDest = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlSrc)) {
  fs.copyFileSync(indexHtmlSrc, indexHtmlDest);
  console.log('✓ Copied index.html');
}

// Copy asset directories
const folders = ['css', 'js', 'assets'];
folders.forEach((folder) => {
  const src = path.join(rootDir, folder);
  const dest = path.join(distDir, folder);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied ${folder}/`);
  }
});

console.log('Build complete! Output directory: dist/');
